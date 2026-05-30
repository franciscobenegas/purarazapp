import React from "react";
import { HeaderMovimientos } from "./components/";
import { getUserFromToken } from "@/utils/getUserFromToken";
import prisma from "@/libs/prisma";
import { redirect } from "next/navigation";
import { ListMovimientos } from "./components";

export default async function MovimientoPage() {
  const user = getUserFromToken();

  if (!user) {
    redirect("/auth/login");
  }

  const listCategoria = await prisma.categoria.findMany({
    where: {
      establesimiento: user.establesimiento,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <HeaderMovimientos listCategoria={listCategoria} />
      <ListMovimientos />
    </div>
  );
}
