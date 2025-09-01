import { Separator } from "@/components/ui/separator";
import { Prisma } from "@prisma/client";
import React from "react";
import { FormViewMortandadId } from "../FormViewMortandadId";

type MortandadWithRelations = Prisma.MortandadGetPayload<{
  include: {
    propietario: true;
    categoria: true;
    causa: true;
    potrero: true;
  };
}>;

interface MortandadProps {
  mortandad: MortandadWithRelations;
}

export function InfoViewMortandad(props: MortandadProps) {
  const { mortandad } = props;
  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos registro mortandad</p>
          <Separator />

          <FormViewMortandadId mortandad={mortandad} />
        </div>
      </div>
    </div>
  );
}
