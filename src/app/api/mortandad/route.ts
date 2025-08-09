import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function POST(req: NextRequest) {
  try {
    const { usuario, establesimiento } = getUserFromToken();

    const data = await req.json();

    const addMortandad = await prisma.mortandad.create({
      data: {
        establesimiento,
        usuario,
        ...data,
        fecha: new Date(data.fecha), // ⬅ convertir a objeto Date
      },
    });

    return NextResponse.json(addMortandad);
  } catch (error) {
    console.log("[MORTANDAD]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
