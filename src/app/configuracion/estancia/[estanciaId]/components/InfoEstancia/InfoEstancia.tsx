import { Estancia } from "@prisma/client";
//import { FormCliente } from "../FormCliente";
import { Separator } from "@/components/ui/separator";
import { FormEstancia } from "../FormEstancia";
import { Users } from "lucide-react";
import { NewPropietario } from "../NewPropietario";
import { ListPropietario } from "../ListPropietario";

//import prisma from "@/libs/prisma";
interface EstanciaProps {
  estancia: Estancia;
}

export async function InfoEstancia(props: EstanciaProps) {
  const { estancia } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-6 gap-y-6 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="p-5 font-bold">Datos Estancia</p>
          <Separator />
          <FormEstancia estancia={estancia} />
        </div>
      </div>

      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2">
            <Users className="w-5 h-5" />
            Propietarios
          </div>
          <div>
            <NewPropietario />
          </div>
        </div>
        <ListPropietario estancia={estancia} />
      </div>
    </div>
  );
}
