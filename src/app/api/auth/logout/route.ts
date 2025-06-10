import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("tokenPuraRaza");

  if (!token) {
    return NextResponse.json(
      {
        message: "Not logged in",
      },
      {
        status: 401,
      }
    );
  }

  try {
    cookieStore.delete("tokenPuraRaza");

    const response = NextResponse.json(
      {},
      {
        status: 200,
      }
    );

    return response;
  } catch (error) {
    console.log(error);

    let errorMessage = "Unexpected error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { message: errorMessage },
      {
        status: 500,
      }
    );
  }
}
