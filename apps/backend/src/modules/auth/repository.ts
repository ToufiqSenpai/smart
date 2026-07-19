import { prisma } from "../../db/prisma.js";

export async function findByEmail(email: string) {
  return prisma.masyarakat.findUnique({
    where: { email },
    include: {
      warga: true,
      pengurusRt: true,
    },
  });
}

export async function findByUsername(username: string) {
  return prisma.masyarakat.findFirst({
    where: { username },
    include: {
      warga: true,
      pengurusRt: true,
    },
  });
}

