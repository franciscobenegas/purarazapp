"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Propietario } from "@prisma/client";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormPropietario } from "../../../NewPropietario/FormPropietario";
import { useState } from "react";

interface MenuPropietarioProps {
  propietario: Propietario;
}

export function MenuPropietario({ propietario }: MenuPropietarioProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onEdit = () => {
    // Primero cerramos el dropdown
    setDropdownOpen(false);
    // Y luego abrimos el diálogo con un pequeño delay
    setTimeout(() => {
      setDialogOpen(true);
    }, 50); // Pequeña espera para que el foco se libere correctamente
  };

  const onDelete = async (id: string) => {
    try {
      const resp = await fetch(`/api/propietario/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (resp.ok) {
        toast.warning("Atención!!! 😞", {
          description: "Los datos fueron eliminados...",
        });
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Error !!!", {
        description: message,
      });
    }
  };

  return (
    <div>
      <div className="flex justify-end">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit()}>
              <Pencil className="w-4 h-4 mr-2" />
              Modificar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(propietario.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo propietario</DialogTitle>
            <DialogDescription>
              Formulario para alta de un nuevo propietario
            </DialogDescription>
          </DialogHeader>
          <FormPropietario setOpen={setDialogOpen} propietario={propietario} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
