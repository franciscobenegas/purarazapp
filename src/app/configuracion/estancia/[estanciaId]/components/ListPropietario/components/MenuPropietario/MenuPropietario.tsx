"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Propietario } from "@prisma/client";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface MenuPropietarioProps {
  propietario: Propietario;
}

export function MenuPropietario(props: MenuPropietarioProps) {
  const router = useRouter();
  const { propietario } = props;

  const [deletingPropietario, setDeletingPropietario] =
    useState<Propietario | null>(null);
  const [loading, setLoading] = useState(false); // Estado para el botón de carga

  const onEdit = (propietario: {
    id: string;
    nombre: string;
    telefono: string;
    usuario: string;
    createdAt: Date;
    updatedAt: Date;
    establesimiento: string;
    email: string;
    estanciaId: string;
  }) => {
    console.log("onEdit", propietario);
  };

  const onDelete = async (value: string) => {
    setLoading(true); // Desactivar el botón
    try {
      const resp = await fetch(`/api/propietario/${value}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.ok) {
        toast.warning("Exito!!! 😃 ", {
          description: "Los datos fueron eliminados...",
        });

        router.refresh();
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Error !!!", {
        description: message,
      });
    } finally {
      setLoading(false); // Reactivar el botón
    }
  };

  return (
    <div>
      {/* Menú de acciones */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onEdit(propietario)}
              className="w-full"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Modificar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeletingPropietario(propietario)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog para Eliminar */}
        <Dialog
          open={!!deletingPropietario}
          onOpenChange={() => setDeletingPropietario(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-primary">
                Eliminar Propietario 🗑️
              </DialogTitle>

              <DialogDescription>
                <p className="mt-2">
                  ¿Estás seguro de que deseas eliminar el registro de
                  <span className="font-bold italic">
                    {" " + propietario?.nombre + " "}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:space-x-0">
              <DialogClose>
                <Button
                  variant="outline"
                  onClick={() => setDeletingPropietario(null)}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => onDelete(propietario.id)}
                disabled={loading}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
