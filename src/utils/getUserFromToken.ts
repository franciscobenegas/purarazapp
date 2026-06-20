// src/utils/getUserFromToken.ts
import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";

export function getUserFromToken() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido");
  }

  // 1. Intentar desde cookie (web app)
  const cookieStore = cookies();
  const cookie = cookieStore.get("tokenPuraRaza");
  let rawToken = cookie?.value;

  // 2. Si no hay cookie, intentar desde Authorization: Bearer (mobile app)
  if (!rawToken) {
    const headerStore = headers();
    const auth = headerStore.get("authorization") ?? headerStore.get("Authorization");
    if (auth?.startsWith("Bearer ")) {
      rawToken = auth.slice(7);
    }
  }

  if (!rawToken) return null;

  try {
    const payload = jwt.verify(rawToken, process.env.JWT_SECRET) as {
      usuario: string;
      establesimiento: string;
      email?: string;
      rol?: string;
    };
    return payload;
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return null;
  }
}



// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export function getUserFromToken() {
//   const cookieStore = cookies();
//   const token = cookieStore.get("tokenPuraRaza");

//   if (!token) {
//     throw new Error("Token no encontrado");
//   }

//   if (!process.env.JWT_SECRET) {
//     throw new Error("JWT_SECRET no está definido");
//   }

//   const payload = jwt.verify(token.value, process.env.JWT_SECRET) as {
//     usuario: string;
//     establesimiento: string;
//   };

//   return payload;
// }
