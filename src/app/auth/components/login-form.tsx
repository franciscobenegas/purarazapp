"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff, LoaderCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [credenciales, setCredenciales] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Estados para el modal de recuperación
  const [modalOpen, setModalOpen] = useState(false);
  const [emailRecuperar, setEmailRecuperar] = useState("");
  const [loadingRecuperar, setLoadingRecuperar] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciales),
      });

      if (!resp.ok) {
        if (resp.status === 403) {
          toast.error("Usuario INACTIVO. Comuníquese con el administrador.", {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });
        }
        if (resp.status === 401) {
          toast.error("Usuario o Contraseña invalido!!!.", {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });
        }
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingRecuperar(true);

    try {
      const resp = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailRecuperar }),
      });

      if (resp.ok) {
        setEnviado(true);
      } else {
        toast.error("Ocurrió un error. Intentá nuevamente.");
      }
    } catch {
      toast.error("Error de conexión.");
    } finally {
      setLoadingRecuperar(false);
    }
  };

  const handleAbrirModal = () => {
    setEnviado(false);
    setEmailRecuperar("");
    setModalOpen(true);
  };

  return (
    <>
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={handleSubmit}
      >
        {/* Encabezado */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Inicie sesión</h1>
          <p className="text-sm text-muted-foreground">
            Ingrese su correo electrónico a continuación para iniciar sesión en
            su cuenta
          </p>
        </div>

        <div className="grid gap-6">
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="usuario@correo.com"
              required
              onChange={handleChange}
            />
          </div>

          {/* Contraseña */}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
              <button
                type="button"
                onClick={handleAbrirModal}
                className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-foreground"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div className="relative">
              <Input
                name="password"
                id="password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="*********"
                required
                onChange={handleChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Mostrar u ocultar contraseña"
              >
                {mostrarPassword ? <EyeOff size={25} /> : <Eye size={25} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                Procesando
                <LoaderCircle className="animate-spin w-4 h-4" />
              </>
            ) : (
              "Login"
            )}
          </Button>

          <ToastContainer />
        </div>

        <div className="text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/registro" className="underline underline-offset-4">
            Suscribirse
          </Link>
        </div>
      </form>

      {/* Modal recuperar contraseña */}
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEnviado(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar contraseña</DialogTitle>
            <DialogDescription>
              Ingresá tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña.
            </DialogDescription>
          </DialogHeader>

          {enviado ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-medium">¡Correo enviado!</p>
              <p className="text-sm text-muted-foreground">
                Si el correo está registrado, recibirás un enlace para
                restablecer tu contraseña. Revisá tu bandeja de entrada.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setModalOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRecuperarPassword} className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="email-recuperar">Correo electrónico</Label>
                <Input
                  id="email-recuperar"
                  type="email"
                  placeholder="usuario@correo.com"
                  value={emailRecuperar}
                  onChange={(e) => setEmailRecuperar(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loadingRecuperar}
                className="w-full"
              >
                {loadingRecuperar ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar enlace"
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
