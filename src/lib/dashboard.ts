import prisma from "@/libs/prisma";

export const defaultStats = {
  year: new Date().getFullYear(),
  estadisticas: {
    totalMortandad: 0,
    totalAnimales: 0,
    tasaMortandad: "0%",
    totalNacimientos: 0,
    totalEntradasAnimales: 0,
    totalSalidasAnimales: 0,
  },
  mortandadPorCategoria: [],
  mortandadPorCausa: [],
  mortandadPorMes: Array.from({ length: 12 }, (_, i) => ({
    mes: new Date(new Date().getFullYear(), i).toLocaleString("es-ES", {
      month: "short",
    }),
    cantidad: 0,
  })),
  categorias: [],
};

export async function getDashboardStats(establesimiento: string) {
  try {
    const year = new Date().getFullYear();

    // Mortandades
    const mortandades = await prisma.mortandad.findMany({
      where: {
        establesimiento,
        fecha: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      include: {
        categoria: true,
        causa: true,
      },
    });

    // Categorías
    const categorias = await prisma.categoria.findMany({
      where: {
        establesimiento,
      },
    });

    // Mortandad por categoría
    const mortandadPorCategoria = categorias.map((cat) => ({
      nombre: cat.nombre,
      mortandad: mortandades.filter((m) => m.categoriaId === cat.id).length,
      cantidad: cat.cantidad || 0,
    }));

    // Mortandad por causa
    const mortandadPorCausa = await prisma.causaMortandad.findMany({
      where: { establesimiento },
      include: {
        mortandades: {
          where: {
            fecha: {
              gte: new Date(`${year}-01-01`),
              lte: new Date(`${year}-12-31`),
            },
          },
        },
      },
    });

    const causasData = mortandadPorCausa.map((causa) => ({
      nombre: causa.nombre,
      cantidad: causa.mortandades.length,
    }));

    // Mortandad por mes
    const mesesData = Array.from({ length: 12 }, (_, i) => {
      const nombreMes = new Date(year, i).toLocaleString("es-ES", {
        month: "short",
      });

      const cantidad = mortandades.filter(
        (m) => new Date(m.fecha).getMonth() === i
      ).length;

      return {
        mes: nombreMes,
        cantidad,
      };
    });

    // Totales
    const totalMortandad = mortandades.length;

    const totalAnimales = categorias.reduce(
      (sum, cat) => sum + (cat.cantidad || 0),
      0
    );

    const tasaMortandad =
      totalAnimales > 0
        ? ((totalMortandad / totalAnimales) * 100).toFixed(2)
        : "0";

    // Nacimientos
    const nacimientos = await prisma.nacimiento.findMany({
      where: {
        establesimiento,
        fecha: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });

    // Entradas
    const entradas = await prisma.entrada.findMany({
      where: {
        establesimiento,
        fecha: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      include: {
        items: true,
      },
    });

    const totalEntradasAnimales = entradas.reduce(
      (sum, e) => sum + e.items.reduce((s, i) => s + i.cantidad, 0),
      0
    );

    // Salidas
    const salidas = await prisma.salida.findMany({
      where: {
        establesimiento,
        fecha: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      include: {
        items: true,
      },
    });

    const totalSalidasAnimales = salidas.reduce(
      (sum, s) => sum + s.items.reduce((s2, i) => s2 + i.cantidad, 0),
      0
    );

    return {
      year,
      estadisticas: {
        totalMortandad,
        totalAnimales,
        tasaMortandad: `${tasaMortandad}%`,
        totalNacimientos: nacimientos.length,
        totalEntradasAnimales,
        totalSalidasAnimales,
      },
      mortandadPorCategoria: mortandadPorCategoria.filter(
        (m) => m.mortandad > 0
      ),
      mortandadPorCausa: causasData.filter((c) => c.cantidad > 0),
      mortandadPorMes: mesesData,
      categorias: categorias.map((cat) => ({
        id: cat.id,
        nombre: cat.nombre,
        cantidad: cat.cantidad || 0,
        sexo: cat.sexo,
        edad: cat.edad,
      })),
    };
  } catch (error) {
    console.error("Error getDashboardStats:", error);
    return defaultStats;
  }
}