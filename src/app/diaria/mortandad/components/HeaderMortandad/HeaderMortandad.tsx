"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Skull } from "lucide-react";
import React, { useState } from "react";
import { FormMortandad } from "../FormMortandad";
import {
  Propietario,
  Categoria,
  CausaMortandad,
  Potrero,
} from "@prisma/client";

interface PropsData {
  listPropietarios?: Propietario[];
  listCategoria: Categoria[];
  listCausaMortandad: CausaMortandad[];
  listPotrero: Potrero[];
}

export function HeaderMortandad(props: PropsData) {
  const { listPropietarios, listCategoria, listCausaMortandad, listPotrero } =
    props;
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex justify-between items-center mx-2">
      <div className="flex items-center space-x-2 ml-5">
        <Skull className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Gestion Mortandad Animal
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Administra las mortandades del establesimineto
          </h3>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Mortandad
          </Button>
        </DialogTrigger>
        <DialogContent className="w-auto h-full p-1 rounded-lg">
          <FormMortandad
            setOpenModal={setOpenModal}
            listPropietario={listPropietarios}
            listCategoria={listCategoria}
            listCausaMortandad={listCausaMortandad}
            listPotrero={listPotrero}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
