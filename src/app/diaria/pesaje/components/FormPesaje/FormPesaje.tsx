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
import { Categoria, MotivoPesaje, Potrero, Propietario } from "@prisma/client";
import { CalendarDays, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface PropsData {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  listPropietarios?: Propietario[];
  listMotivoPesaje: MotivoPesaje[];
  listCategorias: Categoria[];
  listPotreros: Potrero[];
}

const PesajeSchema = z.object({
  fecha: z
    .string()
    .min(1, "La fecha es obligatoria.")
    .refine((v) => !Number.isNaN(Date.parse(v)), { message: "Fecha inválida." })
    .refine((v) => new Date(v).getTime() <= new Date().getTime(), {
      message: "La fecha no puede ser futura.",
    }),
  numeroAnimal: z
    .string()
    .min(1, "El número de animal (caravana) es obligatorio.")
    .trim(),
  peso: z
    .number()
    .positive("El peso debe ser mayor a 0")
    .refine((v) => v > 0, "El peso es obligatorio."),
  propietarioId: z.string().min(1, "El propietario es obligatorio."),
  categoriaId: z.string().optional(),
  motivoId: z.string().min(1, "El motivo de pesaje es obligatorio."),
  potreroId: z.string().optional(),
  observacion: z.string().optional(),
});

export function FormPesaje(props: PropsData) {
  const { listCategorias, listMotivoPesaje, listPropietarios, listPotreros, setOpenModal } =
    props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const form = useForm<z.infer<typeof PesajeSchema>>({
    resolver: zodResolver(PesajeSchema),
    defaultValues: {
      fecha: hoy,
      propietarioId: "",
      motivoId: "",
      numeroAnimal: "",
      peso: 0,
      categoriaId: "",
      potreroId: "",
      observacion: "",
    },
  });

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

      const resp = await fetch("/api/pesaje", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        toast.success("Éxito", {
          description: "El pesaje fue registrado correctamente.",
        });
        router.refresh();
        setOpenModal(false);
      } else {
        const errorData = await resp.json().catch(() => ({}));
        toast.error("Error", {
          description: errorData.message || "No se pudo crear el pesaje.",
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error en FormPesaje:", message);
      toast.error("Error", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Pesaje</CardTitle>
          <CardDescription>
            Complete el formulario para registrar el pesaje de un animal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger aria-label="Propietario">
                            <SelectValue placeholder="Selecciona propietario" />
                          </SelectTrigger>
                          <SelectContent>
                            {listPropietarios?.map((p) => (
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
                  name="motivoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo Pesaje</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger aria-label="Motivo Pesaje">
                            <SelectValue placeholder="Selecciona Motivo" />
                          </SelectTrigger>
                          <SelectContent>
                            {listMotivoPesaje?.map((p) => (
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
                  name="categoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría (Opcional)</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value || undefined)}
                        >
                          <SelectTrigger aria-label="Categoría">
                            <SelectValue placeholder="Selecciona categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {listCategorias?.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.nombre}
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
                  name="potreroId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potrero (Opcional)</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value || undefined)}
                        >
                          <SelectTrigger aria-label="Potrero">
                            <SelectValue placeholder="Selecciona potrero" />
                          </SelectTrigger>
                          <SelectContent>
                            {listPotreros?.map((p) => (
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

              {/* Botones */}
              <div className="flex gap-4 pt-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Registrando..." : "Registrar Pesaje"}
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
