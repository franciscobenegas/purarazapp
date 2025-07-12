import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function POST(req: NextRequest) {
  try {
    const { usuario, establesimiento } = getUserFromToken();

    const data = await req.json();

    const addMotivoEntrada = await prisma.motivoEntrada.create({
      data: {
        establesimiento,
        usuario,
        ...data,
      },
    });

    return NextResponse.json(addMotivoEntrada);
  } catch (error) {
    console.log("[MOTIVOENTRADA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
