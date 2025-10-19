import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableMotivoEntrada } from "./data-table";

export async function ListMotivoEntrada() {
  const user = getUserFromToken();

  const motivoEntrada = await prisma.motivoEntrada.findMany({
    where: {
      establesimiento: user?.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTableMotivoEntrada data={motivoEntrada} />;
}
