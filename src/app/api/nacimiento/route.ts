import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditCreate } from "@/utils/auditoria";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();

    if (!user) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    const  { usuario, establesimiento } = user || {};

    const data = await req.json();

    // 🔎 Validar fecha
    if (!data.fecha) {
      return new NextResponse("La fecha es obligatoria", { status: 400 });
    }

    // Creamos la categoria + auditoría en un solo paso
    const addNacimiento = await auditCreate("Nacimiento", usuario, async () => {
      return prisma.nacimiento.create({
        data: {
          establesimiento, // asumiendo que así se llama tu campo en el schema
          usuario,
          ...data,
          fecha: new Date(data.fecha),
        },
      });
    });

    // // Incrementamos la cantidad en Categoria
    // await prisma.categoria.update({
    //   where: { id: data.categoriaId },
    //   data: {
    //     cantidad: {
    //       increment:1
    //     },
    //   },
    // });



    return NextResponse.json(addNacimiento);
  } catch (error) {
    console.log("[NACIMIENTO ALTA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
