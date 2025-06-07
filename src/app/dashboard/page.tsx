import { BookOpenCheck, UserRound, Waypoints, Calendar } from "lucide-react";
import { CardSummary } from "../components/CardSummary";

// import { redirect } from "next/navigation";
import { UltimosClientes } from "../components/UltimosClientes";
import { SalesDistributors } from "../components/SalesDistributors";
import { TotalSuscripciones } from "../components/TotalSuscripciones";
import { ListaIntegrados } from "../components/ListaIntegrados";
import { Separator } from "@/components/ui/separator";

const dataCardSummary = [
  {
    icon: UserRound,
    total: "12.450",
    average: 15,
    title: "Compañias creadas",
    tooltipText: "ver mas datos de compañias creadas",
  },
  {
    icon: Waypoints,
    total: "86.5%",
    average: 80,
    title: "Total de Visitas",
    tooltipText: "ver mas datos de total de visitas",
  },
  {
    icon: BookOpenCheck,
    total: "365.000",
    average: 30,
    title: "Total de Ventas",
    tooltipText: "ver mas datos de Total de Ventas",
  },
];

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

const DashboardPage = async () => {
  return (
    <div>
      <div>
        <h1 className="text-primary text-3xl font-bold ">Dashboard</h1>
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
      <div className="grid grid-cols-1 xl:grid-cols-2 md:gap-x-10 mt-12 ">
        <UltimosClientes />
        <SalesDistributors />
      </div>
      <div className="flex-col xl:flex xl:flex-row gap-y-4 md:gap-y-0 mt-12 md:mt-10 justify-center md:gap-x-10">
        <TotalSuscripciones />
        <ListaIntegrados />
      </div>
    </div>
  );
};

export default DashboardPage;
