import { hash, verify, argon2id } from "argon2";

const ARGON2_OPTIONS = {
  type: argon2id,
  memoryCost: 65536, // 64 MiB
  timeCost: 3,
  parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, ARGON2_OPTIONS);
}

export async function verifyPassword(
  hashed: string,
  plain: string,
): Promise<boolean> {
  try {
    return await verify(hashed, plain, { type: argon2id });
  } catch {
    return false;
  }
}
