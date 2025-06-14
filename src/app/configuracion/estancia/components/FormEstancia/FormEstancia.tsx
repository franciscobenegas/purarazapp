"use client";
import React, { useEffect } from "react";
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
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import departamentos from "../../../../../data/departamento.json";
import distritos from "../../../../../data/distritos.json";
import localidades from "../../../../../data/localidad.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  nombre: z.string().min(2),
  departamento: z.string(),
  distrito: z.string(),
  localidad: z.string(),
  telefono: z.string(),
  ruc: z.string(),
});

interface FormProps {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export function FormEstancia(props: FormProps) {
  const { setOpenModal } = props;
  //   const router = useRouter();
  //   const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Estado para el botón de carga

  //   const [open, setOpen] = React.useState(false);
  //   const [value, setValue] = React.useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      departamento: "",
      distrito: "",
      localidad: "",
      telefono: "",
      ruc: "",
    },
  });
  //   const [open, setOpen] = useState(false);
  const { isValid } = form.formState;

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
        //(d) => d.Descripcion_de_Departamento === watchDepartamento
        (d) =>
          d.Codigo_de_Departamento ===
          String(watchDepartamento).padStart(2, "0")
      );
      setDistritosFiltrados(filtrados);
      form.setValue("distrito", "");
      form.setValue("localidad", "");
      setLocalidadesFiltradas([]);
    }
  }, [form, watchDepartamento]);

  useEffect(() => {
    if (watchDistrito && watchDepartamento) {
      const filtrados = localidades.filter(
        (l) =>
          l.Codigo_de_Departamento ===
            String(watchDepartamento).padStart(2, "0") &&
          l.Codigo_de_Distrito === String(watchDistrito).padStart(2, "0")
      );

      // const filtrados = localidades.filter(
      //   (l) =>
      //     l.Descripcion_de_Departamento === watchDepartamento &&
      //     l.Descripcion_de_Distrito === watchDepartamento
      // );

      setLocalidadesFiltradas(filtrados);
      form.setValue("localidad", "");
    }
  }, [form, watchDepartamento, watchDistrito]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true); // Desactivar el botón
    console.log("values", values);
    setOpenModal(false);

    setLoading(false); // Desactivar el botón
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    // try {
    //   setLoading(true); // Desactivar el botón

    //   const resp = await fetch("/api/categoria", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(values),
    //   });
    //   if (resp.ok) {
    //     router.refresh();
    //     setOpenModal(false);
    //     toast({
    //       title: "Exito!!! 😃",
    //       description: "Los datos fueron guardados",
    //       //variant: "successful",
    //     });
    //   }
    // } catch (error) {
    //   console.log(error);

    //   toast({
    //     title: "Error al dar de alta el Cliente",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setLoading(false); // Reactivar el botón
    // }
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
                            value={String(d.codigo_dpto)}
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
                        className="bg-slate-100"
                      >
                        {distritosFiltrados.map((d) => (
                          <SelectItem
                            key={d.Codigo_concatenado}
                            value={String(d.Codigo_de_Distrito)}
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
                        className="bg-slate-100"
                      >
                        {localidadesFiltradas.map((l) => (
                          <SelectItem
                            key={l.Codigo_concatenado}
                            value={l.Codigo_de_Barrio_Localidad}
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
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nro. Telefono</FormLabel>
                  <FormControl>
                    <Input placeholder="021-123 123" type="text" {...field} />
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
                  <FormLabel>Nro RUC</FormLabel>
                  <FormControl>
                    <Input placeholder="Nro de RUC" type="text" {...field} />
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
