import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function PUT(
  req: Request,
  { params }: { params: { estanciaId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { estanciaId } = params;
    const values = await req.json();

    console.log("values = ", values);
    console.log("estanciaId  = ", estanciaId);

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const estanciaUpdate = await prisma.estancia.update({
      where: {
        id: estanciaId,
      },
      data: {
        ...values,
        usuario,
      },
    });

    return NextResponse.json(estanciaUpdate);
  } catch (error) {
    console.log("[Estancia PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { estanciaId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { estanciaId } = params;

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const DeleteEstancia = await prisma.estancia.delete({
      where: {
        id: estanciaId,
      },
    });

    return NextResponse.json(DeleteEstancia);
  } catch (error) {
    console.log("[Categoria ID Delete] ", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}
