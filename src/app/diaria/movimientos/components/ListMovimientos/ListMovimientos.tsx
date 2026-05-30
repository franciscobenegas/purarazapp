import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableMovimientos } from "./data-table";

export async function ListMovimientos() {
  const user = getUserFromToken();

  const listadoMovimientos = await prisma.movimiento.findMany({
    where: {
      establesimiento: user?.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      categoria: true,
      entrada: {
        include: {
          propietario: true,
        },
      },
      salida: {
        include: {
          propietario: true,
        },
      },
      nacimiento: {
        include: {
          propietario: true,
        },
      },
      mortandad: {
        include: {
          propietario: true,
        },
      },
    },
  });

  return <DataTableMovimientos data={listadoMovimientos} />;
}
