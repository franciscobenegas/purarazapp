"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Categoria, MotivoPesaje, Prisma, Potrero, Propietario } from "@prisma/client";
import { CalendarDays, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type PesajeWithRelations = Prisma.PesajeGetPayload<{
  include: {
    propietario: true;
    motivo: true;
    categoria: true;
    potrero: true;
  };
}>;

interface PropsData {
  listPropietarios?: Propietario[];
  listMotivoPesaje: MotivoPesaje[];
  listCategorias: Categoria[];
  listPotreros: Potrero[];
  pesaje: PesajeWithRelations;
}

const PesajeSchema = z.object({
  fecha: z
    .string()
    .min(1, "Fecha obligatoria.")
    .refine((v) => !isNaN(Date.parse(v)), "Fecha inválida."),
  numeroAnimal: z
    .string()
    .min(1, "Número de animal obligatorio.")
    .trim(),
  peso: z
    .number()
    .positive("El peso debe ser mayor a 0"),
  propietarioId: z.string().min(1, "Propietario obligatorio."),
  categoriaId: z.string().optional(),
  motivoId: z.string().min(1, "Motivo obligatorio."),
  potreroId: z.string().optional(),
  observacion: z.string().optional(),
});

export function FormEditPesajeId({
  listCategorias,
  listMotivoPesaje,
  listPropietarios,
  listPotreros,
  pesaje,
}: PropsData) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const form = useForm<z.infer<typeof PesajeSchema>>({
    resolver: zodResolver(PesajeSchema),
    defaultValues: {
      fecha: pesaje.fecha
        ? new Date(pesaje.fecha).toISOString().split("T")[0]
        : "",
      propietarioId: pesaje.propietarioId,
      motivoId: pesaje.motivoId,
      numeroAnimal: pesaje.numeroAnimal || "",
      peso: pesaje.peso || 0,
      categoriaId: pesaje.categoriaId || "",
      potreroId: pesaje.potreroId || "",
      observacion: pesaje.observacion || "",
    },
  });

  useEffect(() => {
    if (pesaje) {
      form.reset({
        fecha: pesaje.fecha
          ? new Date(pesaje.fecha).toISOString().slice(0, 10)
          : "",
        propietarioId: pesaje.propietarioId,
        motivoId: pesaje.motivoId,
        numeroAnimal: pesaje.numeroAnimal?.trim() || "",
        peso: pesaje.peso || 0,
        categoriaId: pesaje.categoriaId || "",
        potreroId: pesaje.potreroId || "",
        observacion: pesaje.observacion?.trim() || "",
      });
    }
  }, [pesaje, form]);

  const onSubmit = async (values: z.infer<typeof PesajeSchema>) => {
    const payload = {
      fecha: values.fecha,
      numeroAnimal: values.numeroAnimal,
      peso: values.peso,
      propietarioId: values.propietarioId,
      categoriaId: values.categoriaId || undefined,
      motivoId: values.motivoId,
      potreroId: values.potreroId || undefined,
      observacion: values.observacion || undefined,
    };

    try {
      setLoading(true);
      const resp = await fetch(`/api/pesaje/${pesaje.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        toast.success("Éxito", { description: "Pesaje actualizado." });
        router.refresh();
      } else {
        const errorData = await resp.json().catch(() => ({}));
        toast.error("Error", {
          description: errorData.message || "No se pudo actualizar.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: (error as Error).message || "Error desconocido.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-2 md:p-2 ">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Editar Pesaje</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                          <Input type="date" {...field} max={hoy} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numeroAnimal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Animal (Caravana)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="peso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ej: 450"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
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
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listPropietarios?.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motivoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listMotivoPesaje?.map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoriaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría (Opcional)</FormLabel>
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value || undefined)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listCategorias?.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="potreroId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potrero (Opcional)</FormLabel>
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value || undefined)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listPotreros?.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="observacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observación (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Agregue notas o observaciones del pesaje..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar Pesaje"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/diaria/pesaje")}
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
