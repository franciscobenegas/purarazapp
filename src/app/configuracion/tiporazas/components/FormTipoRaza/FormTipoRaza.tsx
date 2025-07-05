"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  nombre: z.string().min(3),
});

interface FormProps {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export function FormTipoRaza(props: FormProps) {
  const { setOpenModal } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Estado para el botón de carga

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true); // Desactivar el botón

      const resp = await fetch("/api/tiporazas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (resp.ok) {
        toast.success("Exito!!! 😃 ", {
          description: "Los datos fueron guardados",
        });
        router.refresh();
        setOpenModal(false);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      console.error("error en FormEstancia", message);

      toast.error("Error !!!", {
        description: message,
      });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre de la estancia"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={!isValid || loading}>
            {loading ? (
              <>
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                Guardando
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
