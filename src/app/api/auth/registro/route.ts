import prisma from "@/libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { runAllSeeds } from "@/lib/seed";

export const dynamic = 'force-dynamic';

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = newUser;

    await runAllSeeds(newUser.establesimiento, newUser.username);

    await enviarCorreoBienvenida(newUser.email, newUser.username);

    return NextResponse.json(user);
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

async function enviarCorreoBienvenida(email: string, username: string) {
  if (!process.env.BREVO_API_KEY) {
    console.error("[REGISTRO] BREVO_API_KEY no está configurada, se omite el correo de bienvenida");
    return;
  }

  try {
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`;
    const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "noreply@purarazapp.com";

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "PuraRazApp", email: senderEmail },
        to: [{ email }],
        subject: "¡Bienvenido a PuraRazApp!",
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background-color: #f9fafb;">
            <div style="background-color: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #eee;">
              <div style="text-align: center; margin-bottom: 8px;">
                <span style="font-size: 40px;">🐂</span>
              </div>
              <h2 style="color: #1a1a1a; text-align: center; margin-top: 0;">¡Bienvenido a PuraRazApp!</h2>
              <p style="color: #555; line-height: 1.5;">Hola <strong>${username}</strong>,</p>
              <p style="color: #555; line-height: 1.5;">
                Gracias por registrarte en <strong>PuraRazApp</strong>. Tu cuenta ya está lista para que empieces
                a gestionar el inventario ganadero de tu establecimiento de forma simple y ordenada.
              </p>
              <p style="color: #555; line-height: 1.5;">Con el sistema vas a poder registrar, por categoría:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr>
                  <td style="padding: 10px 0; color: #555;">🐣 <strong>Nacimientos</strong> — altas por nacimiento</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">📥 <strong>Entradas</strong> — compras o traslados que ingresan</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">📤 <strong>Salidas</strong> — ventas o traslados que egresan</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #555;">⚠️ <strong>Mortandades</strong> — bajas por causa de muerte</td>
                </tr>
              </table>
              <p style="color: #555; line-height: 1.5;">
                Cada movimiento actualiza automáticamente el stock de tu establecimiento, para que siempre tengas
                un control preciso de tu hacienda.
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="${loginUrl}"
                   style="display: inline-block; padding: 12px 28px;
                          background-color: #16a34a; color: white; text-decoration: none;
                          border-radius: 8px; font-weight: bold;">
                  Ingresar a PuraRazApp
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="color: #bbb; font-size: 12px; text-align: center;">
                PuraRazApp — Sistema de Gestión Ganadera
              </p>
            </div>
          </div>
        `,
      }),
    });
  } catch (error) {
    console.error("[REGISTRO] Error al enviar correo de bienvenida:", error);
  }
}
