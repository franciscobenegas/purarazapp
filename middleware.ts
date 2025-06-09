import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("tokenPuraRaza")?.value;
  console.log("middleware", jwt);

  if (!jwt) return NextResponse.redirect(new URL("/login", request.url));

  // this condition avoid to show the login page if the user is logged in
  if (jwt) {
    if (request.nextUrl.pathname.includes("/login")) {
      try {
        await jwtVerify(jwt, new TextEncoder().encode("secreto"));
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (error) {
        return NextResponse.next();
        console.log(error);
      }
    }
  }

  try {
    const { payload } = await jwtVerify(
      jwt, // Pass the JWT as a string
      new TextEncoder().encode("secreto")
    );
    console.log("payload", payload);

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
    console.log(error);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
