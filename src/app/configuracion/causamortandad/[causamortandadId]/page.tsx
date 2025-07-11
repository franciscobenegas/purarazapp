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
  const { usuario } = getUserFromToken();
  if (!usuario) {
    return redirect("/");
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
