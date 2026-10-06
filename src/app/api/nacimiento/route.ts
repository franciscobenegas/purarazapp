import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditCreate } from "@/utils/auditoria";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = getUserFromToken();
    if (!user?.establesimiento) return new NextResponse("No autorizado", { status: 401 });
    const nacimientos = await prisma.nacimiento.findMany({
      where: { establesimiento: user.establesimiento },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(nacimientos);
  } catch (error) {
    console.log("[NACIMIENTO GET]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

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

    // Creamos Nacimiento + Movimiento + ajuste de stock de forma atómica.
    // Si algo falla (incluida la ausencia de categoría), se revierte todo.
    const addNacimiento = await prisma.$transaction(async (tx) => {
      // Un nacimiento siempre pertenece a la categoría RecienNacido del sexo
      // informado, dentro del mismo establecimiento.
      const categoria = await tx.categoria.findFirst({
        where: {
          sexo: data.sexo,
          edad: "RecienNacido",
          establesimiento,
        },
      });

      if (!categoria) {
        throw new Error("CATEGORIA_NO_ENCONTRADA");
      }

      const nacimiento = await auditCreate("Nacimiento", usuario, async () => {
        return tx.nacimiento.create({
          data: {
            establesimiento,
            usuario,
            ...data,
            fecha: new Date(data.fecha),
          },
        });
      });

      // Registramos el movimiento
      await tx.movimiento.create({
        data: {
          fecha: new Date(data.fecha),
          tipo: "NACIMIENTO",
          categoriaId: categoria.id,
          cantidad: 1,
          nacimientoId: nacimiento.id,
          usuario,
          establesimiento,
        },
      });

      // Incrementamos la cantidad en la Categoria correspondiente
      await tx.categoria.update({
        where: { id: categoria.id },
        data: { cantidad: { increment: 1 } },
      });

      return nacimiento;
    });

    return NextResponse.json(addNacimiento);
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORIA_NO_ENCONTRADA") {
      return new NextResponse(
        "No existe una categoría 'Recién Nacido' para ese sexo en este establecimiento. Creála antes de registrar el nacimiento.",
        { status: 400 },
      );
    }
    console.log("[NACIMIENTO ALTA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
