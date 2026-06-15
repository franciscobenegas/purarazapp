"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as DialogPrimitive from "@radix-ui/react-dialog";
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                  </FormControl>
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!distritosFiltrados.length}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!localidadesFiltradas.length}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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

        <Button type="submit" disabled={loading} className="w-full mt-2">
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
  email: z.string().min(1, "Requerido").email("Correo electrónico inválido"),
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

  const setupNeeded = state === "estancia" || state === "propietario";

  return (
    <>
      {children}

      {/* Spinner mientras se verifica — no muestra el formulario */}
      {state === "checking" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {/* Dialog solo se abre cuando confirmamos que se necesita setup */}
      <DialogPrimitive.Root open={setupNeeded}>
        <DialogPrimitive.Portal>
          {/* Overlay */}
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

          {/* Contenido del modal */}
          <DialogPrimitive.Content
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-2xl border bg-background p-8 shadow-2xl max-h-[90vh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          >
            {/* Título accesible (requerido por Radix) */}
            <DialogPrimitive.Title className="text-2xl font-bold text-primary">
              Configuración inicial requerida
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-muted-foreground text-sm mt-1 mb-6">
              Para usar la aplicación debés registrar tu estancia y propietario.
              Este paso es obligatorio.
            </DialogPrimitive.Description>

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

            {state === "estancia" && (
              <EstanciaForm onSuccess={handleEstanciaSuccess} />
            )}

            {state === "propietario" && estanciaId && (
              <PropietarioForm
                estanciaId={estanciaId}
                onSuccess={handlePropietarioSuccess}
              />
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
