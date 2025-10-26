import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableNacimiento } from "./data-table";

export async function ListNacimiento() {
  const user = getUserFromToken();

  const listadoNacimiento = await prisma.nacimiento.findMany({
    where: {
      establesimiento: user?.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      propietario: true,
      potrero: true,
    },
  });

  return <DataTableNacimiento data={listadoNacimiento} />;
}
