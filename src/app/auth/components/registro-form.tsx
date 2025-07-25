"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Bounce, ToastContainer, toast } from "react-toastify";

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  establesimiento: string;
};

export function RegistroForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const router = useRouter();

  const slugify = (text: string) =>
    text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quita acentos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // elimina caracteres especiales
      .replace(/\s+/g, "_") // reemplaza espacios por guiones
      .replace(/-+/g, "-"); // evita múltiples guiones

  const onSubmit = handleSubmit(async (data) => {
    const resp = await fetch("/api/auth/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        establesimiento: slugify(data.establesimiento),
      }),
    });

    const respJSON = await resp.json();

    if (resp.ok) {
      router.push("/auth/login");
    } else {
      toast.error(respJSON.message, {
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
    }
  });

  return (
    <div className=" ">
      <form onSubmit={onSubmit} className="flex flex-col min-h-screen sm:pt-5">
        <h1 className="text-2xl font-bold mb-5">Nueva cuenta | PuraRazapp</h1>
        <ToastContainer />
        <div className="flex flex-col">
          <label htmlFor="username">Nombre Usuario</label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5 dark:text-slate-800"
            type="text"
            {...register("username", {
              required: {
                value: true,
                message: "Nombre de Usuario requerido...",
              },
            })}
            placeholder="Usuario123"
          />
          {errors.username && (
            <p className="text-red-600 -mt-5 mb-3 text-xs">
              {errors.username.message}
            </p>
          )}

          <label htmlFor="email">Correo Electronico</label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5 dark:text-slate-800"
            type="email"
            {...register("email", {
              required: {
                value: true,
                message: "Correo electronico requerido...",
              },
            })}
            placeholder="usuario@correo.com"
          />

          {errors.email && (
            <p className="text-red-600 -mt-5 mb-3 text-xs">
              {errors.email.message}
            </p>
          )}

          <label htmlFor="Establecimiento Ganadero">
            Nombre Establecimiento
          </label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5 dark:text-slate-800"
            type="establesimiento"
            {...register("establesimiento", {
              required: {
                value: true,
                message: "Nombre establecimiento requerido...",
              },
            })}
            placeholder="estblesimiento_ganadero"
          />

          <label htmlFor="password">Contraseña</label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5 dark:text-slate-800"
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Contraseña requerido...",
              },
              minLength: {
                value: 6,
                message: "Se requieren mas de 6 caracteres para la contraseña",
              },
            })}
            placeholder="**********"
          />
          {errors.password && (
            <p className="text-red-600 -mt-5 mb-3 text-xs">
              {errors.password.message}
            </p>
          )}

          <label htmlFor="confirmPassword">Repetir Contraseña</label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5 dark:text-slate-800"
            type="password"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Confirmacion requerido...",
              },
              minLength: {
                value: 6,
                message: "Se requieren mas de 6 caracteres para la contraseña",
              },
              validate: (val: string) => {
                if (watch("password") != val) {
                  return "No coinciden las contraseñas.";
                }
              },
            })}
            placeholder="**********"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 -mt-5 mb-3 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
          <Button disabled={isSubmitting} className="rounded-lg">
            {isSubmitting && (
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
            )}
            Crear cuenta
          </Button>

          {/* divisor line */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-500"></div>
            <div className="px-2 text-gray-800">O</div>
            <div className="flex-1 border-t border-gray-500"></div>
          </div>

          <Link
            href="/auth/login"
            className="btn-secondary text-center hover:text-sky-600 hover:underline"
          >
            Ir al login
          </Link>
        </div>
      </form>
    </div>
  );
}
