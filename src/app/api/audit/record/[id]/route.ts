import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID del registro es requerido" },
        { status: 400 }
      );
    }

    // Obtener registros de auditoría para el ID específico
    const auditRecords = await prisma.auditoria.findMany({
      where: {
        registroId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const parsed = auditRecords.map((r) => ({
      ...r,
      oldValues:
        typeof r.oldValues === "string" ? JSON.parse(r.oldValues) : r.oldValues,
      newValues:
        typeof r.newValues === "string" ? JSON.parse(r.newValues) : r.newValues,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error fetching audit records:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
