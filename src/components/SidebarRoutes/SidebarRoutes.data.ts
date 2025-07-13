import {
  BarChart4,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  NotebookTextIcon,
} from "lucide-react";

export const dataToolsSidear = [
  {
    icon: LayoutDashboard,
    label: "Estancia",
    href: "/configuracion/estancia",
  },
  {
    icon: BarChart4,
    label: "Analiticas",
    href: "/analiticas",
  },
];

export const dataSupportSidear = [
  {
    icon: Settings,
    label: "Configuraciones",
    href: "/configs",
  },
  {
    icon: ShieldCheck,
    label: "Seguridad",
    href: "/seguridad",
  },
];

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Parte Diaria",
      url: "#",
      icon: NotebookTextIcon,
      isActive: true,
      items: [
        {
          title: "Mortandad",
          url: "/clientes",
        },
        {
          title: "Nacimiento",
          url: "/tipoclientes",
        },
        {
          title: "Entrada",
          url: "#",
        },
        {
          title: "Salida",
          url: "#",
        },
        {
          title: "Pesaje",
          url: "#",
        },
        {
          title: "Movimientos",
          url: "#",
        },
      ],
    },

    {
      title: "Configuraicones",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Clasificacion",
          url: "#",
        },
        {
          title: "Tipo Razas",
          url: "/configuracion/tiporazas",
        },
        {
          title: "Causa Mortandad",
          url: "/configuracion/causamortandad",
        },
        {
          title: "Motivo Pesaje",
          url: "/configuracion/motivopesaje",
        },
        {
          title: "Motivo Entrada",
          url: "/configuracion/motivoentrada",
        },
        {
          title: "Motivo Salida",
          url: "/configuracion/motivosalida",
        },
        {
          title: "Establecimiento",
          url: "#",
        },
        {
          title: "Usuarios",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};
