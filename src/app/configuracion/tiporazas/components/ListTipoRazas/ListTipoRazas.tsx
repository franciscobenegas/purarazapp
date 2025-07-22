import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableTpoRaza } from "./data-table";
import { runAllSeeds } from "@/lib/seed";

export async function ListTipoRazas() {
  const { usuario, establesimiento } = getUserFromToken();

  // Ejecutar seeds centralizados
  await runAllSeeds(establesimiento, usuario);

  const tipoRazas = await prisma.tipoRaza.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTableTpoRaza data={tipoRazas} />;
}
