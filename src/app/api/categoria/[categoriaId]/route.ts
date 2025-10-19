import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditUpdate } from "@/utils/auditoria";

export async function PUT(
  req: Request,
  { params }: { params: { categoriaId: string } }
) {
  try {
    //const { usuario } = getUserFromToken();

    const user = getUserFromToken();
    const { usuario } = user || {};

    const { categoriaId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const categoriaUpdate = await auditUpdate(
      "Categoria",
      usuario,
      categoriaId,
      () => prisma.categoria.findUnique({ where: { id: categoriaId } }),
      () =>
        prisma.categoria.update({
          where: { id: categoriaId },
          data: {
            ...values,
            usuario,
          },
        })
    );

    return NextResponse.json(categoriaUpdate);
  } catch (error) {
    console.log("[Categoria PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoriaId: string } }
) {
  try {
    
    const user = getUserFromToken();
    const { usuario } = user || {};
    const { categoriaId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si el id tipo raza existe
    const categoriaList = await prisma.categoria.findUnique({
      where: { id: categoriaId },
    });

    if (!categoriaList) {
      return new Response("Categoria no encontrada", { status: 404 });
    }

    // Elimina el tipo de raza y en cascada los propietarios
    const deletedCategoria = await prisma.categoria.delete({
      where: {
        id: categoriaId,
      },
    });

    return NextResponse.json(deletedCategoria);
  } catch (error) {
    console.error("[CATEGORIA_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
