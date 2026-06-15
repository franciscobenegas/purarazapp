"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/Logo_PURARAZA.png";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState<"idle" | "success" | "error">("idle");
  const [mensaje, setMensaje] = useState("");

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <XCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Enlace inválido</h2>
        <p className="text-sm text-muted-foreground">
          El enlace de recuperación es inválido o ya fue utilizado.
        </p>
        <Button variant="outline" onClick={() => router.push("/auth/login")}>
          Volver al login
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmar) {
      setEstado("error");
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setEstado("error");
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setEstado("idle");

    try {
      const resp = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await resp.json();

      if (resp.ok) {
        setEstado("success");
        setMensaje(data.message);
        setTimeout(() => router.push("/auth/login"), 3000);
      } else {
        setEstado("error");
        setMensaje(data.message || "Ocurrió un error.");
      }
    } catch {
      setEstado("error");
      setMensaje("Error de conexión. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (estado === "success") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h2 className="text-xl font-semibold">¡Contraseña actualizada!</h2>
        <p className="text-sm text-muted-foreground">{mensaje}</p>
        <p className="text-xs text-muted-foreground">
          Serás redirigido al login en unos segundos...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Nueva contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Ingresá tu nueva contraseña para recuperar el acceso a tu cuenta.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="password">Nueva contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmar">Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="confirmar"
              type={mostrarConfirmar ? "text" : "password"}
              placeholder="Repetí la contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {estado === "error" && (
          <p className="text-sm text-destructive text-center">{mensaje}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar nueva contraseña"
          )}
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Volver al login
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense fallback={<LoaderCircle className="animate-spin" />}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src={logo}
          alt="Imagen_Ganado"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={2000}
          height={2000}
        />
        <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
          V 1.0.2506
        </div>
      </div>
    </div>
  );
}
