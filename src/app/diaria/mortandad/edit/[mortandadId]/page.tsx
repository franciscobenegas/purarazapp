import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderEditMortandadId } from "./components/HeaderEditMortandadId";
import { InfoEditMortandadId } from "./components/InfoEditMortandadId";
// import { HeaderViewMortandadId } from "./components/HeaderViewMortandadId";
// import { InfoViewMortandad } from "./components/InfoViewMortandad";

export default async function EditMortandadIdPage({
  params,
}: {
  params: { mortandadId: string };
}) {
  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const mortandad = await prisma.mortandad.findUnique({
    where: { id: params.mortandadId },
    include: {
      propietario: true,
      categoria: true,
      causa: true,
      potrero: true,
    },
  });

  if (!mortandad) {
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

  const listCategoria = await prisma.categoria.findMany({
    where: {
      establesimiento: user?.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const listCausaMortandad = await prisma.causaMortandad.findMany({
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
    <div>
      <HeaderEditMortandadId />
      <InfoEditMortandadId
        mortandad={mortandad}
        listCategoria={listCategoria}
        listCausaMortandad={listCausaMortandad}
        listPotrero={listPotrero}
        listPropietario={listPropietario}
      />
    </div>
  );
}
