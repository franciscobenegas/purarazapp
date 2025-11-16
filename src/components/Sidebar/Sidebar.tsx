"use client";
import React from "react";
import { SidebarRoutes } from "../SidebarRoutes";
import { Logo } from "../Logo";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { user, loading } = useSession();

  // Si está cargando, no mostrar nada o mostrar un loader
  if (loading) {
    return null; // o puedes retornar un <LoadingSpinner /> si prefieres
  }

  return (
    <div
      className={cn("h-full  hidden", user.email && "xl:block w-72 xl:fixed")}
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
