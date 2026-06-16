import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("tokenPuraRaza");

    if (!token) {
      return NextResponse.json({ message: "No esta Logeado" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "Error de configuración" }, { status: 500 });
    }

    const { email, usuario, establesimiento, rol } = jwt.verify(
      token.value,
      process.env.JWT_SECRET
    );

    // Obtener foto y datos adicionales desde la BD
    const usuarioDB = await prisma.usuario.findUnique({
      where: { username: usuario },
      select: { foto: true },
    });

    return NextResponse.json({
      email,
      usuario,
      establesimiento,
      rol,
      foto: usuarioDB?.foto ?? null,
    });
  } catch {
    return NextResponse.json({ message: "No esta Logeado" }, { status: 401 });
  }
}
