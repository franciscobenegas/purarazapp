import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableTpoRaza } from "./data-table";
import { runAllSeeds } from "@/lib/seed";
import { redirect } from "next/navigation";

export async function ListTipoRazas() {
  const user = getUserFromToken();

  if (!user) {
    return redirect("/auth/login");
  }

  // Ejecutar seeds centralizados
  await runAllSeeds(user.establesimiento, user.usuario);

  const tipoRazas = await prisma.tipoRaza.findMany({
    where: {
      establesimiento: user?.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DataTableTpoRaza data={tipoRazas} />;
}
