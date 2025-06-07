import React from "react";
import { CustomIcon } from "@/components/CustomIcon";
import { BarChart } from "lucide-react";
import { Grafico } from "../Grafico";

export function SalesDistributors() {
  return (
    <div className="shadow-sm bg-background rounded-lg p-5 hover:shadow-lg transition">
      <div className="flex gap-x-2 items-center">
        <div className="shadow-md">
          <CustomIcon icon={BarChart} />
        </div>
        <p className="text-xl text-primary">Total Ventas</p>
      </div>
      <Grafico />
    </div>
  );
}
