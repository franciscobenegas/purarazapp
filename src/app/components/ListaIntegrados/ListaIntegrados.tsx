import { CustomIcon } from "@/components/CustomIcon";
import { List } from "lucide-react";
import { TablaIntegracion } from "../TablaIntegracion";

export function ListaIntegrados() {
  return (
    <div className="shadow-sm bg-background rounded-lg p-5 flex-1 hover:shadow-lg transition ">
      <div className="flex gap-x-2 items-center">
        <div className="shadow">
          <CustomIcon icon={List} />
        </div>
        <p className="text-xl text-primary">Listado Integrados</p>
      </div>
      <TablaIntegracion />
    </div>
  );
}
