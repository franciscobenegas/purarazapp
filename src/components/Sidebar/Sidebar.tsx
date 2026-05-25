"use client";
import React from "react";
import { SidebarRoutes } from "../SidebarRoutes";
import { Logo } from "../Logo";
import { useSession } from "@/hooks/useSession";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { user, loading } = useSession();
  const { open } = useSidebar();

  // Si está cargando, no mostrar nada o mostrar un loader
  if (loading) {
    return null; // o puedes retornar un <LoadingSpinner /> si prefieres
  }

  return (
    <div
      className={cn(
        "h-full hidden transition-all duration-300",
        user.email && open && "xl:block w-72 xl:fixed",
        user.email && !open && "xl:w-0 xl:fixed xl:overflow-hidden",
      )}
    >
      <div className="h-screen">
        <div className="h-full flex flex-col border-r">
          <Logo />
          <SidebarRoutes />
        </div>
      </div>
    </div>
  );
}
