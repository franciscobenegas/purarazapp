import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.error("[FORGOT_PASSWORD] BREVO_API_KEY no está configurada");
      return NextResponse.json({ message: "Error de configuración del servidor" }, { status: 500 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email requerido" }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    // Siempre responder igual para no revelar si el email existe
    if (!usuario) {
      return NextResponse.json({
        message: "Si el correo existe, recibirás un enlace para restablecer tu contraseña.",
      });
    }

    // Invalidar tokens anteriores del mismo email
    await prisma.passwordResetToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await prisma.passwordResetToken.create({
      data: { token, email, expiresAt },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
    const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "noreply@purarazapp.com";

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "PuraRazApp", email: senderEmail },
        to: [{ email }],
        subject: "Restablecer contraseña — PuraRazApp",
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
            <h2 style="color: #1a1a1a;">Restablecer contraseña</h2>
            <p style="color: #555;">Hola <strong>${usuario.username}</strong>,</p>
            <p style="color: #555;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en PuraRazApp.
              Hacé clic en el botón para continuar:
            </p>
            <a href="${resetUrl}"
               style="display: inline-block; margin: 24px 0; padding: 12px 24px;
                      background-color: #16a34a; color: white; text-decoration: none;
                      border-radius: 8px; font-weight: bold;">
              Restablecer contraseña
            </a>
            <p style="color: #999; font-size: 13px;">
              Este enlace vence en <strong>1 hora</strong>. Si no solicitaste este cambio,
              podés ignorar este correo.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="color: #bbb; font-size: 12px;">PuraRazApp — Sistema de Gestión Ganadera</p>
          </div>
        `,
      }),
    });

    return NextResponse.json({
      message: "Si el correo existe, recibirás un enlace para restablecer tu contraseña.",
    });
  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
