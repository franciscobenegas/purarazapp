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
    const user = getUserFromToken();
    const  { establesimiento } = user || {};

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
