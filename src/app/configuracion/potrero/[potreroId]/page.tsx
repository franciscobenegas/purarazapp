import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderPotreroId } from "./components/HeaderPotreroId";
import { InfoPotrero } from "./components/InfoPotrero";

export default async function PotreroPageId({
  params,
}: {
  params: { potreroId: string };
}) {
  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const potrero = await prisma.potrero.findUnique({
    where: { id: params.potreroId },
  });

  if (!potrero) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderPotreroId />
      <InfoPotrero potrero={potrero} />
    </div>
  );
}
