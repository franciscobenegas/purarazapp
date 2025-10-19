// src/app/diaria/nacimiento/page.tsx
import prisma from "@/libs/prisma";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { redirect } from "next/navigation";
import { HeaderNacimineto } from "./components/HeaderNacimineto";
import { ListNacimiento } from "./components/ListNacimiento";

export default async function NacimientoPage() {
  // ✅ Verificar usuario
  const user = getUserFromToken();

  // 🚫 Si no hay token o el token no es válido → redirigir
  if (!user) {
    redirect("/auth/login");
  }

  // ✅ Si hay usuario, continuar
  const listPropietario = await prisma.propietario.findMany({
    where: { establesimiento: user.establesimiento },
    orderBy: { createdAt: "desc" },
  });

  const listPotrero = await prisma.potrero.findMany({
    where: { establesimiento: user.establesimiento },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <HeaderNacimineto
        listPotrero={listPotrero}
        listPropietarios={listPropietario}
      />
      <ListNacimiento />
    </div>
  );
}
