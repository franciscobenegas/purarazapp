"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Estancia } from "@prisma/client";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import departamentos from "../../../../../../data/departamento.json";
import distritos from "../../../../../../data/distritos.json";
import localidades from "../../../../../../data/localidad.json";

import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const watchDepartamento = form.watch("departamento");
  const watchDistrito = form.watch("distrito");

  const [distritosFiltrados, setDistritosFiltrados] = useState<
    typeof distritos
  >([]);
  const [localidadesFiltradas, setLocalidadesFiltradas] = useState<
    typeof localidades
  >([]);

  useEffect(() => {
    if (watchDepartamento) {
      const filtrados = distritos.filter(
        (d) => d.Descripcion_de_Departamento === watchDepartamento
      );

      const datosOrdenados = [...filtrados].sort((a, b) =>
        a.Descripcion_de_Distrito.localeCompare(b.Descripcion_de_Distrito)
      );

      setDistritosFiltrados(datosOrdenados);
      form.setValue("distrito", estancia.distrito);
      form.setValue("localidad", estancia.localidad);
      setLocalidadesFiltradas([]);
    }
  }, [estancia.distrito, estancia.localidad, form, watchDepartamento]);

  useEffect(() => {
    if (watchDistrito && watchDepartamento) {
      const filtrados = localidades.filter(
        (l) =>
          l.Descripcion_de_Departamento ===
            String(watchDepartamento).padStart(2, "0") &&
          l.Descripcion_de_Distrito === String(watchDistrito).padStart(2, "0")
      );
      const datosOrdenados = [...filtrados].sort((a, b) =>
        a.Descripcion_de_Barrio_Localidad.localeCompare(
          b.Descripcion_de_Barrio_Localidad
        )
      );
      setLocalidadesFiltradas(datosOrdenados);
      form.setValue("localidad", estancia.localidad);
    }
  }, [estancia.localidad, form, watchDepartamento, watchDistrito]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const estanciaMod = {
      nombre: values.nombre,
      departamento: values.departamento,
      distrito: values.distrito,
      localidad: values.localidad,
      ruc: values.ruc,
      telefono: values.telefono,
    };

    try {
      setLoading(true); // Desactivar el botón
      const resp = await fetch(`/api/estancia/${estancia.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(estanciaMod),
      });

      if (resp.ok) {
        toast.success("Exito!!! 😃 ", {
          description: "Los datos fueron actualizados...",
        });
        router.push("/configuracion/estancia");
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

          {/* Departamento */}
          <FormField
            control={form.control}
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map((d) => (
                        <SelectItem
                          key={d.codigo_dpto}
                          value={String(d.descripcion_dpto)}
                        >
                          {d.descripcion_dpto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Distrito */}
          <FormField
            control={form.control}
            name="distrito"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distrito</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!distritosFiltrados.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un distrito" />
                    </SelectTrigger>
                    <SelectContent
                      position="item-aligned"
                      // className="bg-slate-100"
                    >
                      {distritosFiltrados.map((d) => (
                        <SelectItem
                          key={d.Codigo_concatenado}
                          value={String(d.Descripcion_de_Distrito)}
                        >
                          {d.Descripcion_de_Distrito}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Localidad */}
          <FormField
            control={form.control}
            name="localidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localidad</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!localidadesFiltradas.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una localidad" />
                    </SelectTrigger>
                    <SelectContent
                      position="item-aligned"
                      // className="bg-slate-100"
                    >
                      {localidadesFiltradas.map((l) => (
                        <SelectItem
                          key={l.Codigo_concatenado}
                          value={l.Descripcion_de_Barrio_Localidad}
                        >
                          {l.Descripcion_de_Barrio_Localidad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              Actualizando
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            </>
          ) : (
            "Actualizar"
          )}
        </Button>
      </form>
    </Form>
  );
}
