import bcrypt from "bcryptjs";

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compareSync(password, hash);
}
