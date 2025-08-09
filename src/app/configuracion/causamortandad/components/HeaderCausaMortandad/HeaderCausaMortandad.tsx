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
import { Plus, ThumbsDown } from "lucide-react";
import React, { useState } from "react";
import { FormCausaMortandad } from "../FormCausaMortandad";

export function HeaderCausaMortandad() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex justify-between items-center mx-2">
      <div className="flex items-center space-x-2 ml-5">
        <ThumbsDown className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Gestion Causa de Mortandad
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Administra los tipos de mortandades del establesimineto
          </h3>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Causa Mortandad
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Causa Mortandad</DialogTitle>
            <DialogDescription>
              Crear nueva cauda de mortandad
            </DialogDescription>
          </DialogHeader>
          <FormCausaMortandad setOpenModal={setOpenModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
