import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderViewEntradaId } from "./components/HeaderViewEntradaId";
import { InfoViewEntrada } from "./components/InfoViewEntrada";

export default async function ViewEntradaPageId({
  params,
}: {
  params: { entradaId: string };
}) {
  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const entrada = await prisma.entrada.findUnique({
    where: { id: params.entradaId },
    include: {
      propietario: true,
      motivo: true,
      items: {
        include: {
          categoria: true, // ✅ Agregá esto
        },
      },
    },
  });

  if (!entrada) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderViewEntradaId />
      <InfoViewEntrada entrada={entrada} />
    </div>
  );
}
