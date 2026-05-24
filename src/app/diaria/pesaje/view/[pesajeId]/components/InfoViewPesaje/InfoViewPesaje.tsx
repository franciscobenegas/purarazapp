import { Separator } from "@/components/ui/separator";
import { Prisma } from "@prisma/client";
import React from "react";
import { FormViewPesajeId } from "../FormViewPesajeId";

type PesajeWithRelations = Prisma.PesajeGetPayload<{
  include: {
    propietario: true;
    motivo: true;
    categoria: true;
    potrero: true;
  };
}>;

interface PesajeProps {
  pesaje: PesajeWithRelations;
}

export function InfoViewPesaje(props: PesajeProps) {
  const { pesaje } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos registros de Pesaje</p>
          <Separator />
          <FormViewPesajeId pesaje={pesaje} />
        </div>
      </div>
    </div>
  );
}
