import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function PUT(
  req: Request,
  { params }: { params: { causamortandadId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { causamortandadId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const causaMortandadUpdate = await prisma.causaMortandad.update({
      where: {
        id: causamortandadId,
      },
      data: {
        ...values,
        usuario,
      },
    });

    return NextResponse.json(causaMortandadUpdate);
  } catch (error) {
    console.log("[CausaMortandad PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { causamortandadId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { causamortandadId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si el id tipo raza existe
    const causaMortandad = await prisma.causaMortandad.findUnique({
      where: { id: causamortandadId },
    });

    if (!causaMortandad) {
      return new Response("Tipo de Raza no encontrada", { status: 404 });
    }

    // Elimina el tipo de raza y en cascada los propietarios
    const deletedCausaMortandad = await prisma.causaMortandad.delete({
      where: {
        id: causamortandadId,
      },
    });

    return NextResponse.json(deletedCausaMortandad);
  } catch (error) {
    console.error("[TIPORAZAS_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
