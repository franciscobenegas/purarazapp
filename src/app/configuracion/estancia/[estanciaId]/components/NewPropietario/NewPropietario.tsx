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
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { FormPropietario } from "./FormPropietario";

export function NewPropietario() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-10 h-10" /> Propietario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Agregra nuevo proprietario</DialogTitle>
          <DialogDescription>
            Formulario para alta de un nuevo propietario
          </DialogDescription>
        </DialogHeader>
        <FormPropietario setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
