"use client"; // Habilita el rendering del lado del cliente en Next.js (para hooks como useState)

import { cn } from "@/lib/utils"; // Función para combinar clases CSS condicionalmente
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify"; // Librería para notificaciones
import { Eye, EyeOff } from "lucide-react"; // Iconos para mostrar/ocultar contraseña

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  // Estado para almacenar email y contraseña ingresados por el usuario
  const [credenciales, setCredenciales] = useState({
    email: "",
    password: "",
  });

  // Estado para controlar si se está procesando la solicitud (evita clicks múltiples)
  const [loading, setLoading] = useState(false);

  // Estado para mostrar u ocultar la contraseña en el input
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Manejador de cambios para los inputs de email y contraseña
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Desactiva el botón mientras se procesa

    try {
      // Envia solicitud POST al endpoint de login
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credenciales),
      });

      // Si la respuesta no es válida, muestra una notificación de error
      if (!resp.ok) {
        toast.error("Usuario o Contraseña invalida!!!", {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      } else {
        // Si es exitosa, redirige al usuario a la página principal
        window.location.href = "/";
      }
    } catch (error) {
      // Captura cualquier error de red o del servidor
      console.log(error);
    } finally {
      setLoading(false); // Reactiva el botón
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      {/* Encabezado del formulario */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicie sesión</h1>
        <p className="text-sm text-muted-foreground">
          Ingrese su correo electrónico a continuación para iniciar sesión en su
          cuenta
        </p>
      </div>

      {/* Campos del formulario */}
      <div className="grid gap-6">
        {/* Campo de correo electrónico */}
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

        {/* Campo de contraseña con ícono para mostrar/ocultar */}
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

          {/* Contenedor con ícono de ojo para mostrar/ocultar */}
          <div className="relative">
            <Input
              name="password"
              id="password"
              type={mostrarPassword ? "text" : "password"} // cambia el tipo según el estado
              placeholder="*********"
              required
              onChange={handleChange}
              className="pr-10" // espacio para el ícono
            />
            {/* Botón para alternar visibilidad */}
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

        {/* Botón de envío */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Procesando..." : "Login"}
        </Button>

        {/* Contenedor de notificaciones */}
        <ToastContainer />
      </div>

      {/* Enlace a la página de registro */}
      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/registro" className="underline underline-offset-4">
          Suscribirse
        </Link>
      </div>
    </form>
  );
}
