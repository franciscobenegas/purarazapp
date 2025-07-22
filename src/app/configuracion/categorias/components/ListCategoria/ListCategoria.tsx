import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableCategoria } from "./data-table";

export async function ListCategoria() {
  const { establesimiento } = getUserFromToken();

  const categorias = await prisma.categoria.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTableCategoria data={categorias} />;
}
