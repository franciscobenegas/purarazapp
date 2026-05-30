import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditCreate } from "@/utils/auditoria";
import { z } from "zod";

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

    // Creamos la entrada + auditoría en un solo paso
    const addNacimiento = await auditCreate("Entrada", usuario, async () => {
      return prisma.entrada.create({
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

    // Registramos los movimientos para cada item
    for (const item of validated.items) {
      await prisma.movimiento.create({
        data: {
          fecha: new Date(validated.fecha),
          tipo: "ENTRADA",
          categoriaId: item.categoriaId,
          cantidad: item.cantidad,
          entradaId: addNacimiento.id,
          usuario,
          establesimiento,
        },
      });
    }

    // Incrementamos las cantidades en las Categorias correspondientes
    for (const item of validated.items) {
      await prisma.categoria.update({
        where: { id: item.categoriaId },
        data: {
          cantidad: {
            increment: item.cantidad,
          },
        },
      });
    }

    return NextResponse.json(addNacimiento);
  } catch (error) {
    console.log("[NACIMIENTO ALTA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
