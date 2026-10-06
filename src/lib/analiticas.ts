import prisma from "@/libs/prisma";

// Nombres de meses abreviados (es-ES), estables para el año en curso.
const mesesCortos = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i).toLocaleString("es-ES", { month: "short" }),
);

export const defaultAnaliticas = {
  year: new Date().getFullYear(),
  kpis: {
    totalNacimientos: 0,
    totalMortandad: 0,
    totalComprasAnimales: 0,
    totalVentasAnimales: 0,
    balanceRodeo: 0,
    totalAnimales: 0,
    valorCompras: 0,
    valorVentas: 0,
    resultadoBruto: 0,
  },
  movimientosPorMes: mesesCortos.map((mes) => ({
    mes,
    nacimientos: 0,
    compras: 0,
    ventas: 0,
    mortandad: 0,
  })),
  economiaPorMes: mesesCortos.map((mes) => ({ mes, compras: 0, ventas: 0 })),
  composicionIngresos: [] as Array<{ nombre: string; cantidad: number }>,
  composicionEgresos: [] as Array<{ nombre: string; cantidad: number }>,
};

export type Analiticas = typeof defaultAnaliticas;

/**
 * Agrega las analíticas del año en curso para un establecimiento:
 * movimientos operativos (nacimientos, mortandad, compras=entradas,
 * ventas=salidas) con desglose mensual, y su valorización económica
 * estimada a partir de los precios de cada categoría.
 */
export async function getAnaliticas(
  establesimiento: string,
): Promise<Analiticas> {
  try {
    const year = new Date().getFullYear();
    const gte = new Date(`${year}-01-01`);
    const lte = new Date(`${year}-12-31T23:59:59`);

    const [categorias, nacimientos, mortandades, entradas, salidas] =
      await Promise.all([
        prisma.categoria.findMany({ where: { establesimiento } }),
        prisma.nacimiento.findMany({
          where: { establesimiento, fecha: { gte, lte } },
        }),
        prisma.mortandad.findMany({
          where: { establesimiento, fecha: { gte, lte } },
        }),
        prisma.entrada.findMany({
          where: { establesimiento, fecha: { gte, lte } },
          include: { items: true },
        }),
        prisma.salida.findMany({
          where: { establesimiento, fecha: { gte, lte } },
          include: { items: true },
        }),
      ]);

    // Precios por categoría para valorizar compras/ventas (cabeza).
    const precioMap = new Map(
      categorias.map((c) => [
        c.id,
        {
          costo: c.precioCostoCabeza || 0,
          venta: c.precioVentaCabeza || 0,
        },
      ]),
    );

    const movimientosPorMes = mesesCortos.map((mes) => ({
      mes,
      nacimientos: 0,
      compras: 0,
      ventas: 0,
      mortandad: 0,
    }));
    const economiaPorMes = mesesCortos.map((mes) => ({
      mes,
      compras: 0,
      ventas: 0,
    }));

    for (const n of nacimientos) {
      movimientosPorMes[new Date(n.fecha).getMonth()].nacimientos += 1;
    }
    for (const m of mortandades) {
      movimientosPorMes[new Date(m.fecha).getMonth()].mortandad += 1;
    }

    let totalComprasAnimales = 0;
    let totalVentasAnimales = 0;
    let valorCompras = 0;
    let valorVentas = 0;

    for (const e of entradas) {
      const mi = new Date(e.fecha).getMonth();
      for (const it of e.items) {
        movimientosPorMes[mi].compras += it.cantidad;
        totalComprasAnimales += it.cantidad;
        const val = it.cantidad * (precioMap.get(it.categoriaId)?.costo ?? 0);
        economiaPorMes[mi].compras += val;
        valorCompras += val;
      }
    }

    for (const s of salidas) {
      const mi = new Date(s.fecha).getMonth();
      for (const it of s.items) {
        movimientosPorMes[mi].ventas += it.cantidad;
        totalVentasAnimales += it.cantidad;
        const val = it.cantidad * (precioMap.get(it.categoriaId)?.venta ?? 0);
        economiaPorMes[mi].ventas += val;
        valorVentas += val;
      }
    }

    const totalNacimientos = nacimientos.length;
    const totalMortandad = mortandades.length;
    const totalAnimales = categorias.reduce(
      (s, c) => s + (c.cantidad || 0),
      0,
    );
    // Balance neto del rodeo: ingresos (nac + compras) − egresos (mort + ventas)
    const balanceRodeo =
      totalNacimientos +
      totalComprasAnimales -
      totalMortandad -
      totalVentasAnimales;
    const resultadoBruto = valorVentas - valorCompras;

    const composicionIngresos = [
      { nombre: "Nacimientos", cantidad: totalNacimientos },
      { nombre: "Compras", cantidad: totalComprasAnimales },
    ].filter((d) => d.cantidad > 0);

    const composicionEgresos = [
      { nombre: "Ventas", cantidad: totalVentasAnimales },
      { nombre: "Mortandad", cantidad: totalMortandad },
    ].filter((d) => d.cantidad > 0);

    return {
      year,
      kpis: {
        totalNacimientos,
        totalMortandad,
        totalComprasAnimales,
        totalVentasAnimales,
        balanceRodeo,
        totalAnimales,
        valorCompras,
        valorVentas,
        resultadoBruto,
      },
      movimientosPorMes,
      economiaPorMes,
      composicionIngresos,
      composicionEgresos,
    };
  } catch (error) {
    console.error("Error getAnaliticas:", error);
    return defaultAnaliticas;
  }
}
