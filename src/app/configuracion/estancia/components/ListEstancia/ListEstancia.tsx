import prisma from "@/libs/prisma";
import { DataTable } from "./data-table";

import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";

export async function ListEstancia() {
  const user = getUserFromToken();
  // 🚫 Si no hay usuario autenticado, redirigir al login
  if (!user) {
    redirect("/auth/login");
  }
  const { establesimiento } = user;

  const listEstancia = await prisma.estancia.findMany({
    where: { establesimiento: establesimiento },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTable data={listEstancia} />;
}
