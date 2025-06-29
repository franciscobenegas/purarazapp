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

export function MenuPropietario(props: MenuPropietarioProps) {
  const router = useRouter();
  const { propietario } = props;
  const [open, setOpen] = useState(false);

  const onEdit = (propietario: Propietario) => {
    console.log("onEdit2", propietario);
    setOpen(true);
  };

  const onDelete = async (value: string) => {
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
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Error !!!", {
        description: message,
      });
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
              onClick={() => onDelete(propietario.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
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
    </div>
  );
}
