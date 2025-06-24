"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Estancia } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

interface EstanciaFormProops {
  estancia: Estancia;
}

const formSchema = z.object({
  nombre: z.string().min(5),
  departamento: z.string(),
  distrito: z.string(),
  localidad: z.string(),
  ruc: z.string(),
  telefono: z.string(),
});

export function FormEstancia(props: EstanciaFormProops) {
  const { estancia } = props;
  const router = useRouter();
  //const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Estado para el botón de carga
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: estancia.nombre,
      departamento: estancia.departamento,
      distrito: estancia.distrito,
      localidad: estancia.localidad,
      ruc: estancia.ruc,
      telefono: estancia.telefono,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const clienteAdd = {
      nombre: values.nombre,
      departamento: values.departamento,
      distrito: values.distrito,
      localidad: values.localidad,
      ruc: values.ruc,
      telefono: values.telefono,
    };

    try {
      setLoading(true); // Desactivar el botón
      const resp = await fetch(`/api/cliente/${estancia.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteAdd),
      });

      if (resp.ok) {
        // toast({
        //   title: "Dato Actualizado!!! 😃",
        //   variant: "successful",
        // });
        router.push("/clientes");
      }
    } catch (error) {
      //   toast({
      //     title: "Algo salio mal, vuelva a intentarlo",
      //     variant: "destructive",
      //   });
      console.log(error);
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

          <FormField
            control={form.control}
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Departamento ..."
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="distrito"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distrito</FormLabel>
                <FormControl>
                  <Input placeholder="Distrito ..." type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="localidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localidad</FormLabel>
                <FormControl>
                  <Input placeholder="Localidad ..." type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ruc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ruc</FormLabel>
                <FormControl>
                  <Input placeholder="Ruc ..." type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefono</FormLabel>
                <FormControl>
                  <Input placeholder="Telefono ..." type="text" {...field} />
                </FormControl>
                <FormMessage />
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
            "Actualizar Datos"
          )}
        </Button>
      </form>
    </Form>
  );
}
