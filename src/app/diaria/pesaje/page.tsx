import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderPesaje } from "./components/HeaderPesaje";
import { ListPesaje } from "./components/ListPesaje";

export default async function PesajePage() {
  // ✅ Verificar usuario
  const user = getUserFromToken();

  // 🚫 Si no hay token o el token no es válido → redirigir
  if (!user) {
    redirect("/auth/login");
  }

  const listMotivoPesaje = await prisma.motivoPesaje.findMany({
    where: { establesimiento: user.establesimiento },
    orderBy: { createdAt: "desc" },
  });

  const listPropietario = await prisma.propietario.findMany({
    where: { establesimiento: user.establesimiento },
    orderBy: { createdAt: "desc" },
  });

  const listCategorias = await prisma.categoria.findMany({
    where: { establesimiento: user.establesimiento },
    orderBy: { createdAt: "desc" },
  });

  const listPotreros = await prisma.potrero.findMany({
    where: { establesimiento: user.establesimiento },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <HeaderPesaje
        listCategorias={listCategorias}
        listMotivoPesaje={listMotivoPesaje}
        listPropietarios={listPropietario}
        listPotreros={listPotreros}
      />
      <ListPesaje />
    </div>
  );
}
