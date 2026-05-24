import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditCreate } from "@/utils/auditoria";
import z from "zod";

const UpdatePesajeSchema = z.object({
  fecha: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Fecha inválida",
  }),
  numeroAnimal: z.string().min(1),
  peso: z.number().positive(),
  propietarioId: z.string().min(1),
  categoriaId: z.string().optional(),
  motivoId: z.string().min(1),
  potreroId: z.string().optional(),
  observacion: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { pesajeId: string } }
) {
  try {
    const pesajeId = params.pesajeId;

    const user = getUserFromToken();
    const { usuario, establesimiento } = user || {};

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Validar que el ID sea un UUID
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        pesajeId
      )
    ) {
      return NextResponse.json(
        { error: "ID de pesaje inválido" },
        { status: 400 }
      );
    }

    // Verificar que el pesaje exista
    const pesajeExistente = await prisma.pesaje.findUnique({
      where: { id: pesajeId },
    });

    if (!pesajeExistente) {
      return NextResponse.json(
        { error: "Pesaje no encontrado" },
        { status: 404 }
      );
    }

    // Parsear cuerpo
    const body = await request.json();
    const validated = UpdatePesajeSchema.parse(body);

    // Actualizar Pesaje con auditoría
    const updatedPesaje = await auditCreate("Pesaje", usuario, async () => {
      return prisma.pesaje.update({
        where: { id: pesajeId },
        data: {
          fecha: new Date(validated.fecha),
          numeroAnimal: validated.numeroAnimal,
          peso: validated.peso,
          propietarioId: validated.propietarioId,
          categoriaId: validated.categoriaId || null,
          motivoId: validated.motivoId,
          potreroId: validated.potreroId || null,
          observacion: validated.observacion || null,
          usuario,
          establesimiento,
          updatedAt: new Date(),
        },
      });
    });

    return NextResponse.json(updatedPesaje, { status: 200 });
  } catch (error) {
    console.error("Error actualizando pesaje:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pesajeId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};
    const pesajeId = params.pesajeId;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Validación básica del UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pesajeId)) {
      return NextResponse.json(
        { error: "ID de pesaje inválido" },
        { status: 400 }
      );
    }

    // Verificar que el pesaje exista
    const pesajeExistente = await prisma.pesaje.findUnique({
      where: { id: pesajeId },
    });

    if (!pesajeExistente) {
      return NextResponse.json(
        { error: "Pesaje no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el pesaje
    await prisma.pesaje.delete({
      where: { id: pesajeId },
    });

    return NextResponse.json(
      { message: "Pesaje eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar pesaje:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { error: "Pesaje no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
