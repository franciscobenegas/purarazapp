import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableMotivoSalida } from "./data-table";

export async function ListMotivoSalida() {
  const { establesimiento } = getUserFromToken();

  const motivoSalida = await prisma.motivoSalida.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTableMotivoSalida data={motivoSalida} />;
}
