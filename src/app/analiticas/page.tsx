import {
  Sprout,
  ThumbsDown,
  ArrowDownToLine,
  ArrowUpFromLine,
  Scale,
  DollarSign,
  TrendingUp,
  Banknote,
  Calendar,
  BarChart4,
} from "lucide-react";
import { CardSummary } from "../components/CardSummary";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AnaliticasCharts } from "../components/AnaliticasCharts";

import { getAnaliticas } from "@/lib/analiticas";
import { getUserFromToken } from "@/utils/getUserFromToken";

const obtenerFecha = () => {
  const opciones: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("es-ES", opciones);
};

const formatMoneyCard = (value: number) => {
  const abs = Math.abs(value);
  const signo = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${signo}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${signo}$${Math.round(abs / 1_000)}K`;
  return `${signo}$${abs.toLocaleString("es-AR")}`;
};

async function AnaliticasPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("tokenPuraRaza")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const user = getUserFromToken();

  if (!user) {
    redirect("/auth/login");
  }

  const data = await getAnaliticas(user.establesimiento);
  const { kpis } = data;

  const dataOperativo = [
    {
      icon: Sprout,
      total: kpis.totalNacimientos.toString(),
      average: 75,
      title: "Nacimientos " + data.year,
      tooltipText: "Terneros nacidos registrados en el año",
    },
    {
      icon: ThumbsDown,
      total: kpis.totalMortandad.toString(),
      average: 15,
      title: "Mortandad " + data.year,
      tooltipText: "Animales muertos registrados en el año",
    },
    {
      icon: ArrowDownToLine,
      total: kpis.totalComprasAnimales.toString(),
      average: 60,
      title: "Compras (animales)",
      tooltipText: "Animales ingresados por entradas en el año",
    },
    {
      icon: ArrowUpFromLine,
      total: kpis.totalVentasAnimales.toString(),
      average: 75,
      title: "Ventas (animales)",
      tooltipText: "Animales egresados por salidas en el año",
    },
    {
      icon: Scale,
      total: (kpis.balanceRodeo >= 0 ? "+" : "") + kpis.balanceRodeo.toString(),
      average: kpis.balanceRodeo >= 0 ? 75 : 5,
      title: "Balance del rodeo",
      tooltipText:
        "Crecimiento neto del rodeo: (nacimientos + compras) − (mortandad + ventas)",
    },
  ];

  const dataEconomico = [
    {
      icon: DollarSign,
      total: formatMoneyCard(kpis.valorCompras),
      average: 50,
      title: "Valor de Compras",
      tooltipText:
        "Valor estimado de las compras del año (animales ingresados × precio costo por cabeza)",
    },
    {
      icon: TrendingUp,
      total: formatMoneyCard(kpis.valorVentas),
      average: kpis.valorVentas >= kpis.valorCompras ? 75 : 30,
      title: "Valor de Ventas",
      tooltipText:
        "Valor estimado de las ventas del año (animales egresados × precio venta por cabeza)",
    },
    {
      icon: Banknote,
      total: formatMoneyCard(kpis.resultadoBruto),
      average: kpis.resultadoBruto >= 0 ? 80 : 5,
      title: "Resultado Bruto",
      tooltipText: "Resultado económico del año (valor de ventas − valor de compras)",
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-primary text-3xl font-bold flex items-center gap-2">
          <BarChart4 className="h-7 w-7" />
          Analíticas
        </h1>

        <div className="flex items-center gap-2 text-muted-foreground mt-1">
          <Calendar className="h-4 w-4" />
          <p>{obtenerFecha()}</p>
        </div>
      </div>

      <Separator className="mb-5 mt-5" />

      {/* Resumen operativo */}
      <h2 className="text-xl font-bold mb-5">Resumen Operativo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-6">
        {dataOperativo.map(({ icon, total, average, title, tooltipText }) => (
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

      {/* Resumen económico */}
      <Separator className="mb-5 mt-12" />
      <h2 className="text-xl font-bold mb-5">Resumen Económico</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
        {dataEconomico.map(({ icon, total, average, title, tooltipText }) => (
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

      {/* Gráficos */}
      <Separator className="mb-5 mt-12" />
      <h2 className="text-xl font-bold mb-5">Tendencias y Composición</h2>
      <AnaliticasCharts data={data} />
    </div>
  );
}

export default AnaliticasPage;
