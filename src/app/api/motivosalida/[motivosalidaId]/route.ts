import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function PUT(
  req: Request,
  { params }: { params: { motivosalidaId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { motivosalidaId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const motivoSalidaUpdate = await prisma.motivoSalida.update({
      where: {
        id: motivosalidaId,
      },
      data: {
        ...values,
        usuario,
      },
    });

    return NextResponse.json(motivoSalidaUpdate);
  } catch (error) {
    console.log("[MotivoSalida PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { motivosalidaId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { motivosalidaId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si el id tipo raza existe
    const motivoSalida = await prisma.motivoSalida.findUnique({
      where: { id: motivosalidaId },
    });

    if (!motivoSalida) {
      return new Response("Motivo Salida no encontrada", { status: 404 });
    }

    // Elimina el tipo de raza y en cascada los propietarios
    const deletedMotivoSalida = await prisma.motivoSalida.delete({
      where: {
        id: motivosalidaId,
      },
    });

    return NextResponse.json(deletedMotivoSalida);
  } catch (error) {
    console.error("[MOTIVOSALIDA_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
