import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function POST(req: NextRequest) {
  try {
    const { usuario, establesimiento } = getUserFromToken();

    const data = await req.json();

    const addMotivoPesaje = await prisma.motivoPesaje.create({
      data: {
        establesimiento,
        usuario,
        ...data,
      },
    });

    return NextResponse.json(addMotivoPesaje);
  } catch (error) {
    console.log("[CAUSAMORTANDAD]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
