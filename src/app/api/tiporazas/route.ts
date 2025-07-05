import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function POST(req: NextRequest) {
  try {
    const { usuario, establesimiento } = getUserFromToken();

    const data = await req.json();

    const addTipoRazas = await prisma.tipoRaza.create({
      data: {
        establesimiento,
        usuario,
        ...data,
      },
    });

    return NextResponse.json(addTipoRazas);
  } catch (error) {
    console.log("[TIPORAZAS]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

export async function GET() {
  try {
    const { establesimiento } = getUserFromToken();

    const ListadoTipoRazas = await prisma.tipoRaza.findMany({
      where: {
        establesimiento,
      },
    });

    return NextResponse.json(ListadoTipoRazas);
  } catch (error) {
    console.log("[TIPORAZAS]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
