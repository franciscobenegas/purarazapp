import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditUpdate } from "@/utils/auditoria";
import { Prisma, Sexo, Pelaje } from "@prisma/client";

export const dynamic = 'force-dynamic';

interface NacimientoFormData {
  fecha: string;
  numeroVaca: string;
  numeroTernero: string;
  propietarioId: string;
  potreroId: string;
  sexo: string;
  peso: number;
  pelaje: string;
}

// Función helper para convertir string a enum Sexo
const parseSexo = (sexo: string): Sexo | undefined => {
  if (sexo === "Macho") return Sexo.Macho;
  if (sexo === "Hembra") return Sexo.Hembra;
  return undefined;
};

// Función helper para convertir string a enum Pelaje
const parsePelaje = (pelaje: string): Pelaje | undefined => {
  switch (pelaje) {
    case "Negro":
      return Pelaje.Negro;
    case "Colorado":
      return Pelaje.Colorado;
    case "Blanco":
      return Pelaje.Blanco;
    case "Bayo":
      return Pelaje.Bayo;
    case "Barcino":
      return Pelaje.Barcino;
    case "Overo":
      return Pelaje.Overo;
    case "Hosco":
      return Pelaje.Hosco;
    case "Pampa":
      return Pelaje.Pampa;
    default:
      return undefined;
  }
};

export async function PUT(
  req: Request,
  { params }: { params: { nacimientoId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario, establesimiento } = user || {};
    const { nacimientoId } = params;
    const data: NacimientoFormData = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecutar este servicio", {
        status: 401,
      });
    }

    // Obtener nacimiento anterior para comparar
    const nacimientoAnterior = await prisma.nacimiento.findUnique({
      where: { id: nacimientoId },
    });

    if (!nacimientoAnterior) {
      return new NextResponse("Nacimiento no encontrado", { status: 404 });
    }

    // Mapeamos valores a actualizar con tipo seguro de Prisma
    const updateData: Prisma.NacimientoUpdateInput = {
      fecha: data.fecha ? new Date(data.fecha) : undefined,
      numeroVaca: data.numeroVaca || undefined,
      numeroTernero: data.numeroTernero || undefined,
      sexo: data.sexo ? parseSexo(data.sexo) : undefined, // Convertir a enum
      peso: data.peso ? Number(data.peso) : undefined,
      pelaje: data.pelaje ? parsePelaje(data.pelaje) : undefined, // Convertir a enum
      propietario: data.propietarioId
        ? { connect: { id: data.propietarioId } }
        : undefined,
      potrero: data.potreroId ? { connect: { id: data.potreroId } } : undefined,
      usuario,
    };

    // Usar transacción para actualizar nacimiento y ajustar categorías
    await prisma.$transaction(async (tx) => {
      // Si cambió el sexo, ajustar cantidades en categorías RecienNacido
      if (nacimientoAnterior.sexo !== parseSexo(data.sexo)) {
        // Devolver 1 animal a la categoría anterior
        const categoriaAntigua = await tx.categoria.findFirst({
          where: {
            sexo: nacimientoAnterior.sexo,
            edad: "RecienNacido",
            establesimiento: establesimiento,
          },
        });

        if (categoriaAntigua) {
          await tx.categoria.update({
            where: { id: categoriaAntigua.id },
            data: {
              cantidad: {
                decrement: 1,
              },
            },
          });
        }

        // Descontar 1 animal de la nueva categoría
        const categoriaNueva = await tx.categoria.findFirst({
          where: {
            sexo: parseSexo(data.sexo),
            edad: "RecienNacido",
            establesimiento: establesimiento,
          },
        });

        if (categoriaNueva) {
          await tx.categoria.update({
            where: { id: categoriaNueva.id },
            data: {
              cantidad: {
                increment: 1,
              },
            },
          });

          // Actualizar el movimiento con la nueva categoría
          await tx.movimiento.updateMany({
            where: { nacimientoId },
            data: {
              categoriaId: categoriaNueva.id,
              fecha: data.fecha ? new Date(data.fecha) : undefined,
            },
          });
        }
      } else {
        // Si solo cambió la fecha, actualizar el movimiento
        if (data.fecha) {
          await tx.movimiento.updateMany({
            where: { nacimientoId },
            data: {
              fecha: new Date(data.fecha),
            },
          });
        }
      }

      // Actualizar nacimiento
      await auditUpdate(
        "Nacimiento",
        usuario,
        nacimientoId,
        () => tx.nacimiento.findUnique({ where: { id: nacimientoId } }),
        () =>
          tx.nacimiento.update({
            where: { id: nacimientoId },
            data: updateData,
          })
      );
    });

    const nacimientoUpdate = await prisma.nacimiento.findUnique({
      where: { id: nacimientoId },
    });

    return NextResponse.json(nacimientoUpdate);
  } catch (error) {
    console.log("[Nacimiento PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { nacimientoId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};
    const { nacimientoId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Obtener el nacimiento antes de eliminarlo
    const nacimientoToDelete = await prisma.nacimiento.findUnique({
      where: { id: nacimientoId },
    });

    if (!nacimientoToDelete) {
      return new NextResponse("Nacimiento no encontrado", { status: 404 });
    }

    // Eliminar movimientos asociados
    await prisma.movimiento.deleteMany({
      where: { nacimientoId },
    });

    const deletedNacimiento = await prisma.nacimiento.delete({
      where: {
        id: nacimientoId,
      },
    });

    // Revertir la cantidad en la categoría RecienNacido
    const categoria = await prisma.categoria.findFirst({
      where: {
        sexo: nacimientoToDelete.sexo,
        edad: "RecienNacido",
      },
    });

    if (categoria) {
      await prisma.categoria.update({
        where: { id: categoria.id },
        data: {
          cantidad: {
            decrement: 1,
          },
        },
      });
    }

    return NextResponse.json(deletedNacimiento);
  } catch (error) {
    console.error("[NACIMIENTO_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
