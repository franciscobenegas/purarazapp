import React from 'react'
import { DataTablePesaje } from './data-table';
import { getUserFromToken } from '@/utils/getUserFromToken';
import prisma from '@/libs/prisma';


export async function ListPesaje() {

   const user = getUserFromToken();

   const listadoPesaje = await prisma.pesaje.findMany({
     where: {
       establesimiento: user?.establesimiento,
     },
     orderBy: {
       createdAt: "desc",
     },
     include: {
       propietario: true,
       motivo: true,
       categoria: true,
       potrero: true,
     },
     
   });


  return <DataTablePesaje data={listadoPesaje} />;
}
