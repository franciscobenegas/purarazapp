import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderEditPesajeId } from "./components/HeaderEditPesajeId";
import InfoEditPesajeId from "./components/InfoEditPesajeId/InfoEditPesajeId";

export default async function PesajeEditPageId({
  params,
}: {
  params: { pesajeId: string };
}) {
  console.log(params.pesajeId);

  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const pesaje = await prisma.pesaje.findUnique({
    where: { id: params.pesajeId },
    include: {
      propietario: true,
      motivo: true,
      categoria: true,
      potrero: true,
    },
  });


  const listPropietario = await prisma.propietario.findMany({
    where: {
      establesimiento: user?.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  const listMotivoPesaje = await prisma.motivoPesaje.findMany({
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

  const listPotrero = await prisma.potrero.findMany({
    where: {
      establesimiento: user?.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });




  if (!pesaje) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderEditPesajeId />
      <InfoEditPesajeId
        pesaje={pesaje}
        listMotivoPesaje={listMotivoPesaje}
        listPropietario={listPropietario}
        listCategoria={listCategoria}
        listPotrero={listPotrero}
      />
    </div>
  );
}
