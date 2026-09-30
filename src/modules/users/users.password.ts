import argon2 from "argon2";

const OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
} satisfies argon2.HashOptions;

const normalize = (password: string) => password.normalize("NFKC");

export const hashPassword = (password: string): Promise<string> =>
  argon2.hash(normalize(password), OPTIONS);

export const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  try {
    return await argon2.verify(stored, normalize(password));
  } catch (err) {
    return false;
  }
};

export const needsRehash = (stored: string): boolean =>
  argon2.needsRehash(stored, OPTIONS);
