import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function PUT(
  req: Request,
  { params }: { params: { estanciaId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { estanciaId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const estanciaUpdate = await prisma.estancia.update({
      where: {
        id: estanciaId,
      },
      data: {
        ...values,
        usuario,
      },
    });

    return NextResponse.json(estanciaUpdate);
  } catch (error) {
    console.log("[Estancia PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { estanciaId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { estanciaId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si la estancia existe
    const estancia = await prisma.estancia.findUnique({
      where: { id: estanciaId },
    });

    if (!estancia) {
      return new Response("Estancia no encontrada", { status: 404 });
    }

    // Elimina la estancia y en cascada los propietarios
    const deletedEstancia = await prisma.estancia.delete({
      where: {
        id: estanciaId,
      },
    });

    return NextResponse.json(deletedEstancia);
  } catch (error) {
    console.error("[ESTANCIA_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
