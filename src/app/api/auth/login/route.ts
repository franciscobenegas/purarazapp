import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/libs/prisma";
import { comparePassword } from "@/utils/hash";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { email, password } = data;

  // chequear email y password si son validos
  // si email existe
  // si password es correcto

  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 401 }
    );
  }

  // Validar si el usuario está activo
  if (!user.activo) {
    return NextResponse.json(
      { error: "Usuario inactivo. Comuníquese con el administrador." },
      { status: 403 }
    );
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  // el usuario y el password son validos
  // se genera el token
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno.");
  }

  const myToken = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      email: user.email,
      usuario: user.username,
      establesimiento: user.establesimiento,
      rol: user.rol,
    },
    process.env.JWT_SECRET
  );

  const cookieStore = await cookies();

  // cookieStore.set("set-Cookies", serializado);
  cookieStore.set("tokenPuraRaza", myToken);

  return NextResponse.json("Login Correcto");
}
