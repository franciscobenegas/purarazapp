"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, TractorIcon } from "lucide-react";
import { FormEstancia } from "../FormEstancia";

export function HeaderEstancia() {
  const [openModal, setOpenModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); // 👈 nuevo estado

  useEffect(() => {
    async function fetchEstancias() {
      try {
        const res = await fetch("/api/estancia");
        const data = await res.json();

        // Si el array tiene 1 o más elementos, deshabilitar botón
        if (Array.isArray(data) && data.length >= 1) {
          setIsDisabled(true);
        } else {
          setIsDisabled(false);
        }
      } catch (error) {
        console.error("Error al cargar estancias", error);
        setIsDisabled(false); // por defecto, habilita en caso de error
      }
    }

    fetchEstancias();
  }, []);

  return (
    <div className="flex justify-between items-center ">
      <div className="flex items-center space-x-2 ml-5">
        <TractorIcon className="h-6 w-6" />
        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Gestion de Estancia
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Administra la información de tus Estancias
          </h3>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button disabled={isDisabled}>
            <Plus /> Estancia
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Estancias</DialogTitle>
            <DialogDescription>Crear estancia</DialogDescription>
          </DialogHeader>
          <FormEstancia setOpenModal={setOpenModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
