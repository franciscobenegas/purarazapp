"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Categoria {
  id: string;
  nombre: string;
  cantidad: number;
  sexo: string;
  edad: string;
}

interface CategoriaStatsProps {
  categorias: Categoria[];
}

const getColorByEdad = (edad: string) => {
  switch (edad) {
    case "RecienNacido":
      return "#a78bfa";
    case "Joven":
      return "#60a5fa";
    case "Adulto":
      return "#10b981";
    default:
      return "#6b7280";
  }
};

export function CategoriaStats({ categorias }: CategoriaStatsProps) {
  const totalAnimales = categorias.reduce((sum, cat) => sum + cat.cantidad, 0);

  const categoriasConDatos = categorias.filter((cat) => cat.cantidad > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inventario de Categorías</CardTitle>
          <CardDescription>
            Distribución de animales por categoría
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoriasConDatos}>
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
              <Bar dataKey="cantidad" fill="#3b82f6" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>

          {/* Tabla de detalle */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Categoría</th>
                  <th className="text-left py-2 px-2">Cantidad</th>
                  <th className="text-left py-2 px-2">Sexo</th>
                  <th className="text-left py-2 px-2">Edad</th>
                  <th className="text-left py-2 px-2">% del Total</th>
                </tr>
              </thead>
              <tbody>
                {categoriasConDatos.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{cat.nombre}</td>
                    <td className="py-3 px-2">
                      <Badge variant="secondary">{cat.cantidad}</Badge>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{cat.sexo}</td>
                    <td className="py-3 px-2">
                      <Badge
                        style={{
                          backgroundColor: getColorByEdad(cat.edad),
                        }}
                        variant="outline"
                        className="text-white"
                      >
                        {cat.edad === "RecienNacido"
                          ? "Recién Nacido"
                          : cat.edad}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 font-semibold">
                      {totalAnimales > 0
                        ? ((cat.cantidad / totalAnimales) * 100).toFixed(1)
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-bold bg-muted/50">
                  <td className="py-3 px-2">TOTAL</td>
                  <td className="py-3 px-2">
                    <Badge variant="default">{totalAnimales}</Badge>
                  </td>
                  <td colSpan={2}></td>
                  <td className="py-3 px-2">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
