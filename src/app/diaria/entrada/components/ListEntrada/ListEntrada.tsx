import React from 'react'
import { DataTableEntrada } from './data-table';
import { getUserFromToken } from '@/utils/getUserFromToken';
import prisma from '@/libs/prisma';


export  async function ListEntrada() {

   const user = getUserFromToken();

   const listadoEntrada = await prisma.entrada.findMany({
     where: {
       establesimiento: user?.establesimiento,
     },
     orderBy: {
       createdAt: "desc",
     },
     include: {
       propietario: true,
       motivo: true,
     },
     
   });


  return <DataTableEntrada data={listadoEntrada} />;
}
