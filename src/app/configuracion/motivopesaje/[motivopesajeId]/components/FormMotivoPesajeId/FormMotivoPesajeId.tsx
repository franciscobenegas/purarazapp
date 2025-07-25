"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MotivoPesaje } from "@prisma/client";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

interface MotivoPesajeFormProops {
  motivoPesaje: MotivoPesaje;
}

const formSchema = z.object({
  nombre: z.string().min(5),
});

export function FormMotivoPesajeId(props: MotivoPesajeFormProops) {
  const { motivoPesaje } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Estado para el botón de carga
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: motivoPesaje.nombre,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const motivoPesajeMod = {
      nombre: values.nombre,
    };

    try {
      setLoading(true); // Desactivar el botón
      const resp = await fetch(`/api/motivopesaje/${motivoPesaje.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(motivoPesajeMod),
      });

      if (resp.ok) {
        toast.success("Exito!!! 😃 ", {
          description: "Los datos fueron actualizados...",
        });
        router.push("/configuracion/motivopesaje");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Error !!!", {
        description: message,
      });
    } finally {
      setLoading(false); // Reactivar el botón
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Nombre </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre Cliente..."
                    type="text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
              Actualizando...
            </>
          ) : (
            "Actualizar Dato"
          )}
        </Button>
      </form>
    </Form>
  );
}
