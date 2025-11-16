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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Categoria, MotivoEntrada, Prisma, Propietario } from "@prisma/client";
import { CalendarDays, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type EntradaWithRelations = Prisma.EntradaGetPayload<{
  include: {
    propietario: true;
    motivo: true;
    items: { include: { categoria: true } };
  };
}>;

interface PropsData {
  listPropietarios?: Propietario[];
  listMotivoEntrada: MotivoEntrada[];
  listCategorias: Categoria[];
  entrada: EntradaWithRelations;
}

type EntradaItemForm = { id: string; categoriaId: string; cantidad: number };

const EntradaItemSchema = z.object({
  categoriaId: z.string().min(1, "Categoría obligatoria."),
  cantidad: z.number().int().min(1, "Cantidad mínima 1."),
});

const EntradaSchema = z.object({
  fecha: z
    .string()
    .min(1, "Fecha obligatoria.")
    .refine((v) => !isNaN(Date.parse(v)), "Fecha inválida."),
  NombreEstanciaOrigen: z
    .string()
    .min(1, "Estancia origen obligatoria.")
    .trim(),
  propietarioId: z.string().min(1, "Propietario obligatorio."),
  motivoId: z.string().min(1, "Motivo obligatorio."),
});

export function FormEditEntradaId({
  listCategorias,
  listMotivoEntrada,
  listPropietarios,
  entrada,
}: PropsData) {


  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [items, setItems] = useState<EntradaItemForm[]>([
    { id: crypto.randomUUID(), categoriaId: "", cantidad: 0 },
  ]);

  const form = useForm<z.infer<typeof EntradaSchema>>({
    resolver: zodResolver(EntradaSchema),
    defaultValues: {
      fecha: entrada.fecha
        ? new Date(entrada.fecha).toISOString().split("T")[0]
        : "",
      propietarioId: entrada.propietarioId,
      motivoId: entrada.motivoId,
      NombreEstanciaOrigen: entrada.NombreEstanciaOrigen || "",
    },
  });


useEffect(() => {
  if (entrada) {
    form.reset({
      fecha: entrada.fecha
        ? new Date(entrada.fecha).toISOString().slice(0, 10)
        : "",
      propietarioId: entrada.propietarioId,
      motivoId: entrada.motivoId,
      NombreEstanciaOrigen: entrada.NombreEstanciaOrigen?.trim() || "",
    });

    setItems(
      entrada.items.length
        ? entrada.items.map((i) => ({
            id: i.id,
            categoriaId: i.categoriaId,
            cantidad: i.cantidad,
          }))
        : [{ id: crypto.randomUUID(), categoriaId: "", cantidad: 0 }]
    );
  }
}, [entrada, form]);

  const addItem = () =>
    setItems([
      ...items,
      { id: crypto.randomUUID(), categoriaId: "", cantidad: 0 },
    ]);
  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter((item) => item.id !== id));
    else toast.error("Error", { description: "Debe haber al menos un ítem." });
  };
  const updateItem = (
    id: string,
    field: keyof EntradaItemForm,
    value: string | number
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const onSubmit = async (values: z.infer<typeof EntradaSchema>) => {
    const validItems = items
      .filter((i) => i.categoriaId && i.cantidad > 0)
      .map((i) => ({
        id: i.id,
        categoriaId: i.categoriaId,
        cantidad: i.cantidad,
      }));
    if (validItems.length === 0) {
      toast.error("Error", { description: "Agregue al menos un ítem válido." });
      return;
    }
    const parsedItems = EntradaItemSchema.array().safeParse(validItems);
    if (!parsedItems.success) {
      toast.error("Error", {
        description:
          parsedItems.error.issues[0]?.message || "Validación fallida.",
      });
      return;
    }
    const payload = { ...values, items: parsedItems.data };

    try {
      setLoading(true);
      const resp = await fetch(`/api/entrada/${entrada.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        toast.success("Éxito", { description: "Entrada actualizada." });
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

  const totalAnimales = items.reduce(
    (sum, item) => sum + (item.cantidad || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br p-2 md:p-2 ">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Editar Entrada</CardTitle>
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
                    name="NombreEstanciaOrigen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estancia Origen</FormLabel>
                        <FormControl>
                          <Input placeholder="Estancia Origen" {...field} />
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
                            {listMotivoEntrada?.map((m) => (
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
                </div>

                <Card className="border-accent/30">
                  <CardHeader className="bg-accent/5 flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Detalle de Animales
                      </CardTitle>
                    </div>
                    <Button
                      type="button"
                      onClick={addItem}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" /> Agregar
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 sm:grid-cols-[1fr_120px_60px] gap-4 p-2 border rounded"
                        >
                          <div className="space-y-1">
                            <Label
                              htmlFor={`categoria-${item.id}`}
                              className="text-xs"
                            >
                              Categoría
                            </Label>
                            <Select
                              value={item.categoriaId}
                              onValueChange={(v) =>
                                updateItem(item.id, "categoriaId", v)
                              }
                            >
                              <SelectTrigger id={`categoria-${item.id}`}>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {listCategorias?.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label
                              htmlFor={`cantidad-${item.id}`}
                              className="text-xs"
                            >
                              Cantidad
                            </Label>
                            <Input
                              id={`cantidad-${item.id}`}
                              type="number"
                              min="1"
                              value={item.cantidad || ""}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "cantidad",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end pt-2 border-t">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Total Animales
                          </p>
                          <p className="text-xl font-bold text-primary">
                            {totalAnimales}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar Entrada"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    //onClick={() => router.back()}
                    onClick={() => router.push("/diaria/entrada")}
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
