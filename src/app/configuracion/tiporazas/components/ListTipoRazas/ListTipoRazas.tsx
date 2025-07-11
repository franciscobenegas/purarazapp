import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableTpoRaza } from "./data-table";

export async function ListTipoRazas() {
  const { establesimiento } = getUserFromToken();

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
