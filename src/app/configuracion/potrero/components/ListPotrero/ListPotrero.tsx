import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTablePotrero } from "./data-table";
// import { DataTableMotivoSalida } from "./data-table";

export async function ListPotrero() {
  const user = getUserFromToken();

  const potrero = await prisma.potrero.findMany({
    where: {
      establesimiento: user?.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTablePotrero data={potrero} />;
}
