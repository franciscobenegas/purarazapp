import prisma from "@/libs/prisma";

export async function seedCausaMortandad(
  establesimiento: string,
  usuario: string
) {
  const count = await prisma.causaMortandad.count({
    where: { establesimiento },
  });
  if (count > 0) return;

  await prisma.causaMortandad.createMany({
    data: [
      {
        nombre: "Enfermedad - Aftosa (en brotes, no actual)",
        establesimiento,
        usuario,
      },
      { nombre: "Picadura de vibora", establesimiento, usuario },
      {
        nombre: "Bacteriana - Clostridiosis (Carbunco sintomático)",
        establesimiento,
        usuario,
      },
      {
        nombre: "Parasitarias - Parásitos externos (garrapatas)",
        establesimiento,
        usuario,
      },
      {
        nombre:
          "Hemoparasitaria - Tristeza bovina (piroplasmosis + anaplasmosis)",
        establesimiento,
        usuario,
      },
      {
        nombre: "Digestiva/infecciosa - Diarreas neonatales",
        establesimiento,
        usuario,
      },
      { nombre: "Respiratoria - Neumonía bovina", establesimiento, usuario },
      { nombre: "Nutricional - Desnutrición", establesimiento, usuario },
      {
        nombre: "Traumáticas - Golpes, accidentes, ahogamientos",
        establesimiento,
        usuario,
      },
    ],
  });

  console.log("✅ Causa Mortandad sembrado");
}
