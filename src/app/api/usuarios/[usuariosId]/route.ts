import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import bcrypt from "bcryptjs";

export async function PUT(
  req: Request,
  { params }: { params: { usuariosId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};
    const { usuariosId } = params;
    const values = await req.json();

    console.log("values = ", values);

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    // 🔐 Si viene la propiedad password, encriptamos
    if (values.password) {
      const salt = bcrypt.genSaltSync(10);
      values.password = bcrypt.hashSync(values.password, salt);
    }

    const usuariosUpdate = await prisma.usuario.update({
      where: {
        id: usuariosId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(usuariosUpdate);
  } catch (error) {
    console.log("[Usuarios PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { usuariosId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};
    const { usuariosId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Verifica si el id tipo raza existe
    const usuarios = await prisma.usuario.findUnique({
      where: { id: usuariosId },
    });

    if (!usuarios) {
      return new Response("Usuario no encontrada", { status: 404 });
    }

    // Elimina el tipo de raza y en cascada los propietarios
    const deletedUsuarios = await prisma.usuario.delete({
      where: {
        id: usuariosId,
      },
    });

    return NextResponse.json(deletedUsuarios);
  } catch (error) {
    console.error("[USUARIOS_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
