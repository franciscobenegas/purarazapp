"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Categoria } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface FormProps {
  categoria: Categoria;
}

const SexoEnum = {
  MACHO: "Macho",
  HEMBRA: "Hembra",
} as const;

const EdadEnum = {
  ADULTO: "Adulto",
  JOVEN: "Joven",
  RECIEN_NACIDO: "RecienNacido",
} as const;

const formSchema = z.object({
  nombre: z.string().min(1).max(100),
  sexo: z.enum([SexoEnum.MACHO, SexoEnum.HEMBRA]),
  edad: z.enum([EdadEnum.ADULTO, EdadEnum.JOVEN, EdadEnum.RECIEN_NACIDO]),
  promedioKilos: z.number().min(1).max(2000),
  precioVentaCabeza: z.number().min(0),
  precioVentaKilo: z.number().min(0),
  precioCostoCabeza: z.number().min(0),
  precioCostoKilo: z.number().min(0),
  usuario: z.string(),
  updatedAt: z.date(),
  cantidad: z.number().nullable(),
});

export function FormViewCategoriaId({ categoria }: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Estado para el botón de carga
  const [openModal, setopenModal] = useState(false);

  const handleDeleteConfirm = async () => {
    setLoading(true); // Desactivar el botón
    try {
      const resp = await fetch(`/api/categoria/${categoria.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.ok) {
        toast.warning("Exito!!! 😃 ", {
          description: "Los datos fueron eliminados...",
        });
        router.push("/configuracion/categorias");
        router.refresh();
      }
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...categoria },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    router.push(`/configuracion/categorias/edit/${categoria.id}`);
  };

  return (
    <div className="mx-auto py-4 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Visualizar datos Categoría</CardTitle>
          <CardDescription>
            Visualizar todos los datos de la categoría.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Categoría</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
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
                          value={field.value?.toString()}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select
                        disabled
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar sexo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={SexoEnum.MACHO}>Macho</SelectItem>
                          <SelectItem value={SexoEnum.HEMBRA}>
                            Hembra
                          </SelectItem>
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
                        disabled
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar edad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={EdadEnum.ADULTO}>
                            Adulto
                          </SelectItem>
                          <SelectItem value={EdadEnum.JOVEN}>Joven</SelectItem>
                          <SelectItem value={EdadEnum.RECIEN_NACIDO}>
                            Recien Nacido
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="cantidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value?.toString() ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Precios de Venta */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Precios de Venta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["precioVentaCabeza", "precioVentaKilo"].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof z.infer<typeof formSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {name === "precioVentaCabeza"
                              ? "Precio Venta por Cabeza (Gs.)"
                              : "Precio Venta por Kilo (Gs.)"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              value={field.value?.toString()}
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
                  ))}
                </div>
              </div>

              {/* Precios de Costo */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Precios de Costo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["precioCostoCabeza", "precioCostoKilo"].map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof z.infer<typeof formSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {name === "precioCostoCabeza"
                              ? "Precio Costo por Cabeza (Gs.)"
                              : "Precio Costo por Kilo (Gs.)"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              value={field.value?.toString()}
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
                  ))}

                  <FormField
                    control={form.control}
                    name="usuario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuario</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="updatedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha Modificación</FormLabel>
                        <FormControl>
                          <Input
                            value={field.value?.toLocaleString() ?? ""}
                            disabled
                            readOnly
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
                <Button
                  type="button"
                  className="flex-1"
                  onClick={() =>
                    router.push(
                      `/configuracion/categorias/edit/${categoria.id}`
                    )
                  }
                >
                  Modificar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setopenModal(true)} // ← aquí estaba el error
                >
                  Eliminar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Dialog para Eliminar */}
      <Dialog open={!!openModal} onOpenChange={() => setopenModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">
              Eliminar Categoria 🗑️
            </DialogTitle>

            <DialogDescription>
              <p className="mt-2">
                ¿Estás seguro de que deseas eliminar el registro de
                <span className="font-bold italic">
                  {" " + categoria.nombre + " "}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose>
              <Button variant="outline" onClick={() => setopenModal(false)}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
