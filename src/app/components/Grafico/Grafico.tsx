"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const dataGrafico = [
  {
    year: "2016",
    newCustomer: 2536,
    oldCustomer: 1540,
  },
  {
    year: "2017",
    newCustomer: 2658,
    oldCustomer: 1630,
  },
  {
    year: "2018",
    newCustomer: 2789,
    oldCustomer: 2536,
  },
  {
    year: "2019",
    newCustomer: 3125,
    oldCustomer: 1654,
  },
  {
    year: "2020",
    newCustomer: 3256,
    oldCustomer: 2689,
  },
  {
    year: "2021",
    newCustomer: 3365,
    oldCustomer: 5569,
  },
  {
    year: "2022",
    newCustomer: 4150,
    oldCustomer: 5836,
  },
  {
    year: "2023",
    newCustomer: 4435,
    oldCustomer: 1987,
  },
  {
    year: "2024",
    newCustomer: 4952,
    oldCustomer: 3150,
  },
];

export function Grafico() {
  return (
    <div className="mt-5 ">
      <p className="text-3xl mb-3">24.498</p>
      <div className="flex gap-x-5 mb-5">
        <div className="flex items-center gap-2 px-3 text-md bg-[#16C8C7] text-white rounded-xl w-fit">
          8.5 %
          <TrendingUp strokeWidth={1} className="h-6 w-6" />
        </div>
        <p className="text-slate-500">+4.000 ingresados</p>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={730}
            height={250}
            data={dataGrafico}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#887CFD" stopOpacity="0.8" />
                <stop offset="95%" stopColor="#887CFD" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity="0.8" />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity="0" />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="newCustomer"
              stroke="#887CFD"
              fillOpacity={1}
              fill="url(#colorUv)"
            />

            <Area
              type="monotone"
              dataKey="oldCustomer"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
