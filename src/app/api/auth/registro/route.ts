import prisma from "@/libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const userFount = await prisma.usuario.findUnique({
      where: {
        username: data.username,
      },
    });

    if (userFount) {
      return NextResponse.json(
        { message: "El Usuario ya existe" },
        { status: 400 }
      );
    }

    const emailFount = await prisma.usuario.findUnique({
      where: {
        email: data.email,
      },
    });

    if (emailFount) {
      return NextResponse.json(
        {
          message: "El Email ya existe",
        },
        { status: 400 }
      );
    }

    const establesimientoFount = await prisma.usuario.findFirst({
      where: {
        establesimiento: data.establesimiento,
      },
    });

    if (establesimientoFount) {
      return NextResponse.json(
        { message: "El Establesimiento ya existe" },
        { status: 400 }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassw = bcrypt.hashSync(data.password, salt);

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
