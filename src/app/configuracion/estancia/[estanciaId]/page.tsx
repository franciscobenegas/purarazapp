import React from "react";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import prisma from "@/libs/prisma";
import { Headers } from "./components/Headers";
import { InfoEstancia } from "./components/InfoEstancia";

export default async function EstanciaPageId({
  params,
}: {
  params: { estanciaId: string };
}) {
   const user = getUserFromToken();

   // 🚫 Si no hay usuario autenticado, redirigir al login
   if (!user) {
     redirect("/auth/login");
   }

  const estancia = await prisma.estancia.findUnique({
    where: { id: params.estanciaId },
  });

  if (!estancia) {
    return redirect("/");
  }

  return (
    <div>
      <Headers />
      <InfoEstancia estancia={estancia} />
    </div>
  );
}
