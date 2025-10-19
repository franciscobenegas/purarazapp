import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderEditCategoriaId } from "./components/HeaderEditCategoriaId";
import { InfoEditCategoria } from "./components/InfoEditCategoria";

export default async function EditCategoriaId({
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
      <HeaderEditCategoriaId />
      <InfoEditCategoria categoria={categoria} />
    </div>
  );
}
