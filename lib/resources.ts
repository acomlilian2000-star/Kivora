import { prisma } from "@/lib/prisma";

export async function retrieveResources(query: string) {
  const resources = await prisma.resource.findMany();
  const terms = query.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 3);
  return resources
    .map((resource) => {
      const text = `${resource.title} ${resource.subject} ${resource.summary}`.toLowerCase();
      return { resource, score: terms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0) };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map(({ resource }) => resource);
}
