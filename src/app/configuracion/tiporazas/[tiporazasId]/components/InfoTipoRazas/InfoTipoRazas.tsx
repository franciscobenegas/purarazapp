import { Separator } from "@/components/ui/separator";
import { TipoRaza } from "@prisma/client";
import React from "react";
import { FormTipoRaza } from "../FormTipoRaza";

interface TipoRazasProps {
  TipoRaza: TipoRaza;
}

export function InfoTipoRazas(props: TipoRazasProps) {
  const { TipoRaza } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos Tipo de Raza</p>
          <Separator />

          <FormTipoRaza tiporaza={TipoRaza} />
        </div>
      </div>
    </div>
  );
}
