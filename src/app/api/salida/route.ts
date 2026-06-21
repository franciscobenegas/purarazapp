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

    // Validar que hay suficiente cantidad en cada categoría
    for (const item of validated.items) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: item.categoriaId },
      });

      if (!categoria) {
        return new NextResponse(`Categoría ${item.categoriaId} no encontrada`, {
          status: 404,
        });
      }

      if ((categoria.cantidad || 0) < item.cantidad) {
        return new NextResponse(
          `Cantidad insuficiente en categoría ${categoria.nombre}. Disponible: ${categoria.cantidad}`,
          { status: 400 },
        );
      }
    }

    // Creamos la salida + auditoría en un solo paso
    const addSalida = await auditCreate("Salida", usuario, async () => {
      return prisma.salida.create({
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

    // Registramos los movimientos para cada item
    for (const item of validated.items) {
      await prisma.movimiento.create({
        data: {
          fecha: new Date(validated.fecha),
          tipo: "SALIDA",
          categoriaId: item.categoriaId,
          cantidad: item.cantidad,
          salidaId: addSalida.id,
          usuario,
          establesimiento,
        },
      });
    }

    // Decrementamos las cantidades en las Categorias correspondientes
    for (const item of validated.items) {
      await prisma.categoria.update({
        where: { id: item.categoriaId },
        data: {
          cantidad: {
            decrement: item.cantidad,
          },
        },
      });
    }

    return NextResponse.json(addSalida);
  } catch (error) {
    console.log("[SALIDA ALTA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
