import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("tokenPuraRaza");

  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const { email, usuario, establesimiento, rol } = jwt.verify(
    token.value,
    "secreto"
  );

  return NextResponse.json({
    email,
    usuario,
    establesimiento,
    rol,
  });
}
