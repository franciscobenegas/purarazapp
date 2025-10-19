import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("tokenPuraRaza")?.value;
  const { pathname } = request.nextUrl;

  // 🚫 Si no hay token, redirigir al login
  if (!jwt) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(jwt, secret);
    console.log("JWT payload", payload);

    // 🔁 Si el usuario ya está logueado y va al login, redirigir al dashboard
    if (pathname === "/auth/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // ✅ Todo correcto, continuar con la solicitud
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*", // protege todo lo que empiece con /dashboard
    "/diaria/:path*",    // protege todo lo que empiece con /diaria
  ],
};
