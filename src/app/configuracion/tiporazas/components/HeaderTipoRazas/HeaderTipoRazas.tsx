"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Award, Plus } from "lucide-react";
import React, { useState } from "react";
import { FormTipoRaza } from "../FormTipoRaza/FormTipoRaza";

export function HeaderTipoRazas() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex justify-between items-center mx-2">
      <div className="flex items-center space-x-2 ml-5">
        <Award className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Gestion de Tipos de Razas
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Administra los tipos de razas del establesimineto
          </h3>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Tipo Raza
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Tipos de Razas</DialogTitle>
            <DialogDescription>Crear nuevos tipos de razas</DialogDescription>
          </DialogHeader>
          <FormTipoRaza setOpenModal={setOpenModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
