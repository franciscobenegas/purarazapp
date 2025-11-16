import { Categoria, MotivoEntrada, Prisma, Propietario } from "@prisma/client";
import React from "react";
import { FormEditEntradaId } from "../FormEditEntradaId";

type EntradaWithRelations = Prisma.EntradaGetPayload<{
  include: {
    propietario: true;
    motivo: true;
    items: {
      include: {
        categoria: true; // Para ver la categoría de cada ítem
      };
    };
  };
}>;

interface EntradaProps {
  entrada: EntradaWithRelations;
  listPropietario?: Propietario[];
  listMotivoEntrada: MotivoEntrada[];
  listCategoria: Categoria[];
}

export default function InfoEditEntradaId(props: EntradaProps) {
  const { entrada, listPropietario, listMotivoEntrada, listCategoria } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          {/* <FormEditNacimientoId nacimiento={nacimiento} listPotrero={listPotrero} listPropietario={listPropietario} /> */}
          <FormEditEntradaId
            entrada={entrada}
            listMotivoEntrada={listMotivoEntrada}
            listPropietarios={listPropietario}
            listCategorias={listCategoria}

          />
        </div>
      </div>
    </div>
  );
}
