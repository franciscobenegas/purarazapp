"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import { Categoria } from "@prisma/client";

interface PropsData {
  listCategoria: Categoria[];
}

export function HeaderMovimientos(props: PropsData) {
  const { listCategoria } = props;

  return (
    <div className="flex justify-between items-center mx-2">
      <div className="flex items-center space-x-2 ml-5">
        <ArrowRight className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Gestión de Movimientos
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Visualiza todos los movimientos de categorías del establecimiento
          </h3>
        </div>
      </div>
    </div>
  );
}
