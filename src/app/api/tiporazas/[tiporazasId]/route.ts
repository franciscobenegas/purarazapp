import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function PUT(
  req: Request,
  { params }: { params: { tiporazasId: string } }
) {
  try {
    const user = getUserFromToken();
    const  { usuario } = user || {};
    const { tiporazasId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const tipoRazaUpdate = await prisma.tipoRaza.update({
      where: {
        id: tiporazasId,
      },
      data: {
        ...values,
        usuario,
      },
    });

    return NextResponse.json(tipoRazaUpdate);
  } catch (error) {
    console.log("[TipoRaza PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tiporazasId: string } }
) {
  try {
    const user = getUserFromToken();
    const  { usuario } = user || {};
    const { tiporazasId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si el id tipo raza existe
    const tipoRazas = await prisma.tipoRaza.findUnique({
      where: { id: tiporazasId },
    });

    if (!tipoRazas) {
      return new Response("Tipo de Raza no encontrada", { status: 404 });
    }

    // Elimina el tipo de raza y en cascada los propietarios
    const deletedTipoRazas = await prisma.tipoRaza.delete({
      where: {
        id: tiporazasId,
      },
    });

    return NextResponse.json(deletedTipoRazas);
  } catch (error) {
    console.error("[TIPORAZAS_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
