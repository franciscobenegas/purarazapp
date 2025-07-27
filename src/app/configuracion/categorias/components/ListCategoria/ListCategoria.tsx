import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableCategoria } from "./data-table";
import { runAllSeeds } from "@/lib/seed";

export async function ListCategoria() {
  const { establesimiento, usuario } = getUserFromToken();

  // Ejecutar seeds centralizados
  await runAllSeeds(establesimiento, usuario);

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
