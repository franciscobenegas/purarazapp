"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useState, useMemo } from "react";

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  establesimiento: string;
};

// Tipo para la fortaleza de la contraseña
type PasswordStrength = {
  strength: number;
  label: string;
};

export function RegistroForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Obtener el valor del campo de contraseña
  const passwordValue = watch("password", "");

  // Función para calcular la fortaleza de la contraseña
  const calculatePasswordStrength = useMemo((): PasswordStrength => {
    if (!passwordValue) return { strength: 0, label: "" };

    let strength = 0;
    const reasons = [];

    // Longitud mínima
    if (passwordValue.length >= 8) strength += 20;
    else reasons.push("Mínimo 8 caracteres");

    // Letra mayúscula
    if (/[A-Z]/.test(passwordValue)) strength += 20;
    else reasons.push("Mayúscula");

    // Letra minúscula
    if (/[a-z]/.test(passwordValue)) strength += 20;
    else reasons.push("Minúscula");

    // Número
    if (/[0-9]/.test(passwordValue)) strength += 20;
    else reasons.push("Número");

    // Carácter especial
    if (/[!@#$%^&*]/.test(passwordValue)) strength += 20;
    else reasons.push("Carácter especial");

    // Determinar etiqueta según la fortaleza
    let label = "";
    if (strength >= 80) label = "Muy fuerte";
    else if (strength >= 60) label = "Fuerte";
    else if (strength >= 40) label = "Medio";
    else if (strength >= 20) label = "Débil";
    else label = "Muy débil";

    return { strength, label };
  }, [passwordValue]);

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

  // Función para validar fortaleza de contraseña
  const validatePassword = (password: string) => {
    // Mínimo 8 caracteres
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }

    // Al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }

    // Al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula";
    }

    // Al menos un número
    if (!/[0-9]/.test(password)) {
      return "La contraseña debe contener al menos un número";
    }

    // Al menos un carácter especial (!@#$%^&*)
    if (!/[!@#$%^&*]/.test(password)) {
      return "La contraseña debe contener al menos un carácter especial (!@#$%^&*)";
    }

    return true;
  };

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
      <form onSubmit={onSubmit} className="flex flex-col min-h-screen sm:pt-0">
        <h1 className="text-2xl font-bold mb-2">Nueva cuenta | PuraRazapp</h1>
        <ToastContainer />
        <div className="flex flex-col">
          <label htmlFor="username">Nombre Usuario</label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-2 dark:text-slate-800"
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
            <p className="text-red-600 -mt-2 mb-3 text-xs">
              {errors.username.message}
            </p>
          )}

          <label htmlFor="email">Correo Electronico</label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-2 dark:text-slate-800"
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
            <p className="text-red-600 -mt-2 mb-3 text-xs">
              {errors.email.message}
            </p>
          )}

          <label htmlFor="Establecimiento Ganadero">
            Nombre Establecimiento
          </label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-2 dark:text-slate-800"
            type="establesimiento"
            {...register("establesimiento", {
              required: {
                value: true,
                message: "Nombre establecimiento requerido...",
              },
            })}
            placeholder="establecimiento_ganadero"
          />

          {errors.establesimiento && (
            <p className="text-red-600 -mt-2 mb-3 text-xs">
              {errors.establesimiento.message}
            </p>
          )}

          <label htmlFor="password">Contraseña</label>
          <div className="relative">
            <input
              className="px-5 py-2 border bg-gray-200 rounded mb-2 dark:text-slate-800 w-full"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: {
                  value: true,
                  message: "Contraseña requerida...",
                },
                validate: validatePassword,
              })}
              placeholder="**********"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Barra de fortaleza de contraseña */}
          {passwordValue && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Fortaleza:</span>
                <span
                  className={
                    calculatePasswordStrength.strength >= 80
                      ? "text-green-600 font-medium"
                      : calculatePasswordStrength.strength >= 60
                      ? "text-yellow-600 font-medium"
                      : calculatePasswordStrength.strength >= 40
                      ? "text-orange-500 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {calculatePasswordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    calculatePasswordStrength.strength >= 80
                      ? "bg-green-500"
                      : calculatePasswordStrength.strength >= 60
                      ? "bg-yellow-500"
                      : calculatePasswordStrength.strength >= 40
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${calculatePasswordStrength.strength}%` }}
                />
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-red-600 -mt-1 mb-3 text-xs">
              {errors.password.message}
            </p>
          )}

          <label htmlFor="confirmPassword">Repetir Contraseña</label>
          <div className="relative">
            <input
              className="px-5 py-2 border bg-gray-200 rounded mb-5 dark:text-slate-800 w-full"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Confirmación requerida...",
                },
                validate: (val: string) => {
                  if (watch("password") != val) {
                    return "No coinciden las contraseñas.";
                  }
                },
              })}
              placeholder="**********"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 -mt-5 mb-3 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}

          {/* Indicador de requisitos de contraseña */}
          <div className="mb-5">
            <p className="text-sm font-medium mb-1">
              Requisitos de contraseña:
            </p>
            <ul className="text-xs text-gray-600 list-disc pl-5">
              <li
                className={
                  passwordValue?.length >= 8 ? "text-green-600 font-bold" : ""
                }
              >
                Mínimo 8 caracteres
              </li>
              <li
                className={
                  /[A-Z]/.test(passwordValue || "")
                    ? "text-green-600 font-bold"
                    : ""
                }
              >
                Al menos una letra mayúscula
              </li>
              <li
                className={
                  /[a-z]/.test(passwordValue || "")
                    ? "text-green-600 font-bold"
                    : ""
                }
              >
                Al menos una letra minúscula
              </li>
              <li
                className={
                  /[0-9]/.test(passwordValue || "")
                    ? "text-green-600 font-bold"
                    : ""
                }
              >
                Al menos un número
              </li>
              <li
                className={
                  /[!@#$%^&*]/.test(passwordValue || "")
                    ? "text-green-600 font-bold"
                    : ""
                }
              >
                Al menos un carácter especial (!@#$%^&*)
              </li>
            </ul>
          </div>

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
