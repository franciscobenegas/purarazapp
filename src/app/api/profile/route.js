import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("tokenPuraRaza");

  if (!token) {
    return new Response(JSON.stringify({ message: "No esta Logeado" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
  }

  const { email, usuario, establesimiento, rol } = jwt.verify(
    token.value,
    process.env.JWT_SECRET
  );

  return NextResponse.json({
    email,
    usuario,
    establesimiento,
    rol,
  });
}
