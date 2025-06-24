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
  const { usuario } = getUserFromToken();
  if (!usuario) {
    return redirect("/");
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
      <p>Footer</p>
    </div>
  );
}
