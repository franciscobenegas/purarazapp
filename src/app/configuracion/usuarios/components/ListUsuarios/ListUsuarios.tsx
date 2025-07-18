import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableUsuarios } from "./data-table";

export async function ListUsuarios() {
  const { establesimiento } = getUserFromToken();

  const usuarios = await prisma.usuario.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTableUsuarios data={usuarios} />;
}
