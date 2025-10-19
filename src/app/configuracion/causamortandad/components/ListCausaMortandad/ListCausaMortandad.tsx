import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableCausaMortandad } from "./data-table";
import { runAllSeeds } from "@/lib/seed";
import { redirect } from "next/navigation";

export async function ListCausaMortandad() {
  const user = getUserFromToken();

  // 🚫 Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return redirect("/auth/login");
  }

  const { establesimiento, usuario } = user;

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
