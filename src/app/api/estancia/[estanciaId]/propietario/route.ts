import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function POST(
  req: Request,
  { params }: { params: { estanciaId: string } }
) {
  try {
    const { usuario, establesimiento } = getUserFromToken();
    const data = await req.json();
    const estancia = await prisma.estancia.findUnique({
      where: {
        id: params.estanciaId,
      },
    });

    if (!estancia) {
      return new Response("No existe la estancia", {
        status: 401,
      });
    }

    const addPropietario = await prisma.propietario.create({
      data: {
        establesimiento,
        usuario,
        estanciaId: params.estanciaId,
        ...data,
      },
    });

    return NextResponse.json(addPropietario);
  } catch (error) {
    console.log("[PROPIETARIO]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
