import { Separator } from "@/components/ui/separator";
import { MotivoSalida } from "@prisma/client";
import React from "react";
import { FormMotivoSalidaId } from "../FormMotivoSalidaId";

interface MotivoSalidaProps {
  motivoSalida: MotivoSalida;
}

export function InfoMotivoSalida(props: MotivoSalidaProps) {
  const { motivoSalida } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos Motivo Salida</p>
          <Separator />
          <FormMotivoSalidaId motivoSalida={motivoSalida} />
        </div>
      </div>
    </div>
  );
}
