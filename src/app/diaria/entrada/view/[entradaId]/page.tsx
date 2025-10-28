import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";

export default async function ViewEntradaPageId({
  params,
}: {
  params: { entradaId: string };
}) {
  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const entrada = await prisma.entrada.findUnique({
    where: { id: params.entradaId },
  });

  if (!entrada) {
    return redirect("/");
  }

  console.log("Entrada : ", entrada);

  return (
    <div>
      <h1>ViewEntradaPageId</h1>
    </div>
  );
}
