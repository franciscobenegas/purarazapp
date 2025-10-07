import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import React from "react";
import { DataTableNacimiento } from "./data-table";

export async function ListNacimiento() {
  
  const { establesimiento } = getUserFromToken();

  const listadoNacimiento = await prisma.nacimiento.findMany({
    where: {
      establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      propietario: true,
      potrero: true,
    },
    
  });

  console.log('Listado Nacimiento',listadoNacimiento);
  
  return <DataTableNacimiento data={listadoNacimiento}/>;
}
