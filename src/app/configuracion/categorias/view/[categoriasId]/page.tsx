import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderViewCategoriaId } from "./components/HeaderViewCategoriaId";
import { InfoViewCategoria } from "./components/InfoViewCategoria";

export default async function ViewCategoriaPageId({
  params,
}: {
  params: { categoriasId: string };
}) {
  const user = getUserFromToken();

  // 🚫 Si no hay usuario autenticado, redirigir al login
  if (!user) {
    redirect("/auth/login");
  }

  const categoria = await prisma.categoria.findUnique({
    where: { id: params.categoriasId },
  });

  if (!categoria) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderViewCategoriaId />
      <InfoViewCategoria categoria={categoria} />
    </div>
  );
}
