import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = getUserFromToken();
    if (!user?.establesimiento) return new NextResponse("No autorizado", { status: 401 });
    const causas = await prisma.causaMortandad.findMany({
      where: { establesimiento: user.establesimiento },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(causas);
  } catch (error) {
    console.log("[CAUSAMORTANDAD GET]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();

      // ✅ Validación crítica: si no hay usuario, error 401
    if (!user || !user.usuario || !user.establesimiento) {
      return new NextResponse("No autorizado", { status: 401 });
    }

  const { usuario, establesimiento } = user; // Ahora TypeScript sabe que son string

    const data = await req.json();

    const addCausaMortandad = await prisma.causaMortandad.create({
      data: {
        establesimiento,
        usuario,
        ...data,
      },
    });

    return NextResponse.json(addCausaMortandad);
  } catch (error) {
    console.log("[CAUSAMORTANDAD]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
