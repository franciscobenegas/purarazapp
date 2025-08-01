import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableCausaMortandad } from "./data-table";
import { runAllSeeds } from "@/lib/seed";

export async function ListCausaMortandad() {
  const { establesimiento, usuario } = getUserFromToken();

  // Ejecutar seeds centralizados
  await runAllSeeds(establesimiento, usuario);

  const causaMortandad = await prisma.causaMortandad.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTableCausaMortandad data={causaMortandad} />;
}
