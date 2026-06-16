import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function GET() {
  try {
    const token = getUserFromToken();
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { username: token.usuario },
      select: {
        id: true,
        username: true,
        email: true,
        establesimiento: true,
        rol: true,
        activo: true,
        foto: true,
        nombreCompleto: true,
        telefono: true,
        createdAt: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("[PERFIL GET]", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getUserFromToken();
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { username, nombreCompleto, telefono } = await req.json();

    const usuario = await prisma.usuario.findUnique({
      where: { username: token.usuario },
    });

    if (!usuario) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    // Verificar que el nuevo username no esté en uso por otro usuario
    if (username && username !== usuario.username) {
      const existe = await prisma.usuario.findUnique({ where: { username } });
      if (existe) {
        return NextResponse.json(
          { message: "El nombre de usuario ya está en uso" },
          { status: 400 }
        );
      }
    }

    const actualizado = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        ...(username && { username }),
        ...(nombreCompleto !== undefined && { nombreCompleto }),
        ...(telefono !== undefined && { telefono }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        establesimiento: true,
        rol: true,
        foto: true,
        nombreCompleto: true,
        telefono: true,
      },
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error("[PERFIL PUT]", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
