import { seedTipoRaza } from "./seedTipoRaza";
import { seedCausaMortandad } from "./seedCausaMortandad";

export async function runAllSeeds(establesimiento: string, usuario: string) {
  await seedTipoRaza(establesimiento, usuario);
  await seedCausaMortandad(establesimiento, usuario);
  // puedes agregar más aquí en el futuro
}
