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
import { Plus, Weight } from "lucide-react";
import React, { useState } from "react";
import { FormMotivoPesaje } from "../FormMotivoPesaje";
// import { FormCausaMortandad } from "../FormCausaMortandad";

export function HeaderMotivoPesaje() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex justify-between items-center mx-2">
      <div className="flex items-center space-x-2 ml-5">
        <Weight className="h-8 w-8" />
        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Gestion Motivo Pesaje
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Administra los tipos de motivos de pesajes del establesimineto
          </h3>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Motivo Pesaje
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Motivo Pesaje</DialogTitle>
            <DialogDescription>Crear nuevo motivo pesaje</DialogDescription>
          </DialogHeader>
          <FormMotivoPesaje setOpenModal={setOpenModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
