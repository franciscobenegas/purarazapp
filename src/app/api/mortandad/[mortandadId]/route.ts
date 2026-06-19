import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import { auditDelete, auditUpdate } from "@/utils/auditoria";

export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface MortandadFormData {
  fecha: string;
  propietarioId: string;
  numeroAnimal: string;
  categoriaId: string;
  causaId: string;
  potreroId: string;
  ubicacionGps: string;
  foto1?: File;
  foto2?: File;
  foto3?: File;
  // Nuevos campos para indicar qué fotos eliminar
  removePhoto1?: string;
  removePhoto2?: string;
  removePhoto3?: string;
  [key: string]: string | File | undefined;
}

export async function PUT(
  req: Request,
  { params }: { params: { mortandadId: string } }
) {
  try {
   const user = getUserFromToken();

    if (!user) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    const  { usuario, establesimiento } = user || {};
    const { mortandadId } = params;

    // Obtener mortandad antigua para comparar
    const mortandadAntigua = await prisma.mortandad.findUnique({
      where: { id: mortandadId },
    });

    if (!mortandadAntigua) {
      return new NextResponse("Mortandad no encontrada", { status: 404 });
    }

    const formData = await req.formData();

    // Convertimos a objeto tipado
    const data: MortandadFormData = {} as MortandadFormData;
    formData.forEach((value, key) => {
      data[key] = value as string | File;
    });

    // Función para subir archivo si existe
    const uploadImage = async (file: File | null): Promise<string | null> => {
      if (!file || !(file instanceof File)) return null;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: `mortandad/${establesimiento}`, public_id: uuidv4() },
              (
                error: UploadApiErrorResponse | undefined,
                result: UploadApiResponse | undefined
              ) => {
                if (error) return reject(error);
                if (!result)
                  return reject(
                    new Error("No se recibió respuesta de Cloudinary")
                  );
                resolve(result);
              }
            )
            .end(buffer);
        }
      );
      return uploadResult.secure_url;
    };

    // Subimos fotos si vienen en el formData
    const foto1Url = await uploadImage(data.foto1 || null);
    const foto2Url = await uploadImage(data.foto2 || null);
    const foto3Url = await uploadImage(data.foto3 || null);

    // Validamos que la categoría exista
    const categoria = await prisma.categoria.findUnique({
      where: { id: data.categoriaId },
    });

    if (!categoria) {
      return new NextResponse("Categoría no encontrada", { status: 404 });
    }

    // Mapeamos valores a actualizar con tipo seguro de Prisma
    const updateData: Prisma.MortandadUpdateInput = {
      fecha: data.fecha ? new Date(data.fecha) : undefined,
      propietario: data.propietarioId
        ? { connect: { id: data.propietarioId } }
        : undefined,
      categoria: data.categoriaId
        ? { connect: { id: data.categoriaId } }
        : undefined,
      causa: data.causaId ? { connect: { id: data.causaId } } : undefined,
      potrero: data.potreroId ? { connect: { id: data.potreroId } } : undefined,
      numeroAnimal: data.numeroAnimal || undefined,
      ubicacionGps: data.ubicacionGps,
      usuario,
      establesimiento,
    };

    // Manejamos las fotos: nuevas subidas o eliminaciones
    if (foto1Url) {
      updateData.foto1 = foto1Url;
    } else if (data.removePhoto1 === "true") {
      updateData.foto1 = null;
    }

    if (foto2Url) {
      updateData.foto2 = foto2Url;
    } else if (data.removePhoto2 === "true") {
      updateData.foto2 = null;
    }

    if (foto3Url) {
      updateData.foto3 = foto3Url;
    } else if (data.removePhoto3 === "true") {
      updateData.foto3 = null;
    }

    // Usar transacción para actualizar mortandad y ajustar cantidades
    await prisma.$transaction(async (tx) => {
      // Si cambió la categoría, ajustar cantidades
      if (mortandadAntigua.categoriaId !== data.categoriaId) {
        // Devolver 1 animal a la categoría anterior
        await tx.categoria.update({
          where: { id: mortandadAntigua.categoriaId },
          data: {
            cantidad: {
              increment: 1,
            },
          },
        });

        // Descontar 1 animal de la nueva categoría
        const nuevaCategoria = await tx.categoria.findUnique({
          where: { id: data.categoriaId },
        });

        if (!nuevaCategoria || (nuevaCategoria.cantidad ?? 0) <= 0) {
          throw new Error("No hay animales suficientes en la nueva categoría");
        }

        await tx.categoria.update({
          where: { id: data.categoriaId },
          data: {
            cantidad: {
              decrement: 1,
            },
          },
        });

        // Actualizar el movimiento con la nueva categoría
        await tx.movimiento.updateMany({
          where: { mortandadId },
          data: {
            categoriaId: data.categoriaId,
            fecha: data.fecha ? new Date(data.fecha) : undefined,
          },
        });
      }

      // Actualizar mortandad
      await auditUpdate(
        "Mortandad",
        usuario,
        mortandadId,
        () => tx.mortandad.findUnique({ where: { id: mortandadId } }),
        () =>
          tx.mortandad.update({
            where: { id: mortandadId },
            data: updateData,
          })
      );
    });

    const mortandadUpdate = await prisma.mortandad.findUnique({
      where: { id: mortandadId },
    });

    return NextResponse.json(mortandadUpdate);
  } catch (error) {
    console.log("[Mortandad PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { mortandadId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};

    const { mortandadId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si el id tipo raza existe
    const mortandadDel = await prisma.mortandad.findUnique({
      where: { id: mortandadId },
    });

    if (!mortandadDel) {
      return new Response("Mortandad Id no encontrada", { status: 404 });
    }

    const deletedMortandad = await auditDelete(
      "Mortandad",
      usuario,
      mortandadId,
      () => prisma.mortandad.findUnique({ where: { id: mortandadId } }),
      () => prisma.mortandad.delete({ where: { id: mortandadId } }),
    );

    // Eliminamos el movimiento asociado
    await prisma.movimiento.deleteMany({
      where: { mortandadId },
    });

    // Decrementamos la cantidad en Categoria
    await prisma.categoria.update({
      where: { id: mortandadDel.categoriaId },
      data: {
        cantidad: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(deletedMortandad);
  } catch (error) {
    console.error("[MORTANDAD_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
