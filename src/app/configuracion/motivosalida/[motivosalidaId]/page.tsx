import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderMotivoSalidaId } from "./components/HeaderMotivoSalidaId";
import { InfoMotivoSalida } from "./components/InfoMotivoSalida";

export default async function MotivoSalidaPageId({
  params,
}: {
  params: { motivosalidaId: string };
}) {
  const { usuario } = getUserFromToken();
  if (!usuario) {
    return redirect("/");
  }

  const motivoSalida = await prisma.motivoSalida.findUnique({
    where: { id: params.motivosalidaId },
  });

  if (!motivoSalida) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderMotivoSalidaId />
      <InfoMotivoSalida motivoSalida={motivoSalida} />
    </div>
  );
}
