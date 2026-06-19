import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = getUserFromToken();

  if (!user) {
    return NextResponse.json({ needsSetup: false });
  }

  const estancia = await prisma.estancia.findFirst({
    where: { establesimiento: user.establesimiento },
    include: { propietario: { take: 1 } },
  });

  const needsSetup = !estancia || estancia.propietario.length === 0;

  return NextResponse.json({
    needsSetup,
    estanciaId: estancia?.id ?? null,
  });
}
