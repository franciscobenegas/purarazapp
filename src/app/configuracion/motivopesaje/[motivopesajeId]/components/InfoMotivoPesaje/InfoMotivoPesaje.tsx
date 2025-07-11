import { Separator } from "@/components/ui/separator";
import { MotivoPesaje } from "@prisma/client";
import React from "react";
import { FormMotivoPesajeId } from "../FormMotivoPesajeId";

interface MotivoPesajeProps {
  MotivoPesaje: MotivoPesaje;
}

export function InfoMotivoPesaje(props: MotivoPesajeProps) {
  const { MotivoPesaje } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos Motivo Pesaje</p>
          <Separator />

          {/* <FormCausaMortandadId causaMortandad={CausaMortandad} /> */}
          <FormMotivoPesajeId motivoPesaje={MotivoPesaje} />
        </div>
      </div>
    </div>
  );
}
