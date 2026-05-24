"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Categoria, MotivoSalida, Propietario } from "@prisma/client";
import { Plus,  CircleMinus } from "lucide-react";
import React, { useState } from "react";
import { FormSalida } from "../FormSalida";

interface PropsData {
  listPropietarios?: Propietario[];
  listMotivoSalida: MotivoSalida[];
  listCategorias: Categoria[];
}

export function HeaderSalida(props: PropsData) {
  const { listCategorias, listMotivoSalida, listPropietarios } = props;
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex justify-between items-center mx-2">
      <div className="flex items-center space-x-2 ml-5">
        <CircleMinus className="h-8 w-8 text-primary" />

        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Salida de Animales
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Administra las salidas de animales del establesimineto
          </h3>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Salida
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-background p-6 sm:p-6">
          <FormSalida
            setOpenModal={setOpenModal}
            listCategorias={listCategorias}
            listMotivoSalida={listMotivoSalida}
            listPropietarios={listPropietarios}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
