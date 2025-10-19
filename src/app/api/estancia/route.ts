import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();

      // ✅ Validación crítica: si no hay usuario, error 401
    if (!user || !user.usuario || !user.establesimiento) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { usuario, establesimiento } = user; // Ahora TypeScript sabe que son string

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
    const user = getUserFromToken();
    const { establesimiento } = user || {};


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
