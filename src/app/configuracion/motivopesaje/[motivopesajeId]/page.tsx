import React from "react";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import prisma from "@/libs/prisma";
import { HeaderMotivoPesajeId } from "./components/HeaderMotivoPesajeId";
import { InfoMotivoPesaje } from "./components/InfoMotivoPesaje";

export default async function MotivoPesajePage({
  params,
}: {
  params: { motivopesajeId: string };
}) {
  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const motivoPesaje = await prisma.motivoPesaje.findUnique({
    where: { id: params.motivopesajeId },
  });

  if (!motivoPesaje) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderMotivoPesajeId />
      <InfoMotivoPesaje MotivoPesaje={motivoPesaje} />
    </div>
  );
}
