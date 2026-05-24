import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { auditCreate } from "@/utils/auditoria";
import { z } from "zod";

const PesajeCreateSchema = z.object({
  fecha: z.string(),
  numeroAnimal: z.string().min(1),
  peso: z.number().positive(),
  propietarioId: z.string().min(1),
  categoriaId: z.string().optional(),
  motivoId: z.string().min(1),
  potreroId: z.string().optional(),
  observacion: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken();

    if (!user) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    const { usuario, establesimiento } = user || {};

    const data = await req.json();
    const validated = PesajeCreateSchema.parse(data);

    // 🔎 Validar fecha
    if (!data.fecha) {
      return new NextResponse("La fecha es obligatoria", { status: 400 });
    }

    // Creamos el pesaje + auditoría
    const addPesaje = await auditCreate("Pesaje", usuario, async () => {
      return prisma.pesaje.create({
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
        },
      });
    });

    return NextResponse.json(addPesaje);
  } catch (error) {
    console.log("[PESAJE ALTA]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
