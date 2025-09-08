import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { HeaderNacimineto } from "./components/HeaderNacimineto";

export default async function NacimientoPage() {
  const { establesimiento } = getUserFromToken();

  const listPropietario = await prisma.propietario.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const listPotrero = await prisma.potrero.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <HeaderNacimineto
        listPotrero={listPotrero}
        listPropietarios={listPropietario}
      />
    </div>
  );
}
