import { prisma } from "@/lib/prisma";
import type { ChallengeStatus } from "@/lib/types";
export type { ChallengeStatus } from "@/lib/types";

export async function listChallenges(status?: ChallengeStatus) {
  const challenges = await prisma.challenge.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { teams: true } } },
  });
  return challenges.map(({ _count, ...challenge }) => ({
    ...challenge,
    participants: _count.teams,
  }));
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
      color: "blue",
      icon: "bulb",
      contactPhone: input.contactPhone || null,
    },
  });
}

export async function publishChallenge(id: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id } });
  if (!challenge) return null;
  return prisma.challenge.update({ where: { id }, data: { status: "published" } });
}
