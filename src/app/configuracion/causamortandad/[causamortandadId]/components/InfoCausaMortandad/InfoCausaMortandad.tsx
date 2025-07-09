import { Separator } from "@/components/ui/separator";
import { CausaMortandad } from "@prisma/client";
import React from "react";
import { FormCausaMortandadId } from "../FormCausaMortandadId";

interface CausaMortandadProps {
  CausaMortandad: CausaMortandad;
}

export function InfoCausaMortandad(props: CausaMortandadProps) {
  const { CausaMortandad } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos Causa de Mortandad</p>
          <Separator />

          {/* <FormTipoRaza tiporaza={TipoRaza} /> */}
          <FormCausaMortandadId causaMortandad={CausaMortandad} />
        </div>
      </div>
    </div>
  );
}
