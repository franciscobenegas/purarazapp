import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditUpdate } from "@/utils/auditoria";
import { Prisma, Sexo, Pelaje } from "@prisma/client";

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
    const { usuario } = user || {};
    const { nacimientoId } = params;
    const data: NacimientoFormData = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecutar este servicio", {
        status: 401,
      });
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

    const nacimientoUpdate = await auditUpdate(
      "Nacimiento",
      usuario,
      nacimientoId,
      () => prisma.nacimiento.findUnique({ where: { id: nacimientoId } }),
      () =>
        prisma.nacimiento.update({
          where: { id: nacimientoId },
          data: updateData,
        })
    );

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

    const deletedNacimiento = await prisma.nacimiento.delete({
      where: {
        id: nacimientoId,
      },
    });

    return NextResponse.json(deletedNacimiento);
  } catch (error) {
    console.error("[NACIMIENTO_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
