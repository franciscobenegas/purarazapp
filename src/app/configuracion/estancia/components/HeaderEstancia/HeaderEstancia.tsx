"use client";
import { useState } from "react";
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
//import { FromCategorias } from "../FromCategorias";

export function HeaderEstancia() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex justify-between items-center ">
      <h2 className="text-2xl text-primary">Listado Categorias</h2>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            {" "}
            <Plus /> Categorias{" "}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Estancias</DialogTitle>
            <DialogDescription>Crear estancia</DialogDescription>
          </DialogHeader>
          {/* <FromCategorias setOpenModal={setOpenModal} /> */}
          <FormEstancia setOpenModal={setOpenModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
