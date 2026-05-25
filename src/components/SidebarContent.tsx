"use client";
import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function SidebarContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "w-full transition-all duration-300 xl:ml-72",
        !open && "xl:ml-0"
      )}
    >
      {children}
    </div>
  );
}
