import prisma from "@/libs/prisma";

export async function seedPotrero(establesimiento: string, usuario: string) {
  const count = await prisma.potrero.count({
    where: { establesimiento },
  });
  if (count > 0) return;

  await prisma.potrero.createMany({
    data: [
      { nombre: "Potrero 1", establesimiento, usuario },
      { nombre: "Potrero 2", establesimiento, usuario },
    ],
  });

  console.log("✅ Potrero sembrado");
}
