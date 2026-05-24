import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import React from "react";
import { HeaderSalida } from "./components/HeaderSalida";
import { ListSalida } from "./components/ListSalida";

export default async function SalidaPage() {
  // ✅ Verificar usuario
  const user = getUserFromToken();

  // 🚫 Si no hay token o el token no es válido → redirigir
  if (!user) {
    redirect("/auth/login");
  }

  const listMotivoSalida = await prisma.motivoSalida.findMany({
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
      <HeaderSalida
        listCategorias={listCategorias}
        listMotivoSalida={listMotivoSalida}
        listPropietarios={listPropietario}
      />
      <ListSalida />
    </div>
  );
}
