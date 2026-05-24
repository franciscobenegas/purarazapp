import { Categoria, MotivoPesaje, Prisma, Potrero, Propietario } from "@prisma/client";
import React from "react";
import { FormEditPesajeId } from "../FormEditPesajeId";

type PesajeWithRelations = Prisma.PesajeGetPayload<{
  include: {
    propietario: true;
    motivo: true;
    categoria: true;
    potrero: true;
  };
}>;

interface PesajeProps {
  pesaje: PesajeWithRelations;
  listPropietario?: Propietario[];
  listMotivoPesaje: MotivoPesaje[];
  listCategoria: Categoria[];
  listPotrero: Potrero[];
}

export default function InfoEditPesajeId(props: PesajeProps) {
  const { pesaje, listPropietario, listMotivoPesaje, listCategoria, listPotrero } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <FormEditPesajeId
            pesaje={pesaje}
            listMotivoPesaje={listMotivoPesaje}
            listPropietarios={listPropietario}
            listCategorias={listCategoria}
            listPotreros={listPotrero}
          />
        </div>
      </div>
    </div>
  );
}
