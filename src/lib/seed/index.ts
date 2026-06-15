import { seedTipoRaza } from "./seedTipoRaza";
import { seedCausaMortandad } from "./seedCausaMortandad";
import { seedCategoria } from "./seedCategoria";
import { seedMotivoEntrada } from "./seedMotivoEntrada";
import { seedMotivoSalida } from "./seedMotivoSalida";
import { seedPotrero } from "./seedPotrero";

export async function runAllSeeds(establesimiento: string, usuario: string) {
  await seedTipoRaza(establesimiento, usuario);
  await seedCausaMortandad(establesimiento, usuario);
  await seedCategoria(establesimiento, usuario);
  await seedMotivoEntrada(establesimiento, usuario);
  await seedMotivoSalida(establesimiento, usuario);
  await seedPotrero(establesimiento, usuario);
}
