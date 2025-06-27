import React, { Dispatch, SetStateAction, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

interface FormPropietarioProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const formSchema = z.object({
  nombre: z.string().min(4),
  email: z
    .string()
    .min(1, { message: "El campo es requerido." })
    .email("No es un correo electrónico válido."),
  telefono: z.string(),
});

export function FormPropietario(props: FormPropietarioProps) {
  const { setOpen } = props;
  const params = useParams<{ estanciaId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Estado para el botón de carga

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
    },
  });
  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true); // Desactivar el botón

      const resp = await fetch(
        `/api/estancia/${params.estanciaId}/propietario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (resp.ok) {
        toast.success("Exito!!! 😃 ", {
          description: "Los datos fueron guardados",
        });
        router.refresh();
        setOpen(false);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="usuario@mail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
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
                  <Input placeholder="(0981) 111 222" type="text" {...field} />
                </FormControl>
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
  );
}
