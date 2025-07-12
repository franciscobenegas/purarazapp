import { Separator } from "@/components/ui/separator";
import { MotivoEntrada } from "@prisma/client";
import React from "react";

import { FormMotivoEntradaId } from "../FormMotivoEntradaId";

interface MotivoEntradaProps {
  MotivoEntrada: MotivoEntrada;
}

export function InfoMotivoEntrada(props: MotivoEntradaProps) {
  const { MotivoEntrada } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos Motivo Entrada</p>
          <Separator />
          <FormMotivoEntradaId motivoEntrada={MotivoEntrada} />
        </div>
      </div>
    </div>
  );
}
