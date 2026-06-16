"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Camera,
  LoaderCircle,
  User,
  Mail,
  Building2,
  Phone,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Perfil = {
  id: string;
  username: string;
  email: string;
  establesimiento: string;
  rol: string;
  activo: boolean;
  foto: string | null;
  nombreCompleto: string | null;
  telefono: string | null;
  createdAt: string;
};

const perfilSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres"),
  nombreCompleto: z.string().optional(),
  telefono: z.string().optional(),
});

export default function PerfilPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const [loadingFoto, setLoadingFoto] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof perfilSchema>>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { username: "", nombreCompleto: "", telefono: "" },
  });

  useEffect(() => {
    fetch("/api/perfil")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return router.push("/auth/login");
        setPerfil(data);
        setFotoPreview(data.foto ?? null);
        form.reset({
          username: data.username ?? "",
          nombreCompleto: data.nombreCompleto ?? "",
          telefono: data.telefono ?? "",
        });
      })
      .finally(() => setLoadingPerfil(false));
  }, [form, router]);

  const onSubmit = async (values: z.infer<typeof perfilSchema>) => {
    setLoadingGuardar(true);
    try {
      const resp = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message ?? "Error al guardar");
      }
      toast.success("Perfil actualizado correctamente");
      router.refresh();
    } catch (e) {
      toast.error("Error al guardar", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setLoadingGuardar(false);
    }
  };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local
    const url = URL.createObjectURL(file);
    setFotoPreview(url);

    const formData = new FormData();
    formData.append("file", file);

    setLoadingFoto(true);
    try {
      const resp = await fetch("/api/perfil/foto", {
        method: "POST",
        body: formData,
      });
      if (!resp.ok) throw new Error("Error al subir la imagen");
      const data = await resp.json();
      setFotoPreview(data.foto);
      toast.success("Foto de perfil actualizada");
      router.refresh();
    } catch (e) {
      toast.error("Error al subir la foto", {
        description: e instanceof Error ? e.message : String(e),
      });
      setFotoPreview(perfil?.foto ?? null);
    } finally {
      setLoadingFoto(false);
    }
  };

  if (loadingPerfil) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!perfil) return null;

  const iniciales = perfil.username?.slice(0, 2).toUpperCase() ?? "??";
  const fechaRegistro = new Date(perfil.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Mi Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gestioná tu información personal y foto de perfil
        </p>
      </div>

      <Separator />

      {/* Card foto + datos fijos */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar con botón de cambio */}
          <div className="relative shrink-0">
            <Avatar className="h-28 w-28 ring-4 ring-primary/20">
              <AvatarImage src={fotoPreview ?? ""} alt={perfil.username} />
              <AvatarFallback className="text-2xl font-bold">
                {iniciales}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loadingFoto}
              className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground p-1.5 shadow-md hover:bg-primary/90 transition-colors"
              title="Cambiar foto"
            >
              {loadingFoto ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFotoChange}
            />
          </div>

          {/* Info fija */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <h2 className="text-xl font-semibold">{perfil.username}</h2>
              {perfil.nombreCompleto && (
                <p className="text-muted-foreground text-sm">{perfil.nombreCompleto}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge variant={perfil.activo ? "default" : "destructive"}>
                {perfil.activo ? "Activo" : "Inactivo"}
              </Badge>
              <Badge variant="outline">
                <ShieldCheck className="h-3 w-3 mr-1" />
                {perfil.rol === "ADMIN" ? "Administrador" : "Peón"}
              </Badge>
            </div>

            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{perfil.email}</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Building2 className="h-4 w-4 shrink-0" />
                <span>{perfil.establesimiento}</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>Miembro desde {fechaRegistro}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario editable */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Datos personales
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nombreCompleto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
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
                    <FormLabel className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="(0981) 123 456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email - solo lectura */}
              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Correo electrónico
                </label>
                <Input value={perfil.email} disabled className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground">El correo no se puede modificar</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loadingGuardar}>
                {loadingGuardar ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
