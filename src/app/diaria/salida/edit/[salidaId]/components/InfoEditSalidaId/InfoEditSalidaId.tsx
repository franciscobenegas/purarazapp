import { Categoria, MotivoSalida, Prisma, Propietario } from "@prisma/client";
import React from "react";
import { FormEditSalidaId } from "../FormEditSalidaId";

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
  listPropietario?: Propietario[];
  listMotivoSalida: MotivoSalida[];
  listCategoria: Categoria[];
}

export default function InfoEditSalidaId(props: SalidaProps) {
  const { salida, listPropietario, listMotivoSalida, listCategoria } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <FormEditSalidaId
            salida={salida}
            listMotivoSalida={listMotivoSalida}
            listPropietarios={listPropietario}
            listCategorias={listCategoria}

          />
        </div>
      </div>
    </div>
  );
}
