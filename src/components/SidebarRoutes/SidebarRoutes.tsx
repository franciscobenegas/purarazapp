"use client";
import React from "react";
import { data, dataSupportSidear, dataToolsSidear } from "./SidebarRoutes.data";
import { SidebarItem } from "../SidebarItem";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { CreditCard } from "lucide-react";
import { NavMain } from "./components/nav-main";

export function SidebarRoutes() {
  return (
    <div className="flex flex-col justify-between h-full overflow-auto">
      <div>
        <div className="p-2 md:p-6">
          <p className=" text-primary mb-2 font-bold">GENERAL</p>
          <NavMain items={data.navMain} />
        </div>
        <Separator />
        <div className="p-2 md:p-6">
          <p className=" mb-2 font-bold text-primary">CONFIGURACIONES</p>
          {dataToolsSidear.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        <Separator />

        <div className="p-2 md:p-6">
          <p className=" text-primary mb-2 font-bold">SOPORTES</p>
          {dataSupportSidear.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-center p-6 ">
          <Button variant="outline" className="w-full hover:text-blue-500">
            Actualizar Plan
            <CreditCard className="h-5 w-5 ml-10" />
          </Button>
        </div>
        <Separator />
        <footer className="mt-3 p-3 text-center">
          @{new Date().getFullYear()}. Todos los derechos reservados
        </footer>
      </div>
    </div>
  );
}
