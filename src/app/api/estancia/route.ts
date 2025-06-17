import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function POST(req: NextRequest) {
  try {
    const { usuario, establesimiento } = getUserFromToken();

    const data = await req.json();

    const addEstancia = await prisma.estancia.create({
      data: {
        establesimiento,
        usuario,
        ...data,
      },
    });

    return NextResponse.json(addEstancia);
  } catch (error) {
    console.log("[ESTANCIA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

export async function GET() {
  try {
    const { establesimiento } = getUserFromToken();

    const ListadoEstancia = await prisma.estancia.findMany({
      where: {
        establesimiento: establesimiento,
      },
    });

    return NextResponse.json(ListadoEstancia);
  } catch (error) {
    console.log("[ESTANCIA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
