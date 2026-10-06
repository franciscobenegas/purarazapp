import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditCreate } from "@/utils/auditoria";
import { z } from "zod";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = getUserFromToken();
    if (!user?.establesimiento) return new NextResponse("No autorizado", { status: 401 });
    const salidas = await prisma.salida.findMany({
      where: { establesimiento: user.establesimiento },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(salidas);
  } catch (error) {
    console.log("[SALIDA GET]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

const SalidaItemSchema = z.object({
  categoriaId: z.string(),
  cantidad: z.number().int().positive(),
});

const SalidaCreateSchema = z.object({
  fecha: z.string(),
  NombreEstanciaSalida: z.string(),
  propietarioId: z.string(),
  motivoId: z.string(),
  items: z.array(SalidaItemSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();

    if (!user) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    const { usuario, establesimiento } = user || {};

    const data = await req.json();
    const validated = SalidaCreateSchema.parse(data);

    // 🔎 Validar fecha
    if (!data.fecha) {
      return new NextResponse("La fecha es obligatoria", { status: 400 });
    }

    // Agrupamos la cantidad total pedida por categoría. Si la misma categoría
    // aparece en varios ítems, se valida contra la suma (evita sobreventa).
    const cantidadPorCategoria = new Map<string, number>();
    for (const item of validated.items) {
      cantidadPorCategoria.set(
        item.categoriaId,
        (cantidadPorCategoria.get(item.categoriaId) ?? 0) + item.cantidad,
      );
    }

    // Creamos Salida + Movimientos + ajuste de stock de forma atómica.
    const addSalida = await prisma.$transaction(async (tx) => {
      // Validación de stock dentro de la transacción (evita condición de carrera)
      for (const [categoriaId, cantidadTotal] of cantidadPorCategoria) {
        const categoria = await tx.categoria.findFirst({
          where: { id: categoriaId, establesimiento },
        });

        if (!categoria) {
          throw new Error(`CATEGORIA_NO_ENCONTRADA:${categoriaId}`);
        }

        if ((categoria.cantidad ?? 0) < cantidadTotal) {
          throw new Error(
            `STOCK_INSUFICIENTE:${categoria.nombre}:${categoria.cantidad ?? 0}`,
          );
        }
      }

      const salida = await auditCreate("Salida", usuario, async () => {
        return tx.salida.create({
          data: {
            fecha: new Date(validated.fecha),
            NombreEstanciaSalida: validated.NombreEstanciaSalida,
            propietarioId: validated.propietarioId,
            motivoId: validated.motivoId,
            usuario,
            establesimiento,
            items: {
              create: validated.items.map((item) => ({
                categoriaId: item.categoriaId,
                cantidad: item.cantidad,
              })),
            },
          },
        });
      });

      // Registramos el movimiento y decrementamos el stock de cada ítem
      for (const item of validated.items) {
        await tx.movimiento.create({
          data: {
            fecha: new Date(validated.fecha),
            tipo: "SALIDA",
            categoriaId: item.categoriaId,
            cantidad: item.cantidad,
            salidaId: salida.id,
            usuario,
            establesimiento,
          },
        });

        await tx.categoria.update({
          where: { id: item.categoriaId },
          data: { cantidad: { decrement: item.cantidad } },
        });
      }

      return salida;
    });

    return NextResponse.json(addSalida);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("CATEGORIA_NO_ENCONTRADA")
    ) {
      return new NextResponse(
        "Una de las categorías no existe en este establecimiento",
        { status: 404 },
      );
    }
    if (error instanceof Error && error.message.startsWith("STOCK_INSUFICIENTE")) {
      const [, nombre, disponible] = error.message.split(":");
      return new NextResponse(
        `Cantidad insuficiente en categoría ${nombre}. Disponible: ${disponible}`,
        { status: 400 },
      );
    }
    console.log("[SALIDA ALTA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
