import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface MortandadFormData {
  fecha: string;
  propietarioId: string;
  numeroAnimal: string;
  categoriaId: string;
  causaId: string;
  potreroId: string;
  ubicacionGps: string;
  foto1?: File;
  foto2?: File;
  foto3?: File;
  [key: string]: string | File | undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { usuario, establesimiento } = getUserFromToken();

    const formData = await req.formData();

    // Convertimos a objeto
    const data: MortandadFormData = {} as MortandadFormData;
    formData.forEach((value, key) => {
      data[key] = value as string | File;
    });
    // Función para subir si existe archivo
    const uploadImage = async (file: File | null): Promise<string | null> => {
      if (!file || !(file instanceof File)) return null;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: `mortandad/${establesimiento}`, public_id: uuidv4() },
              (
                error: UploadApiErrorResponse | undefined,
                result: UploadApiResponse | undefined
              ) => {
                if (error) return reject(error);
                if (!result)
                  return reject(
                    new Error("No se recibió respuesta de Cloudinary")
                  );
                resolve(result);
              }
            )
            .end(buffer);
        }
      );

      return uploadResult.secure_url; // 👈 devolvemos solo la URL
    };

    // Subimos fotos si existen
    const foto1Url = await uploadImage(data.foto1 || null);
    const foto2Url = await uploadImage(data.foto2 || null);
    const foto3Url = await uploadImage(data.foto3 || null);

    const addMortandad = await prisma.mortandad.create({
      data: {
        establesimiento,
        usuario,
        fecha: new Date(data.fecha),
        propietarioId: data.propietarioId,
        numeroAnimal: data.numeroAnimal,
        categoriaId: data.categoriaId,
        causaId: data.causaId,
        potreroId: data.potreroId,
        ubicacionGps: data.ubicacionGps,
        foto1: foto1Url,
        foto2: foto2Url,
        foto3: foto3Url,
      },
    });

    return NextResponse.json(addMortandad);
  } catch (error) {
    console.error("[MORTANDAD]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
