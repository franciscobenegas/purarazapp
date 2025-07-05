import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableTpoRaza } from "./data-table";

export async function ListTipoRazas() {
  const { establesimiento } = getUserFromToken();
  console.log("establesimiento", establesimiento);

  const tipoRazas = await prisma.tipoRaza.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log("Tipos de Razas:", tipoRazas);

  return <DataTableTpoRaza data={tipoRazas} />;
}
