import React from "react";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import prisma from "@/libs/prisma";

import InfoUsuarios from "./components/InfoUsuarios/InfoUsuarios";
import HeaderUsuariosId from "./components/HeaderUsuariosId/HeaderUsuariosId";

export default async function UsuariosIdPage({
  params,
}: {
  params: { usuariosId: string };
}) {
  const user = getUserFromToken();
  if (!user) {
    return redirect("/auth/login");
  }

  const usuarios = await prisma.usuario.findUnique({
    where: { id: params.usuariosId },
  });

  if (!usuarios) {
    return redirect("/");
  }

  return (
    <div>
      <HeaderUsuariosId />
      <InfoUsuarios Usuario={usuarios} />
    </div>
  );
}
