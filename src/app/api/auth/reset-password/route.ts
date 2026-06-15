import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token y contraseña son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { message: "El enlace es inválido o ya fue utilizado." },
        { status: 400 }
      );
    }

    if (resetToken.used) {
      return NextResponse.json(
        { message: "Este enlace ya fue utilizado." },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json(
        { message: "El enlace ha expirado. Solicitá uno nuevo." },
        { status: 400 }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    await prisma.usuario.update({
      where: { email: resetToken.email },
      data: { password: hashPassword },
    });

    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });

    return NextResponse.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
