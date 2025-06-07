"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../public/Logo_PURARAZA.png";
export function Logo() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="min-h-20 flex items-center px-6 border-b cursor-pointer gap-2 "
    >
      <Image
        src={logo}
        alt="Logo"
        width={60}
        height={60}
        className="dark:invert"
      />
      <h1 className="font-bold text-xl text-primary">Pura Raza S.A.</h1>
    </div>
  );
}
