import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderViewMortandadId } from "./components/HeaderViewMortandadId";
import { InfoViewMortandad } from "./components/InfoViewMortandad";

export default async function ViewMortandadPageId({
  params,
}: {
  params: { mortandadId: string };
}) {
  const { usuario } = getUserFromToken();
  if (!usuario) {
    return redirect("/");
  }

  const mortandad = await prisma.mortandad.findUnique({
    where: { id: params.mortandadId },
    include: {
      propietario: true,
      categoria: true,
      causa: true,
      potrero: true,
    },
  });

  if (!mortandad) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderViewMortandadId />
      <InfoViewMortandad mortandad={mortandad} />
    </div>
  );
}
