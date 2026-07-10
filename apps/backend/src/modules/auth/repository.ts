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
