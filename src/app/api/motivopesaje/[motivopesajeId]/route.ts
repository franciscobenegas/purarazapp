import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function PUT(
  req: Request,
  { params }: { params: { motivopesajeId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};
    const { motivopesajeId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const motivoPesajeUpdate = await prisma.motivoPesaje.update({
      where: {
        id: motivopesajeId,
      },
      data: {
        ...values,
        usuario,
      },
    });

    return NextResponse.json(motivoPesajeUpdate);
  } catch (error) {
    console.log("[MotivoPesaje PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { motivopesajeId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};
    const { motivopesajeId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si el id tipo raza existe
    const motivoPesaje = await prisma.motivoPesaje.findUnique({
      where: { id: motivopesajeId },
    });

    if (!motivoPesaje) {
      return new Response("Motivo Pesaje no encontrada", { status: 404 });
    }

    // Elimina el tipo de raza y en cascada los propietarios
    const deletedMotivoPesaje = await prisma.motivoPesaje.delete({
      where: {
        id: motivopesajeId,
      },
    });

    return NextResponse.json(deletedMotivoPesaje);
  } catch (error) {
    console.error("[MOTIVOPESAJE_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
