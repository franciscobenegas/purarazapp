import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableMortandad } from "./data-table";

export async function ListMortandad() {
  const { establesimiento } = getUserFromToken();

  const listadoMortandad = await prisma.mortandad.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      propietario: true,
      categoria: true,
      causa: true,
      potrero: true,
    },
  });

  return <DataTableMortandad data={listadoMortandad} />;
}
