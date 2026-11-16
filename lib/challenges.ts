import seedChallenges from "@/data/challenges.json";
import { prisma } from "@/lib/prisma";
import type { ChallengeStatus } from "@/lib/types";
export type { ChallengeStatus } from "@/lib/types";

export async function listChallenges(status?: ChallengeStatus) {
  const count = await prisma.challenge.count();
  if (count === 0) {
    await prisma.challenge.createMany({
      data: seedChallenges.map(({ createdAt, ...challenge }) => ({
        ...challenge,
        createdAt: new Date(createdAt),
      })),
    });
  }
  return prisma.challenge.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function createChallenge(input: {
  title: string;
  category: string;
  location: string;
  description: string;
  contactPhone?: string;
}) {
  return prisma.challenge.create({
    data: {
      ...input,
      contactPhone: input.contactPhone || null,
    },
  });
}

export async function publishChallenge(id: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id } });
  if (!challenge) return null;
  return prisma.challenge.update({ where: { id }, data: { status: "published" } });
}
