import React from "react";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import prisma from "@/libs/prisma";
import { HeadersTipoRaza } from "./components/HeadersTipoRaza";
import { InfoTipoRazas } from "./components/InfoTipoRazas";

export default async function TipoRazasPageId({
  params,
}: {
  params: { tiporazasId: string };
}) {
  const { usuario } = getUserFromToken();
  if (!usuario) {
    return redirect("/");
  }

  const tipoRazas = await prisma.tipoRaza.findUnique({
    where: { id: params.tiporazasId },
  });

  if (!tipoRazas) {
    return redirect("/");
  }

  return (
    <div>
      <HeadersTipoRaza />
      <InfoTipoRazas TipoRaza={tipoRazas} />
    </div>
  );
}
