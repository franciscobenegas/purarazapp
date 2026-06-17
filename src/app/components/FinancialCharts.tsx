"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InversionCategoria {
  nombre: string;
  cantidad: number;
  precioCostoCabeza: number;
  precioVentaCabeza: number;
  inversion: number;
  valorVenta: number;
  margen: number;
}

interface FinancialChartsProps {
  inversionPorCategoria: InversionCategoria[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#a78bfa",
];

const formatMoney = (value: number) =>
  `$${Number(value).toLocaleString("es-AR")}`;

const formatMoneyK = (value: number) => {
  if (Math.abs(value) >= 1_000_000)
    return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

const MoneyTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold mb-1 text-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {formatMoney(p.value)}
        </p>
      ))}
    </div>
  );
};

export function FinancialCharts({ inversionPorCategoria }: FinancialChartsProps) {
  const datosFiltrados = inversionPorCategoria.filter(
    (c) => c.inversion > 0 || c.valorVenta > 0
  );
  const distribucionInversion = datosFiltrados.filter((c) => c.inversion > 0);

  if (datosFiltrados.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análisis Financiero</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          Configure los precios de costo y venta en las categorías para ver el análisis financiero.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Precio por Cabeza: Venta vs Costo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Precio por Cabeza: Venta vs Costo</CardTitle>
          <CardDescription>
            Comparación de precios unitarios por categoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosFiltrados} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis
                dataKey="nombre"
                angle={-40}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis tickFormatter={formatMoneyK} width={75} />
              <Tooltip content={<MoneyTooltip />} />
              <Legend />
              <Bar
                dataKey="precioCostoCabeza"
                name="Costo/Cab."
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="precioVentaCabeza"
                name="Venta/Cab."
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Inversión Total vs Valor de Venta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inversión vs Valor de Venta por Categoría</CardTitle>
          <CardDescription>
            Capital total invertido y valor comercial potencial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosFiltrados} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis
                dataKey="nombre"
                angle={-40}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis tickFormatter={formatMoneyK} width={75} />
              <Tooltip content={<MoneyTooltip />} />
              <Legend />
              <Bar
                dataKey="inversion"
                name="Inversión"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="valorVenta"
                name="Valor de Venta"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribución de la Inversión */}
      {distribucionInversion.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución de la Inversión</CardTitle>
            <CardDescription>
              Participación porcentual de cada categoría en el capital total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribucionInversion}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="inversion"
                  nameKey="nombre"
                  labelLine={false}
                  label={({ percent }: { percent: number }) =>
                    percent > 0.05 ? `${(percent * 100).toFixed(1)}%` : ""
                  }
                >
                  {distribucionInversion.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatMoney(value), "Inversión"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Margen Potencial por Categoría */}
      <Card
        className={distribucionInversion.length === 0 ? "lg:col-span-2" : ""}
      >
        <CardHeader>
          <CardTitle className="text-lg">Margen Potencial por Categoría</CardTitle>
          <CardDescription>
            Ganancia o pérdida potencial según precios actuales (verde = ganancia, rojo = pérdida)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosFiltrados}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis
                dataKey="nombre"
                angle={-40}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis tickFormatter={formatMoneyK} width={75} />
              <Tooltip content={<MoneyTooltip />} />
              <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="4 4" />
              <Bar dataKey="margen" name="Margen Potencial" radius={[4, 4, 0, 0]}>
                {datosFiltrados.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.margen >= 0 ? "#10b981" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
