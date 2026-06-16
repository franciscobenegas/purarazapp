import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const token = getUserFromToken();
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No se envió ningún archivo" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const resultado = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "purarazapp/perfiles",
            transformation: [{ width: 200, height: 200, crop: "fill", gravity: "face" }],
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    const usuario = await prisma.usuario.findUnique({
      where: { username: token.usuario },
    });

    if (!usuario) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { foto: resultado.secure_url },
    });

    return NextResponse.json({ foto: resultado.secure_url });
  } catch (error) {
    console.error("[PERFIL FOTO]", error);
    return NextResponse.json({ message: "Error al subir la imagen" }, { status: 500 });
  }
}
