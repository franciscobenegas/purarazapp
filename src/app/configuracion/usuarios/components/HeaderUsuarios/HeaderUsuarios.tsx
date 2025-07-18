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
import { Plus, Users } from "lucide-react";
import React, { useState } from "react";
import { FormUsuarios } from "../FormUsuarios";

export function HeaderUsuarios() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex justify-between items-center mx-2">
      <div className="flex items-center space-x-2 ml-5">
        <Users className="h-8 w-8" />
        <div>
          <h2 className="text-primary text-2xl font-semibold leading-none tracking-tight">
            Gestion de Usuarios
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Administra los usuarios del establesimineto
          </h3>
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Usuario
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Usuarios</DialogTitle>
            <DialogDescription>Crear nuevos Usuarios</DialogDescription>
          </DialogHeader>
          <FormUsuarios setOpenModal={setOpenModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
