import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditCreate } from "@/utils/auditoria";

export async function POST(req: NextRequest) {
  try {
    const { usuario, establesimiento } = getUserFromToken();

    const data = await req.json();

    // Creamos la categoria + auditoría en un solo paso
    const addCategoria = await auditCreate("Categoria", usuario, async () => {
      return prisma.categoria.create({
        data: {
          establesimiento, // asumiendo que así se llama tu campo en el schema
          usuario,
          ...data,
        },
      });
    });

    return NextResponse.json(addCategoria);
  } catch (error) {
    console.log("[CATEGORIA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
