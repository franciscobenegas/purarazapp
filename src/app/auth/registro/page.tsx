import Link from "next/link";
import { RegistroForm } from "@/app/auth/components/registro-form";
import Image from "next/image";
import { TractorIcon } from "lucide-react";
import logo from "../../../public/Logo_PURARAZA.png";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function NewRegisterPage() {
  const token = cookies().get("tokenPuraRaza")?.value;
  if (token) {
    redirect("/dashboard");
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <TractorIcon className="size-10" />
            </div>
            Pura Raza S.A.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegistroForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src={logo}
          alt="logo_pura_Raza"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={1500}
          height={1500}
        />
      </div>
    </div>
  );
}
