import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditCreate } from "@/utils/auditoria";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();

    if (!user) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    const  { usuario, establesimiento } = user || {};

    const data = await req.json();

    // 🔎 Validar fecha
    if (!data.fecha) {
      return new NextResponse("La fecha es obligatoria", { status: 400 });
    }

    // Creamos el Nacimiento + auditoría en un solo paso
    const addNacimiento = await auditCreate("Nacimiento", usuario, async () => {
      return prisma.nacimiento.create({
        data: {
          establesimiento,
          usuario,
          ...data,
          fecha: new Date(data.fecha),
        },
      });
    });

    // Incrementamos la cantidad en Categoria correspondiente
    // Buscamos la categoría por sexo (RecienNacido) y establesimiento
    const categoria = await prisma.categoria.findFirst({
      where: {
        sexo: data.sexo,
        edad: "RecienNacido", // Un nacimiento siempre es recién nacido
        establesimiento: establesimiento,
      },
    });

    if (categoria) {
      // Registramos el movimiento
      await prisma.movimiento.create({
        data: {
          fecha: new Date(data.fecha),
          tipo: "NACIMIENTO",
          categoriaId: categoria.id,
          cantidad: 1,
          nacimientoId: addNacimiento.id,
          usuario,
          establesimiento,
        },
      });

      await prisma.categoria.update({
        where: { id: categoria.id },
        data: {
          cantidad: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json(addNacimiento);
  } catch (error) {
    console.log("[NACIMIENTO ALTA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
