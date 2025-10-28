import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderEntrada } from "./components/HeaderEntrada";
import { ListEntrada } from "./components/ListEntrada";

export default async function EntradaPage() {
  // ✅ Verificar usuario
  const user = getUserFromToken();

  // 🚫 Si no hay token o el token no es válido → redirigir
  if (!user) {
    redirect("/auth/login");
  }

  const listMotivoEntrada = await prisma.motivoEntrada.findMany({
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

  return (
    <div>
      <HeaderEntrada
        listCategorias={listCategorias}
        listMotivoEntrada={listMotivoEntrada}
        listPropietarios={listPropietario}
      />
      <ListEntrada />
    </div>
  );
}
