import { Separator } from "@/components/ui/separator";
import { Prisma } from "@prisma/client";
import React from "react";
import { FormViewEntradaId } from "../FormViewEntradaId";

type EntradaWithRelations = Prisma.EntradaGetPayload<{
  include: {
    propietario: true;
    motivo: true;
    items: {
      include: {
        categoria: true; // ✅ también acá
      };
    };
  };
}>;

interface EntradaProps {
  entrada: EntradaWithRelations;
}

export function InfoViewEntrada(props: EntradaProps) {
  const { entrada } = props;

  console.log(entrada);

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos registros de Entrada</p>
          <Separator />
          <FormViewEntradaId entrada={entrada} />
        </div>
      </div>
    </div>
  );
}
