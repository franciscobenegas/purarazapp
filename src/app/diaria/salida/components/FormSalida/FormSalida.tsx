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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { Categoria, MotivoSalida, Propietario } from "@prisma/client";
import { CalendarDays, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface PropsData {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  listPropietarios?: Propietario[];
  listMotivoSalida: MotivoSalida[];
  listCategorias: Categoria[];
}

type SalidaItemForm = {
  id: string;
  categoriaId: string;
  cantidad: number;
};

const SalidaItemSchema = z.object({
  categoriaId: z.string().min(1, "La categoría es obligatoria."),
  cantidad: z.number().int().min(1, "La cantidad debe ser al menos 1."),
});

const SalidaSchema = z.object({
  fecha: z
    .string()
    .min(1, "La fecha es obligatoria.")
    .refine((v) => !Number.isNaN(Date.parse(v)), { message: "Fecha inválida." })
    .refine((v) => new Date(v).getTime() <= new Date().getTime(), {
      message: "La fecha no puede ser futura.",
    }),
  NombreEstanciaSalida: z
    .string()
    .min(1, "El nombre de la estancia de salida es obligatorio.")
    .trim(),
  propietarioId: z.string().min(1, "El propietario es obligatorio."),
  motivoId: z.string().min(1, "El motivo de salida es obligatorio."),
});

export function FormSalida(props: PropsData) {
  const { listCategorias, listMotivoSalida, listPropietarios, setOpenModal } =
    props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [items, setItems] = useState<SalidaItemForm[]>([
    { id: crypto.randomUUID(), categoriaId: "", cantidad: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), categoriaId: "", cantidad: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) {
      toast.error("Error!!!  ", {
        description: "Debe haber al menos un ítem en la salida",
      });

      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof SalidaItemForm,
    value: string | number
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof SalidaSchema>>({
    resolver: zodResolver(SalidaSchema),
    defaultValues: {
      fecha: hoy,
      propietarioId: "",
      motivoId: "",
      NombreEstanciaSalida: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SalidaSchema>) => {

    const validItems = items
      .filter((item) => item.categoriaId && item.cantidad > 0)
      .map((item) => ({
        categoriaId: item.categoriaId,
        cantidad: item.cantidad,
      }));

    if (validItems.length === 0) {
      toast.error("Error", {
        description: "Debe agregar al menos un ítem de Categoria válido.",
      });
      return;
    }

    // Validar con Zod los ítems
    const parsedItems = SalidaItemSchema.array().safeParse(validItems);
    if (!parsedItems.success) {
      const firstError = parsedItems.error.issues[0].message;
      toast.error("Error de validación", {
        description: firstError,
      });
      return;
    }

    const payload = {
      ...values,
      items: parsedItems.data,
    };

    console.log("Payload a enviar:", payload);

    try {
      setLoading(true);

      const resp = await fetch("/api/salida", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        toast.success("Éxito", {
          description: "La salida fue creada correctamente.",
        });
        router.refresh();
        setOpenModal(false);
      } else {
        const errorData = await resp.json().catch(() => ({}));
        toast.error("Error", {
          description: errorData || "No se pudo crear la salida.",
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error en FormSalida:", message);
      toast.error("Error", {
        description: message,
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
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Salida</CardTitle>
          <CardDescription>
            Complete el formulario para dar de alta nueva salida de animales del
            establesimiento.
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
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="NombreEstanciaSalida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Nombre Estancia Salida
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Estancia Destino" {...field} />
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
                      <FormLabel>Motivo Salida</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger aria-label="Motivo Salida">
                            <SelectValue placeholder="Selecciona Motivo" />
                          </SelectTrigger>
                          <SelectContent>
                            {listMotivoSalida?.map((p) => (
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
              <div>
                {/* Detail Section */}

                <Card className="border-accent/30">
                  <CardHeader className="bg-accent/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          Detalle de Animales
                        </CardTitle>
                        <CardDescription>
                          Agregue las categorías y cantidades de animales a
                          salir
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        onClick={addItem}
                        size="sm"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar Ítem
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Table Header */}
                      <div className="hidden sm:grid sm:grid-cols-[1fr_150px_80px] gap-4 pb-2 border-b border-border font-medium text-sm text-muted-foreground">
                        <div>Categoría (Disponible)</div>
                        <div>Cantidad</div>
                        <div></div>
                      </div>
                      {/* Table Rows */}

                      {items.map((item) => {
                        const selectedCategoria = listCategorias.find(
                          (c) => c.id === item.categoriaId
                        );
                        const disponible = selectedCategoria?.cantidad || 0;

                        return (
                          <div
                            key={item.id}
                            className="grid gap-4 sm:grid-cols-[1fr_150px_80px] items-start p-4 sm:p-0 border sm:border-0 rounded-lg sm:rounded-none"
                          >
                            <div className="space-y-2">
                              <Label
                                htmlFor={`categoria-${item.id}`}
                                className="sm:sr-only text-sm font-medium"
                              >
                                Categoría
                              </Label>
                              <Select
                                value={item.categoriaId}
                                onValueChange={(value) =>
                                  updateItem(item.id, "categoriaId", value)
                                }
                                required
                              >
                                <SelectTrigger id={`categoria-${item.id}`}>
                                  <SelectValue placeholder="Seleccione categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                  {listCategorias.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                      {cat.nombre} (Disponible:{" "}
                                      {cat.cantidad || 0})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {selectedCategoria && (
                                <p className="text-xs text-muted-foreground">
                                  Disponible: {disponible}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`cantidad-${item.id}`}
                                className="sm:sr-only text-sm font-medium"
                              >
                                Cantidad
                              </Label>
                              <Input
                                id={`cantidad-${item.id}`}
                                type="number"
                                min="1"
                                max={disponible}
                                value={item.cantidad || ""}
                                onChange={(e) => {
                                  const valor = Number.parseInt(
                                    e.target.value
                                  ) || 0;
                                  if (valor <= disponible) {
                                    updateItem(item.id, "cantidad", valor);
                                  } else {
                                    toast.error("Error", {
                                      description: `No hay suficiente cantidad. Disponible: ${disponible}`,
                                    });
                                  }
                                }}
                                placeholder="0"
                                required
                                className="w-full"
                              />
                            </div>

                            <div className="flex items-center justify-end sm:justify-start">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar ítem</span>
                              </Button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Summary */}
                      <div className="flex justify-end pt-4 border-t border-border">
                        <div className="text-right space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Total de Animales a Salir
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            {totalAnimales}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Botones */}
              <div className="flex gap-4 pt-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Creando..." : "Crear Salida"}
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
