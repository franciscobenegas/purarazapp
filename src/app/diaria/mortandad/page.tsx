import React from "react";
import { HeaderMortandad } from "./components/HeaderMortandad";
import { ListMortandad } from "./components/ListMortandad";
import { getUserFromToken } from "@/utils/getUserFromToken";
import prisma from "@/libs/prisma";

export default async function MortandadPage() {
  const { establesimiento } = getUserFromToken();

  const listPropietario = await prisma.propietario.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const listCategoria = await prisma.categoria.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const listCausaMortandad = await prisma.causaMortandad.findMany({
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
      <HeaderMortandad
        listPropietarios={listPropietario}
        listCategoria={listCategoria}
        listCausaMortandad={listCausaMortandad}
        listPotrero={listPotrero}
      />
      <ListMortandad />
    </div>
  );
}
