import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function DELETE(
  req: Request,
  { params }: { params: { propietarioId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { propietarioId } = params;

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const DeletePropietario = await prisma.propietario.delete({
      where: {
        id: propietarioId,
      },
    });

    return NextResponse.json(DeletePropietario);
  } catch (error) {
    console.log("[PropietarioID Delete] ", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { propietarioId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { propietarioId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const updatePropietario = await prisma.propietario.update({
      where: { id: propietarioId },
      data: {
        ...values,
        usuario,
      },
    });

    return NextResponse.json(updatePropietario);
  } catch (error) {
    console.log("[PropietarioID Update] ", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}
