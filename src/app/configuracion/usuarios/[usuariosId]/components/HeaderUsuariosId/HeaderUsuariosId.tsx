"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderUsuariosId() {
  const router = useRouter();
  return (
    <div className="flex items-center text-xl shadow-lg p-5 mb-5">
      <ArrowLeft
        className="w-5 h-5 cursor-pointer hover:text-primary transition-shadow hover:w-6 hover:h-6 hover:shadow-xl mr-2"
        onClick={() => router.push("/configuracion/usuarios")}
      />

      <p className="text-primary">Editar Usuario</p>
    </div>
  );
}
