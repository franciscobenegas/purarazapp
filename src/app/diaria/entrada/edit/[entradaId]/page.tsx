import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderEditEntradaId } from "./components/HeaderEditEntradaId";
import InfoEditEntradaId from "./components/InfoEditEntradaId/InfoEditEntradaId";

export default async function EntradaEditPageId({
  params,
}: {
  params: { entradaId: string };
}) {
  console.log(params.entradaId);

  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const entrada = await prisma.entrada.findUnique({
    where: { id: params.entradaId },
    include: {
      propietario: true,
      motivo: true,
      items: {
        include: {
          categoria: true, // Para ver la categoría de cada ítem
        },
      },
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


  const listMotivoEntrada = await prisma.motivoEntrada.findMany({
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




  if (!entrada) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderEditEntradaId />
      <InfoEditEntradaId
        entrada={entrada}
        listMotivoEntrada={listMotivoEntrada}
        listPropietario={listPropietario}
        listCategoria={listCategoria}
      />
    </div>
  );
}
