import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function PUT(
  req: Request,
  { params }: { params: { mortandadId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { mortandadId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const mortandadUpdate = await prisma.mortandad.update({
      where: {
        id: mortandadId,
      },
      data: {
        ...values,
        usuario,
      },
    });

    return NextResponse.json(mortandadUpdate);
  } catch (error) {
    console.log("[Mortandad PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { mortandadId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { mortandadId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si el id tipo raza existe
    const mortandadDel = await prisma.mortandad.findUnique({
      where: { id: mortandadId },
    });

    if (!mortandadDel) {
      return new Response("Mortandad Id no encontrada", { status: 404 });
    }

    // Elimina el tipo de raza y en cascada los propietarios
    const deletedMortandad = await prisma.mortandad.delete({
      where: {
        id: mortandadId,
      },
    });

    // Decrementamos la cantidad en Categoria
    await prisma.categoria.update({
      where: { id: deletedMortandad.categoriaId },
      data: {
        cantidad: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(deletedMortandad);
  } catch (error) {
    console.error("[MORTANDAD_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
