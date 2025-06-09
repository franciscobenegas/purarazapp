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

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  //if (email === "admin@gmail.com" && password === "admin") {
  // el usuario y el password son validos
  // se genera el token
  const myToken = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      email: user.email,
      usuario: user.username,
      establesimiento: user.establesimiento,
      rol: user.rol,
    },
    "secreto"
  );

  const cookieStore = await cookies();

  // cookieStore.set("set-Cookies", serializado);
  cookieStore.set("tokenPuraRaza", myToken);

  return NextResponse.json("Login Correcto");
  //}

  // return new NextResponse("Ops algo salio mal, vuelva a intentarlos", {
  //   status: 401,
  // });
}
