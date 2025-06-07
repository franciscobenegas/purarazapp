"use client";
import React from "react";
import { SidebarRoutes } from "../SidebarRoutes";
import { Logo } from "../Logo";

export function Sidebar() {
  return (
    <div className="h-screen">
      <div className="h-full flex flex-col border-r">
        <Logo />
        <SidebarRoutes />
      </div>
    </div>
  );
}
