import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Rutas públicas (sin autenticación)
const publicRoutes = ["/auth", "/"]; // "/auth" cubre /auth/login, /auth/register, etc.

export async function middleware(request: NextRequest) {

  const token = request.cookies.get("tokenPuraRaza")?.value;
  const { pathname } = request.nextUrl;

  // ✅ Permitir acceso a rutas públicas sin token
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Si ya está logueado y va a /auth/login, redirigir al dashboard
    if (token && pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ❌ Rutas protegidas: requieren token
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};