import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditCreate } from "@/utils/auditoria";
import z from "zod";

// Esquema de validación
const EntradaItemSchema = z.object({
  categoriaId: z.string().min(1),
  cantidad: z.number().int().min(1),
});

const UpdateEntradaSchema = z.object({
  fecha: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Fecha inválida",
  }),
  NombreEstanciaOrigen: z.string().min(1),
  propietarioId: z.string().min(1),
  motivoId: z.string().min(1),
  items: z.array(EntradaItemSchema).min(1, "Debe haber al menos un ítem"),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { entradaId: string } }
) {
  try {
    const entradaId = params.entradaId;

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
        entradaId
      )
    ) {
      return NextResponse.json(
        { error: "ID de entrada inválido" },
        { status: 400 }
      );
    }

    // Verificar que la entrada exista
    const entradaExistente = await prisma.entrada.findUnique({
      where: { id: entradaId },
      include: { items: true },
    });

    if (!entradaExistente) {
      return NextResponse.json(
        { error: "Entrada no encontrada" },
        { status: 404 }
      );
    }

    // Parsear cuerpo
    const body = await request.json();
    const validated = UpdateEntradaSchema.parse(body);

    // Obtener items antiguos para comparar cantidades
    const oldItems = entradaExistente.items || [];

    // Iniciar transacción: revertir ítems antiguos, crear nuevos, actualizar cantidades
    await prisma.$transaction(async (tx) => {
      // 1. Revertir los cambios previos (decrementar cantidades que se incrementaron)
      for (const oldItem of oldItems) {
        await tx.categoria.update({
          where: { id: oldItem.categoriaId },
          data: {
            cantidad: {
              decrement: oldItem.cantidad,
            },
          },
        });
      }

      // 2. Eliminar todos los ítems antiguos y sus movimientos
      await tx.entradaItem.deleteMany({
        where: { entradaId },
      });

      await tx.movimiento.deleteMany({
        where: { entradaId },
      });

      // 3. Actualizar Entrada con auditoría
      await auditCreate("Entrada", usuario, async () => {
        return tx.entrada.update({
          where: { id: entradaId },
          data: {
            fecha: new Date(validated.fecha),
            NombreEstanciaOrigen: validated.NombreEstanciaOrigen,
            propietarioId: validated.propietarioId,
            motivoId: validated.motivoId,
            usuario,
            establesimiento,
            updatedAt: new Date(),
          },
        });
      });

      // 4. Crear nuevos ítems
      await tx.entradaItem.createMany({
        data: validated.items.map((item) => ({
          entradaId,
          categoriaId: item.categoriaId,
          cantidad: item.cantidad,
        })),
      });

      // 5. Crear nuevos movimientos
      for (const item of validated.items) {
        await tx.movimiento.create({
          data: {
            fecha: new Date(validated.fecha),
            tipo: "ENTRADA",
            categoriaId: item.categoriaId,
            cantidad: item.cantidad,
            entradaId,
            usuario,
            establesimiento,
          },
        });
      }

      // 6. Incrementar nuevamente las cantidades
      for (const item of validated.items) {
        await tx.categoria.update({
          where: { id: item.categoriaId },
          data: {
            cantidad: {
              increment: item.cantidad,
            },
          },
        });
      }
    });

    // Responder con la entrada actualizada (opcional: incluir ítems)
    const updated = await prisma.entrada.findUnique({
      where: { id: entradaId },
      include: { items: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error actualizando entrada:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { error: "Entrada no encontrada" },
        { status: 404 }
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
  { params }: { params: { entradaId: string } }
) {
  try {
    const user = getUserFromToken();
    const { usuario } = user || {};
    const entradaId = params.entradaId;

    if (!usuario) {
      return new Response("No tiene autorización para ejecutar este servicio", {
        status: 401,
      });
    }

    // Validación básica del UUID (opcional pero recomendada)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(entradaId)) {
      return NextResponse.json(
        { error: "ID de entrada inválido" },
        { status: 400 },
      );
    }

    // Verificar que la entrada exista (opcional, pero útil para mensajes claros)
    const entradaExistente = await prisma.entrada.findUnique({
      where: { id: entradaId },
    });

    if (!entradaExistente) {
      return NextResponse.json(
        { error: "Entrada no encontrada" },
        { status: 404 },
      );
    }

    // ⚠️ En producción: verifica permisos (ej. que el usuario tenga acceso al establesimiento)

    // Obtener los items de entrada para revertir los cambios en categorías
    const entradaItems = await prisma.entradaItem.findMany({
      where: { entradaId },
    });

    // Eliminar movimientos asociados
    await prisma.movimiento.deleteMany({
      where: { entradaId },
    });

    // Prisma eliminará automáticamente los `EntradaItem` relacionados
    // gracias a `onDelete: Cascade` en la relación (aunque en tu modelo actual NO lo tienes explícito).
    // Pero en tu modelo `EntradaItem`, sí tienes:
    //   entrada     Entrada   @relation(fields: [entradaId], references: [id], onDelete: Cascade)
    // Así que al borrar `Entrada`, los ítems se borran en cascada.

    await prisma.entrada.delete({
      where: { id: entradaId },
    });

    // Revertir cambios en categorías (decrementar cantidades)
    for (const item of entradaItems) {
      await prisma.categoria.update({
        where: { id: item.categoriaId },
        data: {
          cantidad: {
            decrement: item.cantidad,
          },
        },
      });
    }

    return NextResponse.json(
      { message: "Entrada eliminada correctamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error al eliminar entrada:", error);

    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { error: "Entrada no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
