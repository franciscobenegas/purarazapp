// utils/getUserFromToken.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function getUserFromToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("tokenPuraRaza");

  if (!token) {
    throw new Error("Token no encontrado");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido");
  }

  const payload = jwt.verify(token.value, process.env.JWT_SECRET) as {
    usuario: string;
    establesimiento: string;
  };

  return payload;
}
