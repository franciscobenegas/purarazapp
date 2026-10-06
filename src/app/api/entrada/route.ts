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
    const entradas = await prisma.entrada.findMany({
      where: { establesimiento: user.establesimiento },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(entradas);
  } catch (error) {
    console.log("[ENTRADA GET]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

const EntradaItemSchema = z.object({
  categoriaId: z.string(),
  cantidad: z.number().int().positive(),
});

const EntradaCreateSchema = z.object({
  fecha: z.string(),
  NombreEstanciaOrigen: z.string(),
  propietarioId: z.string(),
  motivoId: z.string(),
  items: z.array(EntradaItemSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();

    if (!user) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    const { usuario, establesimiento } = user || {};

    const data = await req.json();
    const validated = EntradaCreateSchema.parse(data);

    // 🔎 Validar fecha
    if (!data.fecha) {
      return new NextResponse("La fecha es obligatoria", { status: 400 });
    }

    // Creamos Entrada + Movimientos + ajuste de stock de forma atómica.
    const addEntrada = await prisma.$transaction(async (tx) => {
      // Validamos que todas las categorías existan en el establecimiento
      // para no dejar una entrada sin su ajuste de stock.
      for (const item of validated.items) {
        const categoria = await tx.categoria.findFirst({
          where: { id: item.categoriaId, establesimiento },
        });
        if (!categoria) {
          throw new Error("CATEGORIA_NO_ENCONTRADA");
        }
      }

      const entrada = await auditCreate("Entrada", usuario, async () => {
        return tx.entrada.create({
          data: {
            fecha: new Date(validated.fecha),
            NombreEstanciaOrigen: validated.NombreEstanciaOrigen,
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

      // Registramos el movimiento e incrementamos el stock de cada ítem
      for (const item of validated.items) {
        await tx.movimiento.create({
          data: {
            fecha: new Date(validated.fecha),
            tipo: "ENTRADA",
            categoriaId: item.categoriaId,
            cantidad: item.cantidad,
            entradaId: entrada.id,
            usuario,
            establesimiento,
          },
        });

        await tx.categoria.update({
          where: { id: item.categoriaId },
          data: { cantidad: { increment: item.cantidad } },
        });
      }

      return entrada;
    });

    return NextResponse.json(addEntrada);
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORIA_NO_ENCONTRADA") {
      return new NextResponse(
        "Una de las categorías no existe en este establecimiento",
        { status: 400 },
      );
    }
    console.log("[ENTRADA ALTA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
