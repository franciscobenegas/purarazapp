import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditCreate } from "@/utils/auditoria";
import z from "zod";

export const dynamic = 'force-dynamic';

// Esquema de validación
const SalidaItemSchema = z.object({
  categoriaId: z.string().min(1),
  cantidad: z.number().int().min(1),
});

const UpdateSalidaSchema = z.object({
  fecha: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Fecha inválida",
  }),
  NombreEstanciaSalida: z.string().min(1),
  propietarioId: z.string().min(1),
  motivoId: z.string().min(1),
  items: z.array(SalidaItemSchema).min(1, "Debe haber al menos un ítem"),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { salidaId: string } },
) {
  try {
    const salidaId = params.salidaId;

    const user = getUserFromToken();
    const { usuario, establesimiento } = user || {};

    if (!usuario || !establesimiento) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Validar que el ID sea un UUID (opcional pero recomendado)
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        salidaId,
      )
    ) {
      return NextResponse.json(
        { error: "ID de salida inválido" },
        { status: 400 },
      );
    }

    // Verificar que la salida exista
    const salidaExistente = await prisma.salida.findUnique({
      where: { id: salidaId },
      include: { items: true },
    });

    if (!salidaExistente) {
      return NextResponse.json(
        { error: "Salida no encontrada" },
        { status: 404 },
      );
    }

    // Parsear cuerpo
    const body = await request.json();
    const validated = UpdateSalidaSchema.parse(body);

    // Validar que hay suficiente cantidad en cada categoría (considerando lo que ya tenía)
    for (const item of validated.items) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: item.categoriaId },
      });

      if (!categoria) {
        return new NextResponse(`Categoría ${item.categoriaId} no encontrada`, {
          status: 404,
        });
      }

      // Obtener la cantidad anterior para esta categoría en la salida
      const oldItem = salidaExistente.items.find(
        (i) => i.categoriaId === item.categoriaId,
      );
      const oldCantidad = oldItem?.cantidad || 0;
      const diferencia = item.cantidad - oldCantidad;

      // Verificar si hay suficiente para el cambio
      if (diferencia > 0 && (categoria.cantidad || 0) < diferencia) {
        return new NextResponse(
          `Cantidad insuficiente en categoría ${categoria.nombre}. Disponible: ${categoria.cantidad}`,
          { status: 400 },
        );
      }
    }

    // Iniciar transacción: revertir cambios previos, luego aplicar los nuevos
    await prisma.$transaction(async (tx) => {
      // 1. Revertir los cambios previos (sumar cantidades que se restaron)
      for (const item of salidaExistente.items) {
        await tx.categoria.update({
          where: { id: item.categoriaId },
          data: {
            cantidad: {
              increment: item.cantidad,
            },
          },
        });
      }

      // 2. Eliminar todos los ítems antiguos
      await tx.salidaItem.deleteMany({
        where: { salidaId },
      });

      // 3. Actualizar Salida con auditoría
      await auditCreate("Salida", usuario, async () => {
        return tx.salida.update({
          where: { id: salidaId },
          data: {
            fecha: new Date(validated.fecha),
            NombreEstanciaSalida: validated.NombreEstanciaSalida,
            propietarioId: validated.propietarioId,
            motivoId: validated.motivoId,
            usuario,
            establesimiento,
            updatedAt: new Date(),
          },
        });
      });

      // 3.5 Eliminar movimientos antiguos
      await tx.movimiento.deleteMany({
        where: { salidaId },
      });

      // 4. Crear nuevos ítems
      await tx.salidaItem.createMany({
        data: validated.items.map((item) => ({
          salidaId,
          categoriaId: item.categoriaId,
          cantidad: item.cantidad,
        })),
      });

      // 4.5 Crear nuevos movimientos
      for (const item of validated.items) {
        await tx.movimiento.create({
          data: {
            fecha: new Date(validated.fecha),
            tipo: "SALIDA",
            categoriaId: item.categoriaId,
            cantidad: item.cantidad,
            salidaId,
            usuario,
            establesimiento,
          },
        });
      }

      // 5. Decrementar nuevamente las cantidades
      for (const item of validated.items) {
        await tx.categoria.update({
          where: { id: item.categoriaId },
          data: {
            cantidad: {
              decrement: item.cantidad,
            },
          },
        });
      }
    });

    // Responder con la salida actualizada
    const updated = await prisma.salida.findUnique({
      where: { id: salidaId },
      include: { items: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error actualizando salida:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 },
      );
    }

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { error: "Salida no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { salidaId: string } },
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};
    const salidaId = params.salidaId;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Validación básica del UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(salidaId)) {
      return NextResponse.json(
        { error: "ID de salida inválido" },
        { status: 400 },
      );
    }

    // Verificar que la salida exista y obtener sus ítems
    const salidaExistente = await prisma.salida.findUnique({
      where: { id: salidaId },
      include: { items: true },
    });

    if (!salidaExistente) {
      return NextResponse.json(
        { error: "Salida no encontrada" },
        { status: 404 },
      );
    }

    // Eliminar la salida en transacción para revertir los cambios de cantidad
    await prisma.$transaction(async (tx) => {
      // 1. Restaurar las cantidades en las categorías
      for (const item of salidaExistente.items) {
        await tx.categoria.update({
          where: { id: item.categoriaId },
          data: {
            cantidad: {
              increment: item.cantidad,
            },
          },
        });
      }

      // 2. Eliminar los movimientos asociados
      await tx.movimiento.deleteMany({
        where: { salidaId },
      });

      // 3. Eliminar la salida (los ítems se eliminan en cascada)
      await tx.salida.delete({
        where: { id: salidaId },
      });
    });

    return NextResponse.json(
      { message: "Salida eliminada correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar salida:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { error: "Salida no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
