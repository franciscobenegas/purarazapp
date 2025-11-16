"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export function HeaderEditEntradaId() {
  const router = useRouter();
     return (
       <div className="flex items-center text-xl shadow-lg p-5 mb-5">
         <ArrowLeft
           className="w-5 h-5 cursor-pointer hover:text-primary transition-shadow hover:w-6 hover:h-6 hover:shadow-xl mr-2"
           onClick={() => router.push("/diaria/entrada")}
         />

         <p className="text-primary">Listado Entradas</p>
       </div>
     );
}
