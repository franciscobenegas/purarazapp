"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Categoria, MotivoEntrada, Propietario } from "@prisma/client";
import { Plus, PlusCircleIcon } from "lucide-react";
import React, { useState } from "react";
import { FormEntrada } from "../FormEntrada";

interface PropsData {
  listPropietarios?: Propietario[];
  listMotivoEntrada: MotivoEntrada[];
  listCategorias: Categoria[];
}

export function HeaderEntrada(props: PropsData) {
  const { listCategorias, listMotivoEntrada, listPropietarios } = props;
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex justify-between items-center mx-2">
      <div className="flex items-center space-x-2 ml-5">
        <PlusCircleIcon className="h-8 w-8 text-primary" />

        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Entrada de Animales
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Administra las entradas de animales del establesimineto
          </h3>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Entrada
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-background p-6 sm:p-6">
          <FormEntrada
            setOpenModal={setOpenModal}
            listCategorias={listCategorias}
            listMotivoEntrada={listMotivoEntrada}
            listPropietarios={listPropietarios}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
