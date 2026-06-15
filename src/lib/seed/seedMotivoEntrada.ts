import prisma from "@/libs/prisma";

export async function seedMotivoEntrada(
  establesimiento: string,
  usuario: string
) {
  const count = await prisma.motivoEntrada.count({
    where: { establesimiento },
  });
  if (count > 0) return;

  await prisma.motivoEntrada.createMany({
    data: [
      { nombre: "Compra", establesimiento, usuario },
      { nombre: "Transferencia entre potreros", establesimiento, usuario },
      { nombre: "Donación", establesimiento, usuario },
      { nombre: "Retorno de campo", establesimiento, usuario },
    ],
  });

  console.log("✅ MotivoEntrada sembrado");
}
