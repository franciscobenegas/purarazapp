import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = getUserFromToken();
    if (!user?.establesimiento) return new NextResponse("No autorizado", { status: 401 });
    const potreros = await prisma.potrero.findMany({
      where: { establesimiento: user.establesimiento },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(potreros);
  } catch (error) {
    console.log("[POTRERO GET]", error);
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

    const addPotrero = await prisma.potrero.create({
      data: {
        establesimiento,
        usuario,
        ...data,
      },
    });

    return NextResponse.json(addPotrero);
  } catch (error) {
    console.log("[POTRERO]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
