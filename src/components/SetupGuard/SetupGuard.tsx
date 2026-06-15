"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircle, Building2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import departamentos from "@/data/departamento.json";
import distritos from "@/data/distritos.json";
import localidades from "@/data/localidad.json";

type SetupState = "checking" | "estancia" | "propietario" | "done";

// ─── Paso 1: Estancia ────────────────────────────────────────────────────────

const estanciaSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  departamento: z.string().min(1, "Requerido"),
  distrito: z.string().min(1, "Requerido"),
  localidad: z.string().min(1, "Requerido"),
  telefono: z.string().min(1, "Requerido"),
  ruc: z.string().min(1, "Requerido"),
});

function EstanciaForm({ onSuccess }: { onSuccess: (id: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [distritosFiltrados, setDistritosFiltrados] = useState<
    typeof distritos
  >([]);
  const [localidadesFiltradas, setLocalidadesFiltradas] = useState<
    typeof localidades
  >([]);

  const form = useForm<z.infer<typeof estanciaSchema>>({
    resolver: zodResolver(estanciaSchema),
    defaultValues: {
      nombre: "",
      departamento: "",
      distrito: "",
      localidad: "",
      telefono: "",
      ruc: "",
    },
  });

  const watchDepartamento = form.watch("departamento");
  const watchDistrito = form.watch("distrito");

  useEffect(() => {
    if (watchDepartamento) {
      const filtrados = [...distritos]
        .filter((d) => d.Descripcion_de_Departamento === watchDepartamento)
        .sort((a, b) =>
          a.Descripcion_de_Distrito.localeCompare(b.Descripcion_de_Distrito)
        );
      setDistritosFiltrados(filtrados);
      form.setValue("distrito", "");
      form.setValue("localidad", "");
      setLocalidadesFiltradas([]);
    }
  }, [watchDepartamento, form]);

  useEffect(() => {
    if (watchDistrito && watchDepartamento) {
      const filtrados = [...localidades]
        .filter(
          (l) =>
            l.Descripcion_de_Departamento ===
              String(watchDepartamento).padStart(2, "0") &&
            l.Descripcion_de_Distrito ===
              String(watchDistrito).padStart(2, "0")
        )
        .sort((a, b) =>
          a.Descripcion_de_Barrio_Localidad.localeCompare(
            b.Descripcion_de_Barrio_Localidad
          )
        );
      setLocalidadesFiltradas(filtrados);
      form.setValue("localidad", "");
    }
  }, [watchDistrito, watchDepartamento, form]);

  const onSubmit = async (values: z.infer<typeof estanciaSchema>) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/estancia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!resp.ok) throw new Error("Error al guardar la estancia");
      const data = await resp.json();
      toast.success("Estancia registrada correctamente");
      onSuccess(data.id);
    } catch (e) {
      toast.error("Error al guardar", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Nombre de la estancia</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Estancia San Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
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
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
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
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
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
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="021-123 456" {...field} />
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
                <FormLabel>RUC</FormLabel>
                <FormControl>
                  <Input placeholder="Nro. de RUC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-2"
        >
          {loading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Siguiente →"
          )}
        </Button>
      </form>
    </Form>
  );
}

// ─── Paso 2: Propietario ─────────────────────────────────────────────────────

const propietarioSchema = z.object({
  nombre: z.string().min(4, "Mínimo 4 caracteres"),
  email: z
    .string()
    .min(1, "Requerido")
    .email("Correo electrónico inválido"),
  telefono: z.string().min(1, "Requerido"),
});

function PropietarioForm({
  estanciaId,
  onSuccess,
}: {
  estanciaId: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof propietarioSchema>>({
    resolver: zodResolver(propietarioSchema),
    defaultValues: { nombre: "", email: "", telefono: "" },
  });

  const onSubmit = async (values: z.infer<typeof propietarioSchema>) => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/estancia/${estanciaId}/propietario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!resp.ok) throw new Error("Error al guardar el propietario");
      toast.success("¡Configuración completada! Ya podés usar la aplicación.");
      onSuccess();
    } catch (e) {
      toast.error("Error al guardar", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del propietario</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="juan@correo.com" {...field} />
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
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="(0981) 123 456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Finalizar configuración"
          )}
        </Button>
      </form>
    </Form>
  );
}

// ─── SetupGuard principal ─────────────────────────────────────────────────────

export function SetupGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SetupState>("checking");
  const [estanciaId, setEstanciaId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/setup/status")
      .then((r) => (r.ok ? r.json() : { needsSetup: false }))
      .then((data) => {
        if (!data.needsSetup) {
          setState("done");
        } else if (data.estanciaId) {
          // Estancia ya existe pero falta propietario
          setEstanciaId(data.estanciaId);
          setState("propietario");
        } else {
          setState("estancia");
        }
      })
      .catch(() => setState("done"));
  }, []);

  const handleEstanciaSuccess = (id: string) => {
    setEstanciaId(id);
    setState("propietario");
  };

  const handlePropietarioSuccess = () => {
    setState("done");
    router.refresh();
  };

  return (
    <>
      {children}

      {state !== "done" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 max-h-[90vh] overflow-y-auto border">

            {/* Encabezado */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-primary">
                Configuración inicial requerida
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Para usar la aplicación debés registrar tu estancia y
                propietario. Este paso es obligatorio.
              </p>
            </div>

            {/* Indicador de pasos */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  state === "estancia"
                    ? "bg-primary text-primary-foreground"
                    : state === "propietario"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Building2 className="h-4 w-4" />
                Paso 1: Estancia
              </div>

              <div className="h-px flex-1 bg-border" />

              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  state === "propietario"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <UserRound className="h-4 w-4" />
                Paso 2: Propietario
              </div>
            </div>

            {/* Contenido según estado */}
            {state === "checking" && (
              <div className="flex items-center justify-center py-16">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {state === "estancia" && (
              <EstanciaForm onSuccess={handleEstanciaSuccess} />
            )}

            {state === "propietario" && estanciaId && (
              <PropietarioForm
                estanciaId={estanciaId}
                onSuccess={handlePropietarioSuccess}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
