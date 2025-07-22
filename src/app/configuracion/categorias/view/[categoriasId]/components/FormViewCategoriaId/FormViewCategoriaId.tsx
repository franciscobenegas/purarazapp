"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Categoria } from "@prisma/client";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
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

interface FormProops {
  categoria: Categoria;
}

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

export function FormViewCategoriaId(props: FormProops) {
  const { categoria } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Estado para el botón de carga
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: categoria.nombre,
      sexo: categoria.sexo,
      edad: categoria.edad,
      promedioKilos: categoria.promedioKilos,
      precioVentaCabeza: categoria.precioVentaCabeza,
      precioVentaKilo: categoria.precioVentaKilo,
      precioCostoCabeza: categoria.precioCostoCabeza,
      precioCostoKilo: categoria.precioCostoKilo,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const motivoSalidaMod = {
      nombre: values.nombre,
    };

    try {
      setLoading(true); // Desactivar el botón
      const resp = await fetch(`/api/categoria/${categoria.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(motivoSalidaMod),
      });

      if (resp.ok) {
        toast.success("Exito!!! 😃 ", {
          description: "Los datos fueron actualizados...",
        });
        router.push("/configuracion/categorias");
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
    <div className=" mx-auto py-4 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Visualizar datos Categoría</CardTitle>
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
                          disabled
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
                          disabled
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
                        disabled
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
                        disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                            disabled
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
                  {loading ? "Creando..." : "Modificar"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  // onClick={() => setOpenModal(false)}
                  disabled={loading}
                >
                  Eliminar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
