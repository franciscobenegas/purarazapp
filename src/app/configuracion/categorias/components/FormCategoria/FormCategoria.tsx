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
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Enums basados en el contexto ganadero
const Sexo = {
  MACHO: "Macho",
  HEMBRA: "Hembra",
} as const;

const Edad = {
  ADULATO: "Adulto",
  JOVEN: "Joven",
  RECIEN_NACIDO: "RecienNacido",
} as const;

const formSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  sexo: z.enum([Sexo.MACHO, Sexo.HEMBRA], {
    required_error: "Debe seleccionar un sexo",
  }),
  edad: z.enum([Edad.ADULATO, Edad.JOVEN, Edad.RECIEN_NACIDO], {
    required_error: "Debe seleccionar una edad",
  }),
  promedioKilos: z
    .number()
    .min(1, "El promedio de kilos debe ser mayor a 0")
    .max(2000, "El promedio no puede exceder 2000 kg"),
  precioVentaCabeza: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  precioVentaKilo: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  precioCostoCabeza: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  precioCostoKilo: z.number().min(0, "El precio debe ser mayor o igual a 0"),
});

interface FormProps {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export function FormCategoria(props: FormProps) {
  const { setOpenModal } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Estado para el botón de carga

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      promedioKilos: 0,
      precioVentaCabeza: 0,
      precioVentaKilo: 0,
      precioCostoCabeza: 0,
      precioCostoKilo: 0,
    },
  });

  // const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true); // Desactivar el botón

      const resp = await fetch("/api/categoria", {
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
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Categoría</CardTitle>
          <CardDescription>
            Complete el formulario para dar de alta una nueva categoría de
            ganado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Categoría</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Novillos 400-450kg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="promedioKilos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promedio de Kilos</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="450"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sexo y Edad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar sexo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Sexo.MACHO}>Macho</SelectItem>
                          <SelectItem value={Sexo.HEMBRA}>Hembra</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="edad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edad/Categoría</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar edad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Edad.ADULATO}>Adulato</SelectItem>
                          <SelectItem value={Edad.JOVEN}>Joven</SelectItem>
                          <SelectItem value={Edad.RECIEN_NACIDO}>
                            Recien Nacido
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Precios de Venta */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Precios de Venta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="precioVentaCabeza"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Venta por Cabeza (Gs.)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="150000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="precioVentaKilo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Venta por Kilo (Gs.)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="350"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Precios de Costo */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Precios de Costo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="precioCostoCabeza"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Costo por Cabeza (Gs.)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="120000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="precioCostoKilo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Costo por Kilo (Gs.)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="280"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Creando..." : "Crear Categoría"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpenModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
