import { BookOpenCheck, Waypoints, Calendar, ThumbsDown } from "lucide-react";
import { CardSummary } from "../components/CardSummary";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardCharts } from "../components/DashboardCharts";
import { CategoriaStats } from "../components/CategoriaStats";

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

async function DashboardPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("tokenPuraRaza")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const user = getUserFromToken();

  if (!user) {
    redirect("/auth/login");
  }

  const stats = await getDashboardStats(user.establesimiento);

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

      <div className="mt-12">
        <CategoriaStats categorias={stats.categorias} />
      </div>
    </div>
  );
}

export default DashboardPage;
