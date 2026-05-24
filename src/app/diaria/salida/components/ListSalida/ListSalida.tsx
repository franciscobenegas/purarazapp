import React from 'react'
import { DataTableSalida } from './data-table';
import { getUserFromToken } from '@/utils/getUserFromToken';
import prisma from '@/libs/prisma';


export async function ListSalida() {

   const user = getUserFromToken();

   const listadoSalida = await prisma.salida.findMany({
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


  return <DataTableSalida data={listadoSalida} />;
}
