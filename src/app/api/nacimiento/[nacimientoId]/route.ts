import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditUpdate } from "@/utils/auditoria";

export async function PUT(
  req: Request,
  { params }: { params: { nacimientoId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { nacimientoId } = params;
    const values = await req.json();

    if (!usuario) {
      return new Response("No tiene autorizacion para ejecuar este servicio", {
        status: 401,
      });
    }

    const nacimientoUpdate = await auditUpdate(
      "Nacimiento",
      usuario,
      nacimientoId,
      () => prisma.nacimiento.findUnique({ where: { id: nacimientoId } }),
      () =>
        prisma.nacimiento.update({
          where: { id: nacimientoId },
          data: {
            ...values,
            usuario,
          },
        })
    );

    return NextResponse.json(nacimientoUpdate);
  } catch (error) {
    console.log("[Nacimiento PUT]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { nacimientoId: string } }
) {
  try {
    const { usuario } = getUserFromToken();
    const { nacimientoId } = params;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Elimina el tipo de raza y en cascada los propietarios
    const deletedNacimiento = await prisma.nacimiento.delete({
      where: {
        id: nacimientoId,
      },
    });

    return NextResponse.json(deletedNacimiento);
  } catch (error) {
    console.error("[NACIMIENTO_DELETE_ERROR]:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
