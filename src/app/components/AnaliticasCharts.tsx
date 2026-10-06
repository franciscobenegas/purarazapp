"use client";

import { useEffect, useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AnaliticasChartsProps {
  data: {
    year: number;
    movimientosPorMes: Array<{
      mes: string;
      nacimientos: number;
      compras: number;
      ventas: number;
      mortandad: number;
    }>;
    economiaPorMes: Array<{ mes: string; compras: number; ventas: number }>;
    composicionIngresos: Array<{ nombre: string; cantidad: number }>;
    composicionEgresos: Array<{ nombre: string; cantidad: number }>;
  };
}

// Colores por concepto (paleta categórica validada — skill dataviz).
// Orden/semántica fija y consistente en todos los gráficos de la página.
const CONCEPT_COLORS: Record<string, { light: string; dark: string }> = {
  Nacimientos: { light: "#1baf7a", dark: "#199e70" }, // aqua
  Compras: { light: "#2a78d6", dark: "#3987e5" }, // azul
  Ventas: { light: "#eb6834", dark: "#d95926" }, // naranja
  Mortandad: { light: "#e34948", dark: "#e66767" }, // rojo
};

const conceptColor = (name: string, isDark: boolean) =>
  (CONCEPT_COLORS[name] ?? { light: "#4a3aa7", dark: "#9085e9" })[
    isDark ? "dark" : "light"
  ];

const fmtMoney = (v: number) => {
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${Math.round(v).toLocaleString("es-AR")}`;
};

// --- Tooltips temáticos (dark/light) compartidos en la página ---
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

function SeriesTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  label?: string | number;
  valueFormatter?: (n: number) => string;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
}) {
  if (!active || !payload?.length) return null;
  const fmt = valueFormatter ?? ((n: number) => `${n}`);
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
              {fmt(p.value ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  total: number;
  payload?: Array<{ name?: string; value?: number; payload?: { fill?: string } }>;
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

// --- Dona reutilizable (composición de ingresos / egresos) ---
function DonutCard({
  title,
  description,
  data,
  isDark,
  surface,
}: {
  title: string;
  description: string;
  data: Array<{ nombre: string; cantidad: number }>;
  isDark: boolean;
  surface: string;
}) {
  const total = data.reduce((s, d) => s + d.cantidad, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            Sin registros para mostrar
          </div>
        ) : (
          <>
            <div className="relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    dataKey="cantidad"
                    nameKey="nombre"
                    innerRadius={58}
                    outerRadius={90}
                    paddingAngle={2}
                    cornerRadius={4}
                    stroke={surface}
                    strokeWidth={2}
                    isAnimationActive={false}
                  >
                    {data.map((d, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={conceptColor(d.nombre, isDark)}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<DonutTooltip total={total} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold leading-none tabular-nums text-foreground">
                  {total}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  animales
                </span>
              </div>
            </div>

            <ul className="mt-4 flex flex-col gap-2">
              {data.map((d) => {
                const pct = total
                  ? ((d.cantidad / total) * 100).toFixed(1)
                  : "0";
                return (
                  <li key={d.nombre} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ background: conceptColor(d.nombre, isDark) }}
                    />
                    <span className="text-foreground">{d.nombre}</span>
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
  );
}

export function AnaliticasCharts({ data }: AnaliticasChartsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const surface = isDark ? "#0a0a0a" : "#ffffff";
  const gridColor = isDark ? "#2c2c2a" : "#e1e0d9";
  const axisColor = isDark ? "#383835" : "#c3c2b7";
  const tickColor = "#898781";

  return (
    <div className="flex flex-col gap-6">
      {/* Movimientos operativos por mes (4 series) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Movimientos del rodeo por mes — {data.year}
          </CardTitle>
          <CardDescription>
            Nacimientos, compras, ventas y mortandad mes a mes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={data.movimientosPorMes} barGap={2}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
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
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                content={<SeriesTooltip />}
              />
              <Legend />
              <Bar dataKey="nacimientos" name="Nacimientos" fill={conceptColor("Nacimientos", isDark)} radius={[3, 3, 0, 0]} maxBarSize={28} />
              <Bar dataKey="compras" name="Compras" fill={conceptColor("Compras", isDark)} radius={[3, 3, 0, 0]} maxBarSize={28} />
              <Bar dataKey="ventas" name="Ventas" fill={conceptColor("Ventas", isDark)} radius={[3, 3, 0, 0]} maxBarSize={28} />
              <Bar dataKey="mortandad" name="Mortandad" fill={conceptColor("Mortandad", isDark)} radius={[3, 3, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Económico: compras vs ventas ($) por mes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Flujo económico estimado — {data.year}
          </CardTitle>
          <CardDescription>
            Valor de compras vs. ventas por mes (según precios de cada categoría)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data.economiaPorMes}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
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
                tickFormatter={fmtMoney}
                width={70}
              />
              <Tooltip
                cursor={{ stroke: axisColor, strokeWidth: 1 }}
                content={<SeriesTooltip valueFormatter={fmtMoney} />}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ventas"
                name="Ventas"
                stroke={conceptColor("Ventas", isDark)}
                strokeWidth={2}
                dot={{ fill: conceptColor("Ventas", isDark), r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="compras"
                name="Compras"
                stroke={conceptColor("Compras", isDark)}
                strokeWidth={2}
                dot={{ fill: conceptColor("Compras", isDark), r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Composición de ingresos y egresos del rodeo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutCard
          title="Composición de ingresos"
          description="Cómo creció el rodeo este año"
          data={data.composicionIngresos}
          isDark={isDark}
          surface={surface}
        />
        <DonutCard
          title="Composición de egresos"
          description="Cómo se redujo el rodeo este año"
          data={data.composicionEgresos}
          isDark={isDark}
          surface={surface}
        />
      </div>
    </div>
  );
}
