"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardChartsProps {
  stats: {
    mortandadPorCategoria: Array<{ nombre: string; mortandad: number; cantidad: number }>;
    mortandadPorCausa: Array<{ nombre: string; cantidad: number }>;
    mortandadPorMes: Array<{ mes: string; cantidad: number }>;
    year: number;
  };
}

// Paleta categórica validada (skill dataviz). Orden fijo, nunca ciclado:
// una 9.ª causa se pliega en "Otras". Cada modo tiene sus propios pasos.
const CATEGORICAL_LIGHT = [
  "#2a78d6",
  "#1baf7a",
  "#eda100",
  "#008300",
  "#4a3aa7",
  "#e34948",
  "#e87ba4",
  "#eb6834",
];
const CATEGORICAL_DARK = [
  "#3987e5",
  "#199e70",
  "#c98500",
  "#008300",
  "#9085e9",
  "#e66767",
  "#d55181",
  "#d95926",
];

type CausaDatum = { nombre: string; cantidad: number };

// Estilo de caja compartido por todos los tooltips (temático dark/light).
const tooltipBoxStyle: React.CSSProperties = {
  background: "hsl(var(--popover))",
  color: "hsl(var(--popover-foreground))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 13,
  boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
};

const swatchStyle = (color?: string): React.CSSProperties => ({
  width: 10,
  height: 10,
  borderRadius: 2,
  background: color,
  display: "inline-block",
  flexShrink: 0,
});

// Tooltip temático reutilizado por la dona de causas.
function CausaTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: { fill?: string } }>;
  total: number;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const value = item.value ?? 0;
  const pct = total ? ((value / total) * 100).toFixed(1) : "0";
  return (
    <div style={tooltipBoxStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
        <span style={swatchStyle(item.payload?.fill)} />
        {item.name}
      </div>
      <div style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
        {value} {value === 1 ? "animal" : "animales"} · {pct}%
      </div>
    </div>
  );
}

// Tooltip temático para barras y líneas (una o varias series).
function SeriesTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipBoxStyle}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {payload.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={swatchStyle(p.color)} />
            <span>{p.name}</span>
            <span
              style={{
                marginLeft: "auto",
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const palette = isDark ? CATEGORICAL_DARK : CATEGORICAL_LIGHT;
  const surface = isDark ? "#0a0a0a" : "#ffffff";

  // Cromática de ejes/grilla recesiva (skill dataviz: grilla hairline, ejes muted)
  const gridColor = isDark ? "#2c2c2a" : "#e1e0d9";
  const axisColor = isDark ? "#383835" : "#c3c2b7";
  const tickColor = "#898781"; // muted, igual en ambos modos

  // Series consistentes con la paleta validada:
  // "Mortandad" = rojo (slot 6), "Cantidad Total" = azul (slot 1).
  const colorMortandad = isDark ? "#e66767" : "#e34948";
  const colorCantidad = isDark ? "#3987e5" : "#2a78d6";

  // Ordenamos las causas de mayor a menor y plegamos el excedente en "Otras"
  // para no superar la paleta de 8 colores.
  const { causaData, totalCausa } = useMemo(() => {
    const sorted = [...stats.mortandadPorCausa].sort((a, b) => b.cantidad - a.cantidad);
    let items: CausaDatum[] = sorted;
    if (sorted.length > 8) {
      const top = sorted.slice(0, 7);
      const otras = sorted.slice(7).reduce((acc, d) => acc + d.cantidad, 0);
      items = [...top, { nombre: "Otras", cantidad: otras }];
    }
    const total = items.reduce((acc, d) => acc + d.cantidad, 0);
    return { causaData: items, totalCausa: total };
  }, [stats.mortandadPorCausa]);

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
            <BarChart data={stats.mortandadPorCategoria} barGap={2}>
              <CartesianGrid
                stroke={gridColor}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="nombre"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={{ stroke: axisColor }}
                tickLine={{ stroke: axisColor }}
              />
              <YAxis
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={{ stroke: axisColor }}
                tickLine={{ stroke: axisColor }}
              />
              <Tooltip
                cursor={{ fill: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                content={<SeriesTooltip />}
              />
              <Legend />
              <Bar
                dataKey="mortandad"
                fill={colorMortandad}
                name="Mortandad"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
              <Bar
                dataKey="cantidad"
                fill={colorCantidad}
                name="Cantidad Total"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Dona - Mortandad por Causa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mortandad por Causa</CardTitle>
          <CardDescription>
            Distribución de mortandad según causa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalCausa === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              Sin registros de mortandad para mostrar
            </div>
          ) : (
            <>
              <div className="relative">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={causaData}
                      cx="50%"
                      cy="50%"
                      dataKey="cantidad"
                      nameKey="nombre"
                      innerRadius={62}
                      outerRadius={96}
                      paddingAngle={2}
                      cornerRadius={4}
                      stroke={surface}
                      strokeWidth={2}
                      isAnimationActive={false}
                    >
                      {causaData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={palette[index % palette.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CausaTooltip total={totalCausa} />}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Total al centro de la dona */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold leading-none tabular-nums text-foreground">
                    {totalCausa}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {totalCausa === 1 ? "muerte" : "muertes"}
                  </span>
                </div>
              </div>

              {/* Leyenda: swatch + causa + conteo + % (reemplaza etiquetas radiales) */}
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                {causaData.map((d, index) => {
                  const pct = totalCausa
                    ? ((d.cantidad / totalCausa) * 100).toFixed(1)
                    : "0";
                  return (
                    <li
                      key={d.nombre}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-sm"
                        style={{ background: palette[index % palette.length] }}
                      />
                      <span className="truncate text-foreground" title={d.nombre}>
                        {d.nombre}
                      </span>
                      <span className="ml-auto shrink-0 tabular-nums text-muted-foreground">
                        {d.cantidad} · {pct}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
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
              <CartesianGrid
                stroke={gridColor}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="mes"
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={{ stroke: axisColor }}
                tickLine={{ stroke: axisColor }}
              />
              <YAxis
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={{ stroke: axisColor }}
                tickLine={{ stroke: axisColor }}
              />
              <Tooltip
                cursor={{ stroke: axisColor, strokeWidth: 1 }}
                content={<SeriesTooltip />}
              />
              <Line
                type="monotone"
                dataKey="cantidad"
                stroke={colorMortandad}
                strokeWidth={2}
                name="Mortandad"
                dot={{ fill: colorMortandad, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
