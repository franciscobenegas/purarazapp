import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderEditSalidaId } from "./components/HeaderEditSalidaId";
import InfoEditSalidaId from "./components/InfoEditSalidaId/InfoEditSalidaId";

export default async function SalidaEditPageId({
  params,
}: {
  params: { salidaId: string };
}) {
  console.log(params.salidaId);

  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const salida = await prisma.salida.findUnique({
    where: { id: params.salidaId },
    include: {
      propietario: true,
      motivo: true,
      items: {
        include: {
          categoria: true,
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


  const listMotivoSalida = await prisma.motivoSalida.findMany({
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




  if (!salida) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderEditSalidaId />
      <InfoEditSalidaId
        salida={salida}
        listMotivoSalida={listMotivoSalida}
        listPropietario={listPropietario}
        listCategoria={listCategoria}
      />
    </div>
  );
}
