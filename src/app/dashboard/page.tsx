import {
  BookOpenCheck,
  Waypoints,
  Calendar,
  ThumbsDown,
  DollarSign,
  TrendingUp,
  Banknote,
} from "lucide-react";
import { CardSummary } from "../components/CardSummary";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardCharts } from "../components/DashboardCharts";
import { CategoriaStats } from "../components/CategoriaStats";
import { FinancialCharts } from "../components/FinancialCharts";

import { getDashboardStats } from "@/lib/dashboard";
import { getUserFromToken } from "@/utils/getUserFromToken";

const obtenerFecha = () => {
  const fecha = new Date();

  const opciones: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return fecha.toLocaleDateString("es-ES", opciones);
};

const formatMoneyCard = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value.toLocaleString("es-AR")}`;
};

async function DashboardPage() {
  const cookieStore = cookies();

  const token = cookieStore.get("tokenPuraRaza")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const user = getUserFromToken();

  if (!user) {
    redirect("/auth/login");
  }

  const stats = await getDashboardStats(user.establesimiento);

  const { inversionTotal, valorVentaTotal, margenPotencial } = stats.estadisticas;

  const margenPct =
    inversionTotal > 0
      ? Math.min(95, Math.max(5, Math.round((margenPotencial / inversionTotal) * 100)))
      : 50;

  const dataCardSummary = [
    {
      icon: ThumbsDown,
      total: stats.estadisticas.totalMortandad.toString(),
      average: 15,
      title: "Total Mortandad " + stats.year,
      tooltipText: "Mortandad registrada en el año",
    },
    {
      icon: Waypoints,
      total: stats.estadisticas.tasaMortandad,
      average: 30,
      title: "Tasa de Mortandad %",
      tooltipText: "Porcentaje de mortandad del total de animales",
    },
    {
      icon: BookOpenCheck,
      total: stats.estadisticas.totalAnimales.toString(),
      average: 30,
      title: "Total de Animales",
      tooltipText: "Cantidad total de animales en el sistema",
    },
  ];

  const dataCardFinanciero = [
    {
      icon: DollarSign,
      total: formatMoneyCard(inversionTotal),
      average: 50,
      title: "Inversión Total",
      tooltipText:
        "Capital total invertido en el establecimiento (cantidad × precio costo por cabeza)",
    },
    {
      icon: TrendingUp,
      total: formatMoneyCard(valorVentaTotal),
      average: valorVentaTotal > inversionTotal ? 75 : 15,
      title: "Valor de Venta",
      tooltipText:
        "Valor total de venta potencial del stock (cantidad × precio venta por cabeza)",
    },
    {
      icon: Banknote,
      total: formatMoneyCard(margenPotencial),
      average: margenPotencial >= 0 ? Math.max(margenPct, 21) : 5,
      title: "Margen Potencial",
      tooltipText:
        "Ganancia potencial total del establecimiento (valor venta − inversión)",
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-primary text-3xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-2 text-muted-foreground mt-1">
          <Calendar className="h-4 w-4" />
          <p>{obtenerFecha()}</p>
        </div>
      </div>

      <Separator className="mb-5 mt-5" />

      {/* Resumen operativo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
        {dataCardSummary.map(({ icon, total, average, title, tooltipText }) => (
          <CardSummary
            key={title}
            icon={icon}
            total={total}
            average={average}
            title={title}
            tooltipText={tooltipText}
          />
        ))}
      </div>

      <div className="mt-12">
        <DashboardCharts stats={stats} />
      </div>

      {/* Resumen financiero */}
      <Separator className="mb-5 mt-12" />
      <h2 className="text-xl font-bold mb-5">Análisis Financiero</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
        {dataCardFinanciero.map(({ icon, total, average, title, tooltipText }) => (
          <CardSummary
            key={title}
            icon={icon}
            total={total}
            average={average}
            title={title}
            tooltipText={tooltipText}
          />
        ))}
      </div>

      <div className="mt-8">
        <FinancialCharts inversionPorCategoria={stats.inversionPorCategoria} />
      </div>

      <Separator className="mb-5 mt-12" />
      <h2 className="text-xl font-bold mb-5">Inventario por Categoría</h2>

      <div className="mt-0">
        <CategoriaStats categorias={stats.categorias} />
      </div>
    </div>
  );
}

export default DashboardPage;
