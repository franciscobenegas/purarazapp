import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableCategoria } from "./data-table";
import { runAllSeeds } from "@/lib/seed";
import { redirect } from "next/navigation";

export async function ListCategoria() {
  const user = getUserFromToken();

  // 🚫 Si no hay usuario autenticado, redirigir al login
  if (!user) {
    redirect("/auth/login");
  }

  const { usuario, establesimiento } = user;

  // ✅ Ahora TypeScript sabe que son string
  await runAllSeeds(establesimiento, usuario);

  const categorias = await prisma.categoria.findMany({
    where: { establesimiento },
    orderBy: { createdAt: "desc" },
  });

  return <DataTableCategoria data={categorias} />;
}
