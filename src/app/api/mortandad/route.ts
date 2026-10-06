import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { auditCreate } from "@/utils/auditoria";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = getUserFromToken();
    if (!user?.establesimiento) return new NextResponse("No autorizado", { status: 401 });
    const mortandades = await prisma.mortandad.findMany({
      where: { establesimiento: user.establesimiento },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(mortandades);
  } catch (error) {
    console.error("[MORTANDAD GET]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

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
  [key: string]: string | File | undefined;
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();

    if (!user) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    const { usuario, establesimiento } = user || {};

    const formData = await req.formData();

    // Convertimos a objeto
    const data: MortandadFormData = {} as MortandadFormData;
    formData.forEach((value, key) => {
      data[key] = value as string | File;
    });

    // Función para subir si existe archivo
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
                result: UploadApiResponse | undefined,
              ) => {
                if (error) return reject(error);
                if (!result)
                  return reject(
                    new Error("No se recibió respuesta de Cloudinary"),
                  );
                resolve(result);
              },
            )
            .end(buffer);
        },
      );

      return uploadResult.secure_url;
    };

    // Subimos fotos si existen
    const foto1Url = await uploadImage(data.foto1 || null);
    const foto2Url = await uploadImage(data.foto2 || null);
    const foto3Url = await uploadImage(data.foto3 || null);

    // Creamos Mortandad + Movimiento + ajuste de stock de forma atómica.
    // La validación de stock va dentro de la transacción para evitar que dos
    // mortandades simultáneas dejen la cantidad en negativo.
    const addMortandad = await prisma.$transaction(async (tx) => {
      const categoria = await tx.categoria.findUnique({
        where: { id: data.categoriaId },
      });

      if (!categoria) {
        throw new Error("CATEGORIA_NO_ENCONTRADA");
      }

      if ((categoria.cantidad ?? 0) <= 0) {
        throw new Error("STOCK_INSUFICIENTE");
      }

      const mortandad = await auditCreate("Mortandad", usuario, async () => {
        return tx.mortandad.create({
          data: {
            establesimiento,
            usuario,
            fecha: new Date(data.fecha),
            propietarioId: data.propietarioId,
            numeroAnimal: data.numeroAnimal,
            categoriaId: data.categoriaId,
            causaId: data.causaId,
            potreroId: data.potreroId,
            ubicacionGps: data.ubicacionGps,
            foto1: foto1Url,
            foto2: foto2Url,
            foto3: foto3Url,
          },
        });
      });

      // Registramos el movimiento (cantidad 1 para que el ledger cuadre)
      await tx.movimiento.create({
        data: {
          fecha: new Date(data.fecha),
          tipo: "MORTANDAD",
          categoriaId: data.categoriaId,
          cantidad: 1,
          mortandadId: mortandad.id,
          usuario,
          establesimiento,
        },
      });

      // Decrementamos la cantidad en Categoria
      await tx.categoria.update({
        where: { id: data.categoriaId },
        data: { cantidad: { decrement: 1 } },
      });

      return mortandad;
    });

    return NextResponse.json(addMortandad);
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORIA_NO_ENCONTRADA") {
      return new NextResponse("Categoría no encontrada", { status: 404 });
    }
    if (error instanceof Error && error.message === "STOCK_INSUFICIENTE") {
      return new NextResponse("No hay animales suficientes en esta categoría", {
        status: 400,
      });
    }
    console.error("[MORTANDAD]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
