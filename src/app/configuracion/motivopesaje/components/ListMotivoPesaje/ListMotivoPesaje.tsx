import React from "react";
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { DataTableMotivoPesaje } from "./data-table";

export async function ListMotivoPesaje() {
  const { establesimiento } = getUserFromToken();

  const motivoPesaje = await prisma.motivoPesaje.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTableMotivoPesaje data={motivoPesaje} />;
}
