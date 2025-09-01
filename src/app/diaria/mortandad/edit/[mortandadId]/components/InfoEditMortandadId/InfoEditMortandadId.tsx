// import { Separator } from "@/components/ui/separator";
import {
  Categoria,
  CausaMortandad,
  Potrero,
  Prisma,
  Propietario,
} from "@prisma/client";
import React from "react";
import { FormEditMortandadId } from "../FormEditMortandadId";

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
  listPropietario?: Propietario[];
  listCategoria: Categoria[];
  listCausaMortandad: CausaMortandad[];
  listPotrero: Potrero[];
}

export function InfoEditMortandadId(props: MortandadProps) {
  const {
    mortandad,
    listCategoria,
    listCausaMortandad,
    listPotrero,
    listPropietario,
  } = props;
  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <FormEditMortandadId
            mortandad={mortandad}
            listCategoria={listCategoria}
            listCausaMortandad={listCausaMortandad}
            listPotrero={listPotrero}
            listPropietario={listPropietario}
          />
        </div>
      </div>
    </div>
  );
}
