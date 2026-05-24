"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardChartsProps {
  stats: {
    mortandadPorCategoria: Array<{ nombre: string; mortandad: number; cantidad: number }>;
    mortandadPorCausa: Array<{ nombre: string; cantidad: number }>;
    mortandadPorMes: Array<{ mes: string; cantidad: number }>;
    year: number;
  };
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export function DashboardCharts({ stats }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Mortandad por Categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mortandad por Categoría</CardTitle>
          <CardDescription>
            Análisis de mortandad según categoría de ganado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.mortandadPorCategoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nombre"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Bar dataKey="mortandad" fill="#ef4444" name="Mortandad" />
              <Bar dataKey="cantidad" fill="#3b82f6" name="Cantidad Total" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pastel - Mortandad por Causa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mortandad por Causa</CardTitle>
          <CardDescription>
            Distribución de mortandad según causa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.mortandadPorCausa}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nombre, cantidad }) => `${nombre}: ${cantidad}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {stats.mortandadPorCausa.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Líneas - Mortandad por Mes */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Tendencia de Mortandad - {stats.year}</CardTitle>
          <CardDescription>
            Evolución mensual de mortandad durante el año
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={stats.mortandadPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cantidad"
                stroke="#ef4444"
                strokeWidth={2}
                name="Mortandad"
                dot={{ fill: "#ef4444", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
