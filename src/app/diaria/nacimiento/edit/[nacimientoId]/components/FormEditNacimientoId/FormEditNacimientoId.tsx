"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Potrero, Prisma, Propietario } from "@prisma/client";
import { CalendarDays, Hash, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type NacimientoWithRelations = Prisma.NacimientoGetPayload<{
  include: {
    propietario: true;
    potrero: true;
  };
}>;

interface NacimientoProps {
  nacimiento: NacimientoWithRelations;
  listPropietario?: Propietario[];
  listPotrero: Potrero[];
}

const Sexo = {
  MACHO: "Macho",
  HEMBRA: "Hembra",
} as const;

const Pelaje = {
  NEGRO: "Negro",
  COLORADO: "Colorado",
  BLANCO: "Blanco",
  BAYO: "Bayo",
  BARCINO: "Barcino",
  OVERO: "Overo",
  HOSCO: "Hosco",
  PAMPA: "Pampa",
  NINGUNO: "Ninguno",
} as const;

const NacimientoSchema = z.object({
  fecha: z
    .string()
    .min(1, "La fecha es obligatoria.")
    .refine((v) => !Number.isNaN(Date.parse(v)), { message: "Fecha inválida." })
    .refine((v) => new Date(v).getTime() <= new Date().getTime(), {
      message: "La fecha no puede ser futura.",
    }),

  numeroVaca: z
    .string()
    .min(1, "El número de animal (caravana) es obligatorio.")
    .regex(/^[A-Za-z0-9-]{3,20}$/, {
      message:
        "Formato de caravana inválido. Usa 3-20 caracteres (letras, números o guiones).",
    })
    .transform((s) => s.trim().toUpperCase()),

  numeroTernero: z
    .string()
    .min(1, "El número de animal (caravana) es obligatorio.")
    .regex(/^[A-Za-z0-9-]{3,20}$/, {
      message:
        "Formato de caravana inválido. Usa 3-20 caracteres (letras, números o guiones).",
    })
    .transform((s) => s.trim().toUpperCase()),

  propietarioId: z.string().min(1, "El propietario es obligatorio."),
  potreroId: z.string().min(1, "El potrero es obligatorio."),

  sexo: z.enum([Sexo.MACHO, Sexo.HEMBRA], {
    required_error: "Debe seleccionar un sexo",
  }),

  peso: z.number().min(1, "El promedio de kilos debe ser mayor a 0"),
  pelaje: z.enum(
    [
      Pelaje.BARCINO,
      Pelaje.BAYO,
      Pelaje.BLANCO,
      Pelaje.COLORADO,
      Pelaje.HOSCO,
      Pelaje.NEGRO,
      Pelaje.OVERO,
      Pelaje.PAMPA,
    ],
    {
      required_error: "Debe seleccionar un pelaje",
    }
  ),
});

export default function FormEditNacimientoId(props: NacimientoProps) {
  const { nacimiento, listPotrero, listPropietario } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof NacimientoSchema>>({
    resolver: zodResolver(NacimientoSchema),
    defaultValues: {
      fecha: nacimiento.fecha
        ? new Date(nacimiento.fecha).toISOString().split("T")[0]
        : "",
      numeroVaca: nacimiento.numeroVaca ?? "", // Convierte null a string vacío
      numeroTernero: nacimiento.numeroTernero ?? "", // Convierte null a string vacío
      propietarioId: nacimiento.propietarioId,
      potreroId: nacimiento.potreroId,
      sexo: nacimiento.sexo,
      peso: nacimiento.peso ?? 0,
      pelaje: nacimiento.pelaje,
    },
  });

  const onSubmit = async (values: z.infer<typeof NacimientoSchema>) => {
    try {
      setLoading(true); // Desactivar el botón

      const resp = await fetch(`/api/nacimiento/${nacimiento.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (resp.ok) {
        toast.success("Exito!!! 😃 ", {
          description: "Los datos fueron modificados correctamente.",
        });

        router.push("/diaria/nacimiento");
        router.refresh();
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
    <div className="min-h-screen bg-gradient-to-br p-2 md:p-2 ">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Modificar Nacimiento </CardTitle>
            <CardDescription>
              Ajuste el formulario para modificar el registo del nacimiento en el
              establesimiento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" /> Fecha
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propietarioId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Propietario</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger aria-label="Propietario">
                              <SelectValue placeholder="Selecciona propietario" />
                            </SelectTrigger>
                            <SelectContent>
                              {listPropietario?.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.nombre}
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
                    name="numeroVaca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Caravana (MADRE)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: AR-123456" {...field} />
                        </FormControl>
                        <FormDescription>
                          {"Se convierte a MAYÚSCULAS automáticamente."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numeroTernero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Caravana (TERNERO)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: AR-123456" {...field} />
                        </FormControl>
                        <FormDescription>
                          {"Se convierte a MAYÚSCULAS automáticamente."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="potreroId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potrero</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger aria-label="Potrero">
                              <SelectValue placeholder="Selecciona potrero" />
                            </SelectTrigger>
                            <SelectContent>
                              {listPotrero.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sexo y Edad */}

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
                    name="peso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso del Ternero (Kg.)</FormLabel>
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
                  {/* </div> */}

                  <FormField
                    control={form.control}
                    name="pelaje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pelaje</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar pelaje" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={Pelaje.BARCINO}>
                              {Pelaje.BARCINO}
                            </SelectItem>
                            <SelectItem value={Pelaje.BAYO}>
                              {Pelaje.BAYO}
                            </SelectItem>
                            <SelectItem value={Pelaje.BLANCO}>
                              {Pelaje.BLANCO}
                            </SelectItem>
                            <SelectItem value={Pelaje.COLORADO}>
                              {Pelaje.COLORADO}
                            </SelectItem>
                            <SelectItem value={Pelaje.HOSCO}>
                              {Pelaje.HOSCO}
                            </SelectItem>
                            <SelectItem value={Pelaje.NEGRO}>
                              {Pelaje.NEGRO}
                            </SelectItem>
                            <SelectItem value={Pelaje.OVERO}>
                              {Pelaje.OVERO}
                            </SelectItem>
                            <SelectItem value={Pelaje.PAMPA}>
                              {Pelaje.PAMPA}
                            </SelectItem>
                            <SelectItem value={Pelaje.NINGUNO}>
                              {Pelaje.NINGUNO}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {loading ? "Creando..." : "Modoficar Nacimiento"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/diaria/nacimiento")}
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
    </div>
  );
}
