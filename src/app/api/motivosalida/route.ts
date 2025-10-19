import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();

    if (!user) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    const  { usuario, establesimiento } = user || {};

    const data = await req.json();

    const addMotivoSalida = await prisma.motivoSalida.create({
      data: {
        establesimiento,
        usuario,
        ...data,
      },
    });

    return NextResponse.json(addMotivoSalida);
  } catch (error) {
    console.log("[MOTIVOSALIDA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
