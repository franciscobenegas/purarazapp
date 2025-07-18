import { Separator } from "@/components/ui/separator";
import { Usuario } from "@prisma/client";
import React from "react";
import { FormUsuarioId } from "../FormUsuariosId";

interface UsuariosProps {
  Usuario: Usuario;
}

export default function InfoUsuarios(props: UsuariosProps) {
  const { Usuario } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Cambio del tipo del ROL</p>
          <Separator />
          <FormUsuarioId usuario={Usuario} />
        </div>
      </div>
    </div>
  );
}
