import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      where: { status: "submitted" },
      include: { team: true, challenge: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Could not load submissions:", error);
    return NextResponse.json({ error: "Could not load student submissions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Submission details are required." }, { status: 400 });
    const input = body as Record<string, unknown>;
    if (typeof input.teamId !== "string" || typeof input.title !== "string" || typeof input.description !== "string" ||
      input.title.trim().length < 3 || input.description.trim().length < 20) {
      return NextResponse.json({ error: "Add a project title and a solution description of at least 20 characters." }, { status: 400 });
    }
    const evidence = input.evidence === undefined ? [] : input.evidence;
    if (!Array.isArray(evidence) || evidence.length > 5 || !evidence.every((item) => typeof item === "string" && /^https?:\/\//i.test(item))) {
      return NextResponse.json({ error: "Evidence must be up to five web links." }, { status: 400 });
    }
    const team = await prisma.team.findUnique({ where: { id: input.teamId } });
    if (!team) return NextResponse.json({ error: "The project team could not be found." }, { status: 404 });
    const submission = await prisma.submission.create({
      data: {
        title: input.title.trim(),
        description: input.description.trim(),
        evidence: JSON.stringify(evidence),
        teamId: input.teamId,
        challengeId: team.challengeId,
      },
      include: { team: true, challenge: true },
    });
    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error("Could not create submission:", error);
    return NextResponse.json({ error: "Could not submit your project." }, { status: 500 });
  }
}
