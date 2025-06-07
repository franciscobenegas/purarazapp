import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { email, password } = data;

  console.log(email, password);

  // chequear email y password si son validos
  // si email existe
  // si password es correcto

  if (email === "admin@gmail.com" && password === "admin") {
    // el usuario y el password son validos
    // se genera el token
    const myToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        email: "admin@gmail.com",
        password: "admin",
      },
      "secreto"
    );
    console.log("myToken", myToken);

    const serializado = serialize("tokenPuraRaza", myToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });
    console.log("serializado", serializado);

    //request.cookies.set("Set-Cookies", serializado);
    //request.headers.append("Set-Cookies", serializado);

    const cookieStore = await cookies();

    console.log("cookieStore", cookieStore);

    cookieStore.set("set-Cookies", serializado);

    return NextResponse.json("Login Correcto");
  }

  return new NextResponse("Ops algo salio mal, vuelva a intentarlos", {
    status: 401,
  });
}
