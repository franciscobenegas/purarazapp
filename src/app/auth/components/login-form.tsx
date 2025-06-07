"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [credenciales, setCredenciales] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleCahnge = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value, e.target.name);
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(credenciales);

    const resp = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credenciales),
    });

    console.log(resp);

    if (!resp?.ok) {
      alert(resp);
    } else {
      router.push("/");
      //router.refresh(); // ver si funciona sin el refresh
    }

    console.log(resp);
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
            onChange={handleCahnge}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Olvidaste tu contraseña?
            </a>
          </div>
          <Input
            name="password"
            id="password"
            type="password"
            placeholder="*********"
            required
            onChange={handleCahnge}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        No tengo una cuenta?{" "}
        <Link href="/auth/registro" className="underline underline-offset-4">
          Suscribirse
        </Link>
      </div>
    </form>
  );
}
