"use client";

import { Percent } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";
import { CustomIcon } from "@/components/CustomIcon";

const data = [
  {
    name: "VACA",
    value: 200,
    fill: "#8884d8",
  },

  {
    name: "TORO",
    value: 350,
    fill: "#ffbb28",
  },
  {
    name: "NOVILLO",
    value: 350,
    fill: "#FF1493",
  },
  {
    name: "DESMAMANTE",
    value: 350,
    fill: "#FF00FF",
  },
  {
    name: "TERNERO",
    value: 350,
    fill: "#7B68EE",
  },
];

// shadow-sm bg-background rounded-lg p-5 flex-1 hover:shadow-lg transition

export function TotalSuscripciones() {
  return (
    <div className="mb-4 lg:mb-0 shadow-sm bg-background rounded-lg p-5 w-full xl:w-96 hover:shadow-lg transition">
      <div className="flex gap-x-2 items-center mb-4">
        <div className="shadow font-bold">
          <CustomIcon icon={Percent} />
        </div>
        <p className="text-xl text-primary">Clasificacion</p>
      </div>
      <div className="w-full h-[200px] p-5">
        <ResponsiveContainer aspect={1} maxHeight={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={80}
              labelLine={false}
            />
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
