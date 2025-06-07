import {
  BarChart4,
  PanelsTopLeft,
  Settings,
  ShieldCheck,
  Calendar,
  ContactIcon,
  LayoutDashboard,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: PanelsTopLeft,
    label: "DashBoard",
    href: "/dashboard",
  },
  {
    icon: ContactIcon,
    label: "Clientes",
    href: "/clientes",
  },
  {
    icon: Calendar,
    label: "Calendario",
    href: "/tareas",
  },
];

export const dataToolsSidear = [
  {
    icon: LayoutDashboard,
    label: "Categorias",
    href: "/categorias",
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
      title: "CLIENTE",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Clientes",
          url: "/clientes",
        },
        {
          title: "Tipos",
          url: "/tipoclientes",
        },
        {
          title: "Cuentas por Cobrar",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
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
