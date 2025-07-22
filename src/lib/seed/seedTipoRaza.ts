import prisma from "@/libs/prisma";

export async function seedTipoRaza(establesimiento: string, usuario: string) {
  const count = await prisma.tipoRaza.count({ where: { establesimiento } });
  if (count > 0) return;

  await prisma.tipoRaza.createMany({
    data: [
      { nombre: "Mestizo", establesimiento, usuario },
      { nombre: "Nelore", establesimiento, usuario },
      { nombre: "Brangus", establesimiento, usuario },
      { nombre: "Braford", establesimiento, usuario },
      { nombre: "Brahman", establesimiento, usuario },
      { nombre: "Angus", establesimiento, usuario },
      { nombre: "Hereford", establesimiento, usuario },
      { nombre: "Senepol", establesimiento, usuario },
      { nombre: "Santa Gertrudis", establesimiento, usuario },
    ],
  });

  console.log("✅ TipoRaza sembrado");
}
