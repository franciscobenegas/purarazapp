import { Separator } from "@/components/ui/separator";
import React from "react";

import { Categoria } from "@prisma/client";
import { FormEditCategoriaId } from "../FormEditCategoriaId";

interface CategoriaProps {
  categoria: Categoria;
}

export function InfoEditCategoria(props: CategoriaProps) {
  const { categoria } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos de la Categoria</p>
          <Separator />
          <FormEditCategoriaId categoria={categoria} />
        </div>
      </div>
    </div>
  );
}
