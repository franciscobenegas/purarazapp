import { Separator } from "@/components/ui/separator";
import { Prisma } from "@prisma/client";
import React from "react";
import { FormViewSalidaId } from "../FormViewSalidaId";

type SalidaWithRelations = Prisma.SalidaGetPayload<{
  include: {
    propietario: true;
    motivo: true;
    items: {
      include: {
        categoria: true;
      };
    };
  };
}>;

interface SalidaProps {
  salida: SalidaWithRelations;
}

export function InfoViewSalida(props: SalidaProps) {
  const { salida } = props;

  console.log(salida);

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos registros de Salida</p>
          <Separator />
          <FormViewSalidaId salida={salida} />
        </div>
      </div>
    </div>
  );
}
