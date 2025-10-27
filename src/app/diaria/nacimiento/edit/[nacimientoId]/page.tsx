import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderEditNacimientoId } from "./components/HeaderEditNacimientoId";
import { InfoEditNacimientoId } from "./components/InfoEditNacimientoId";

export default async function NacimientoEditIdPage({
  params,
}: {
  params: { nacimientoId: string };
}) {
  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const nacimiento = await prisma.nacimiento.findUnique({
    where: { id: params.nacimientoId },
    include: {
      propietario: true,
      potrero: true,
    },
  });

  if (!nacimiento) {
    return redirect("/");
  }

  const listPropietario = await prisma.propietario.findMany({
    where: {
      establesimiento: user?.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const listPotrero = await prisma.potrero.findMany({
    where: {
      establesimiento: user?.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <h1>
      <HeaderEditNacimientoId />
      <InfoEditNacimientoId nacimiento={nacimiento} listPotrero={listPotrero} listPropietario={listPropietario}/>
    </h1>
  );
}
