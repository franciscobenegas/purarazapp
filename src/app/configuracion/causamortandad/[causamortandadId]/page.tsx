import React from "react";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import prisma from "@/libs/prisma";
import { HeaderCausaMortandadId } from "./components/HeaderCausaMortandadId";
import { InfoCausaMortandad } from "./components/InfoCausaMortandad";

export default async function CausaMortandadPageId({
  params,
}: {
  params: { causamortandadId: string };
}) {
 const user = getUserFromToken();

 // 🚫 Si no hay usuario autenticado, redirigir al login
 if (!user) {
   redirect("/auth/login");
 }

  const causaMortandad = await prisma.causaMortandad.findUnique({
    where: { id: params.causamortandadId },
  });

  if (!causaMortandad) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderCausaMortandadId />
      <InfoCausaMortandad CausaMortandad={causaMortandad} />
    </div>
  );
}
