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
import { Plus } from "lucide-react";
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
      <h2 className="text-2xl text-primary">Listado Estancia</h2>

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
