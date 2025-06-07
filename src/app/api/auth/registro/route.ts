import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../../libs/prisma";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("data: ", data);

    const emailFount = await prisma.usuario.findUnique({
      where: {
        email: data.email,
      },
    });

    if (emailFount) {
      return NextResponse.json(
        {
          message: "el Email ya existe",
        },
        { status: 400 }
      );
    }

    const userFount = await prisma.usuario.findUnique({
      where: {
        username: data.username,
      },
    });

    if (userFount) {
      return NextResponse.json(
        { message: "el Usuario ya existe" },
        { status: 400 }
      );
    }

    const hashPassw = await bcrypt.hashSync(data.password, 10);

    const newUser = await prisma.usuario.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashPassw,
        establesimiento: data.establesimiento,
      },
    });

    const { password, ...user } = newUser;

    return NextResponse.json(user);
    console.log(password);
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      {
        status: 500,
      }
    );
  }
}
