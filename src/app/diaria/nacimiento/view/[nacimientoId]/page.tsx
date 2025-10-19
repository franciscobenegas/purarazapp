import prisma from '@/libs/prisma';
import { getUserFromToken } from '@/utils/getUserFromToken';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function ViewNaciminetPageId({
  params,
}: {
  params: { nacimientoId: string };
}) {
   const user = getUserFromToken();
    if (!user) {
      return redirect("/auth/login");
    }

    const nacimineto = await prisma.nacimiento.findUnique({
      where: { id: params.nacimientoId },
      include: {
        propietario: true,
        potrero: true,
      },
    });

      if (!nacimineto) {
        return redirect("/");
      }

  return <div>Nacimiento</div>;
}
