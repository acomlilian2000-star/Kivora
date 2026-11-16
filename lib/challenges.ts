import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type ChallengeStatus = "pending" | "published";

export type ChallengeRecord = {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  difficulty: string;
  duration: string;
  participants: number;
  color: string;
  icon: "leaf" | "water" | "bulb";
  status: ChallengeStatus;
  createdAt: string;
};

const dataFile = path.join(process.cwd(), "data", "challenges.json");
let writeQueue = Promise.resolve();

export async function listChallenges(status?: ChallengeStatus) {
  const contents = await readFile(dataFile, "utf8");
  const challenges = JSON.parse(contents) as ChallengeRecord[];
  return status ? challenges.filter((challenge) => challenge.status === status) : challenges;
}

export async function createChallenge(input: Omit<ChallengeRecord, "id" | "createdAt" | "status" | "participants">) {
  const challenges = await listChallenges();
  const challenge: ChallengeRecord = {
    ...input,
    id: randomUUID(),
    participants: 0,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await saveChallenges([challenge, ...challenges]);
  return challenge;
}

export async function publishChallenge(id: string) {
  const challenges = await listChallenges();
  const index = challenges.findIndex((challenge) => challenge.id === id);
  if (index === -1) return null;
  challenges[index] = { ...challenges[index], status: "published" };
  await saveChallenges(challenges);
  return challenges[index];
}

async function saveChallenges(challenges: ChallengeRecord[]) {
  const write = writeQueue.then(() => writeFile(dataFile, `${JSON.stringify(challenges, null, 2)}\n`, "utf8"));
  writeQueue = write.catch(() => undefined);
  await write;
}
