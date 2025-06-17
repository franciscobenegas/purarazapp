import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export async function DELETE(
  req: Request,
  { params }: { params: { estanciaId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { estanciaId } = params;

    console.log("usuairo = ", usuario);

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
