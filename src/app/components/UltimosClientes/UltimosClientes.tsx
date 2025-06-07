import { CustomIcon } from "@/components/CustomIcon";
import { Building } from "lucide-react";
import React from "react";
//import { TablaClientes } from "../TablaClientes";

export function UltimosClientes() {
  return (
    <div className="shadow-sm bg-background rounded-lg p-5 hover:shadow-lg transition">
      <div className="flex gap-x-2 items-center">
        <div className="shadow-md">
          <CustomIcon icon={Building} />
        </div>

        <p className="text-xl text-primary">Clientes </p>
      </div>
      <div className="">{/* <TablaClientes /> */}</div>
    </div>
  );
}
