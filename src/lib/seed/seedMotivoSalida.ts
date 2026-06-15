import prisma from "@/libs/prisma";

export async function seedMotivoSalida(
  establesimiento: string,
  usuario: string
) {
  const count = await prisma.motivoSalida.count({
    where: { establesimiento },
  });
  if (count > 0) return;

  await prisma.motivoSalida.createMany({
    data: [
      { nombre: "Venta", establesimiento, usuario },
      { nombre: "Transferencia entre potreros", establesimiento, usuario },
      { nombre: "Donación", establesimiento, usuario },
      { nombre: "Envío a remate", establesimiento, usuario },
    ],
  });

  console.log("✅ MotivoSalida sembrado");
}
