"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Categoria, MotivoPesaje, Potrero, Propietario } from "@prisma/client";
import { Plus, Weight } from "lucide-react";
import React, { useState } from "react";
import { FormPesaje } from "../FormPesaje";

interface PropsData {
  listPropietarios?: Propietario[];
  listMotivoPesaje: MotivoPesaje[];
  listCategorias: Categoria[];
  listPotreros: Potrero[];
}

export function HeaderPesaje(props: PropsData) {
  const { listCategorias, listMotivoPesaje, listPropietarios, listPotreros } = props;
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex justify-between items-center mx-2">
      <div className="flex items-center space-x-2 ml-5">
        <Weight className="h-8 w-8 text-primary" />
        

        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Pesaje de Animales
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Administra los pesajes de animales del establesimineto
          </h3>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Pesaje
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-background p-6 sm:p-6">
          <FormPesaje
            setOpenModal={setOpenModal}
            listCategorias={listCategorias}
            listMotivoPesaje={listMotivoPesaje}
            listPropietarios={listPropietarios}
            listPotreros={listPotreros}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
