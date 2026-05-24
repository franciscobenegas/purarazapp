import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderViewSalidaId } from "./components/HeaderViewSalidaId";
import { InfoViewSalida } from "./components/InfoViewSalida";

export default async function ViewSalidaPageId({
  params,
}: {
  params: { salidaId: string };
}) {
  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const salida = await prisma.salida.findUnique({
    where: { id: params.salidaId },
    include: {
      propietario: true,
      motivo: true,
      items: {
        include: {
          categoria: true,
        },
      },
    },
  });

  if (!salida) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderViewSalidaId />
      <InfoViewSalida salida={salida} />
    </div>
  );
}
