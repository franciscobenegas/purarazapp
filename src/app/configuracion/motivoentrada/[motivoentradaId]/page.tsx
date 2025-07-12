import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderMotivoEntradaId } from "./components/HeaderMotivoEntradaId";
import { InfoMotivoEntrada } from "./components/InfoMotivoEntrada";

export default async function page({
  params,
}: {
  params: { motivoentradaId: string };
}) {
  const { usuario } = getUserFromToken();
  if (!usuario) {
    return redirect("/");
  }

  const motivoEntrada = await prisma.motivoEntrada.findUnique({
    where: { id: params.motivoentradaId },
  });

  if (!motivoEntrada) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderMotivoEntradaId />
      <InfoMotivoEntrada MotivoEntrada={motivoEntrada} />
    </div>
  );
}
