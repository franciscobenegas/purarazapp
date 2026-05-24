import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderViewPesajeId } from "./components/HeaderViewPesajeId";
import { InfoViewPesaje } from "./components/InfoViewPesaje";

export default async function ViewPesajePageId({
  params,
}: {
  params: { pesajeId: string };
}) {
  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const pesaje = await prisma.pesaje.findUnique({
    where: { id: params.pesajeId },
    include: {
      propietario: true,
      motivo: true,
      categoria: true,
      potrero: true,
    },
  });

  if (!pesaje) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderViewPesajeId />
      <InfoViewPesaje pesaje={pesaje} />
    </div>
  );
}
