import { Separator } from "@/components/ui/separator";
import prisma from "@/libs/prisma";
import { Estancia } from "@prisma/client";
import { Logs, Mail, Phone } from "lucide-react";
import React from "react";
import { MenuPropietario } from "./components/MenuPropietario";

interface ListPropietarioProps {
  estancia: Estancia;
}

export async function ListPropietario(props: ListPropietarioProps) {
  const { estancia } = props;

  const propietarios = await prisma.propietario.findMany({
    where: {
      estanciaId: estancia.id,
    },
  });

  if (propietarios.length === 0) {
    return <p>Actualmente no hay registros de Propietarios</p>;
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="mt-4 mb-2 grid grid-cols-[1fr_2fr_1fr_auto_auto] p-2 gap-x-3 items-center justify-between px-4 bg-slate-400/20 rounded-lg">
        <p>Nombre</p>
        <p className="hidden md:block">Correo</p>
        <p className="hidden md:block">Teléfono</p>
        <p className="flex items-center gap-x-2 justify-end">Contacto</p>
        <p className="flex items-center gap-x-2 justify-end">
          <Logs className="w-4 h-4 text-primary" />{" "}
        </p>
      </div>

      {/* Filas de datos */}
      {propietarios.map((propietario) => (
        <div key={propietario.id}>
          <div
            className="grid grid-cols-[1fr_2fr_1fr_auto_auto] gap-x-3 items-center justify-between px-4
           hover:bg-gray-100 rounded-md transition-colors duration-200 hover:dark:text-black"
          >
            <p>{propietario.nombre}</p>
            <p className="hidden md:block">{propietario.email}</p>
            <p className="hidden md:block">{propietario.telefono}</p>

            {/* Contacto */}
            <div className="flex items-center gap-x-2 justify-end">
              <a href={`tel:${propietario.telefono}`} target="_blank">
                <Phone className="w-5 h-5 text-primary " />
              </a>
              <a href={`mailto:${propietario.email}`} target="_blank">
                <Mail className="w-5 h-5 text-primary" />
              </a>
            </div>

            <MenuPropietario propietario={propietario} />
          </div>
          <Separator className="my-3" />
        </div>
      ))}
    </div>
  );
}
