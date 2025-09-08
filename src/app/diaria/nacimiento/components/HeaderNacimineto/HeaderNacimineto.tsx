"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Potrero, Propietario } from "@prisma/client";
import { Milk, Plus } from "lucide-react";
import React, { useState } from "react";
import { FormNacimiento } from "../FormNacimiento";

interface PropsData {
  listPropietarios?: Propietario[];
  listPotrero: Potrero[];
}

export function HeaderNacimineto(props: PropsData) {
  const { listPotrero, listPropietarios } = props;

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex justify-between items-center mx-2">
      <div className="flex items-center space-x-2 ml-5">
        <Milk className="h-8 w-8 text-primary" />

        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Gestion Nacimiento
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Administra los nacimientos del establesimineto
          </h3>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Nacimiento
          </Button>
        </DialogTrigger>
        <DialogContent className="w-auto h-full p-1 rounded-lg">
          <FormNacimiento
            setOpenModal={setOpenModal}
            listPropietario={listPropietarios}
            listPotrero={listPotrero}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
