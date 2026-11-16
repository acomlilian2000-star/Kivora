import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      where: {
        status: "reviewed",
        sharedPublicly: true,
        assessment: { is: { publiclyApproved: true } },
      },
      select: {
        id: true,
        title: true,
        description: true,
        evidence: true,
        peopleHelped: true,
        materialsReused: true,
        problemsAddressed: true,
        createdAt: true,
        challenge: { select: { title: true, category: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return NextResponse.json({
      projects: submissions.map(({ evidence, ...submission }) => ({
        ...submission,
        evidence: parseEvidence(evidence),
      })),
    });
  } catch (error) {
    console.error("Could not load the innovation showcase:", error);
    return NextResponse.json({ error: "Could not load approved projects." }, { status: 500 });
  }
}

function parseEvidence(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && /^https?:\/\//i.test(item))
      : [];
  } catch {
    return [];
  }
}
