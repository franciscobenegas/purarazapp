import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableCausaMortandad } from "./data-table";

export async function ListCausaMortandad() {
  const { establesimiento } = getUserFromToken();

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
