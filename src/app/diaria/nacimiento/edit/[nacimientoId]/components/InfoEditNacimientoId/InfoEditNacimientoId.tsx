import { Potrero, Prisma, Propietario } from "@prisma/client";
import React from "react";
import FormEditNacimientoId from "../FormEditNacimientoId/FormEditNacimientoId";

type NacimientoWithRelations = Prisma.NacimientoGetPayload<{
  include: {
    propietario: true;
    potrero: true;
  };
}>;

interface NacimientoProps {
  nacimiento: NacimientoWithRelations;
  listPropietario?: Propietario[];
  listPotrero: Potrero[];
}

export function InfoEditNacimientoId(props: NacimientoProps) {
  const { nacimiento, listPotrero, listPropietario } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <FormEditNacimientoId nacimiento={nacimiento} listPotrero={listPotrero} listPropietario={listPropietario} />
        </div>
      </div>
    </div>
  );
}
