"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Propietario } from "@prisma/client";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import React from "react";

interface MenuPropietarioProps {
  propietario: Propietario;
}

export function MenuPropietario(props: MenuPropietarioProps) {
  const { propietario } = props;

  console.log("Menu Propietario = ", propietario);

  const onEdit = (propietario: {
    id: string;
    nombre: string;
    telefono: string;
    usuario: string;
    createdAt: Date;
    updatedAt: Date;
    establesimiento: string;
    email: string;
    estanciaId: string;
  }) => {
    console.log("onEdit", propietario);
  };

  const onDelete = (value: string) => {
    console.log("onEdit", value);
  };

  return (
    <div>
      {/* Menú de acciones */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEdit(propietario)}
              className="w-full"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Modificar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(propietario.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
