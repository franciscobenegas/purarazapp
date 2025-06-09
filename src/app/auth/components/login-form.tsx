"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
//import { useRouter } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [credenciales, setCredenciales] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  //const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ← Desactiva el botón

    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credenciales),
      });

      if (!resp.ok) {
        //const data = await resp.json();
        //alert(data.message || "Error al iniciar sesión");

        toast.error("Usuario o Contraseña invalida!!!", {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        //router.push("/");
        window.location.href = "/";
      }
    } catch (error) {
      // alert("Error de red o del servidor!!!!");
      console.log(error);
    } finally {
      setLoading(false); // ← Vuelve a activar el botón
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicie sesión</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Ingrese su correo electrónico a continuación para iniciar sesión en su
          cuenta
        </p>
      </div>
      <div className="grid gap-6">
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
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <Input
            name="password"
            id="password"
            type="password"
            placeholder="*********"
            required
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Procesando..." : "Login"}
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
  );
}
