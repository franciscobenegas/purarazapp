import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function PUT(
  req: Request,
  { params }: { params: { potreroId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};
    const { potreroId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const potreroUpdate = await prisma.potrero.update({
      where: {
        id: potreroId,
      },
      data: {
        ...values,
        usuario,
      },
    });

    return NextResponse.json(potreroUpdate);
  } catch (error) {
    console.log("[Potrero PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { potreroId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};
    const { potreroId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si el id tipo raza existe
    const potrero = await prisma.potrero.findUnique({
      where: { id: potreroId },
    });

    if (!potrero) {
      return new Response("Potrero no encontrada", { status: 404 });
    }

    // Elimina el tipo de raza y en cascada los propietarios
    const deletedPotrero = await prisma.potrero.delete({
      where: {
        id: potreroId,
      },
    });

    return NextResponse.json(deletedPotrero);
  } catch (error) {
    console.error("[POTRERO_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
