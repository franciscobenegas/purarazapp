import prisma from "@/libs/prisma";
import { DataTable } from "./data-table";

import { getUserFromToken } from "@/utils/getUserFromToken";

export async function ListEstancia() {
  const { establesimiento } = getUserFromToken();

  const listEstancia = await prisma.estancia.findMany({
    where: { establesimiento: establesimiento },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTable data={listEstancia} />;
}
