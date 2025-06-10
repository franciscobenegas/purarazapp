import { TractorIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/Logo_PURARAZA.png";
import { LoginForm } from "../components/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <TractorIcon className="size-8" />
            </div>
            Pura Raza S.A.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
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
        {/* Texto de versión */}
        <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
          V 1.0.2506
        </div>
      </div>
    </div>
  );
}
