import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function PUT(
  req: Request,
  { params }: { params: { motivoentradaId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { motivoentradaId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const motivoEntradajeUpdate = await prisma.motivoEntrada.update({
      where: {
        id: motivoentradaId,
      },
      data: {
        ...values,
        usuario,
      },
    });

    return NextResponse.json(motivoEntradajeUpdate);
  } catch (error) {
    console.log("[MotivoEntrada PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { motivoentradaId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { motivoentradaId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si el id tipo raza existe
    const motivoEntrada = await prisma.motivoEntrada.findUnique({
      where: { id: motivoentradaId },
    });

    if (!motivoEntrada) {
      return new Response("Motivo Entrada no encontrada", { status: 404 });
    }

    // Elimina el tipo de raza y en cascada los propietarios
    const deletedMotivoEntrada = await prisma.motivoEntrada.delete({
      where: {
        id: motivoentradaId,
      },
    });

    return NextResponse.json(deletedMotivoEntrada);
  } catch (error) {
    console.error("[MOTIVOENTRADA_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
