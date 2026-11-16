import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { user, response } = await requireUser(["teacher", "admin"]);
  if (response || !user) return response;

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
  const { user, response } = await requireUser(["student"]);
  if (response || !user) return response;

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
    for (const field of ["peopleHelped", "materialsReused", "problemsAddressed"] as const) {
      if (input[field] !== undefined &&
        (!Number.isInteger(input[field]) || (input[field] as number) < 0 || (input[field] as number) > 10000)) {
        return NextResponse.json({ error: "Impact counts must be whole numbers between 0 and 10,000." }, { status: 400 });
      }
    }
    if (input.sharePublicly !== undefined && typeof input.sharePublicly !== "boolean") {
      return NextResponse.json({ error: "Showcase sharing must be true or false." }, { status: 400 });
    }
    const team = await prisma.team.findFirst({
      where: {
        id: input.teamId,
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } },
        ],
      },
    });
    if (!team) return NextResponse.json({ error: "The project team could not be found." }, { status: 404 });
    const submission = await prisma.submission.create({
      data: {
        title: input.title.trim(),
        description: input.description.trim(),
        evidence: JSON.stringify(evidence),
        peopleHelped: (input.peopleHelped as number | undefined) ?? 0,
        materialsReused: (input.materialsReused as number | undefined) ?? 0,
        problemsAddressed: (input.problemsAddressed as number | undefined) ?? 0,
        sharedPublicly: input.sharePublicly === true,
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
