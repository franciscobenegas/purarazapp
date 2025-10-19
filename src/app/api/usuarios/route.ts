import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();
    
    if (!user) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }
    const { establesimiento } = user || {};

    const data = await req.json();

    const salt = bcrypt.genSaltSync(10);
    const hashPassw = bcrypt.hashSync(data.password, salt);

    const addUsuario = await prisma.usuario.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashPassw,
        rol: data.rol,
        activo: data.activo,
        establesimiento,
      },
    });

    return NextResponse.json(addUsuario);
  } catch (error) {
    console.log("[Usuario]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
