import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateProjectBrief } from "@/lib/ai/project-brief";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || typeof (body as { title?: unknown }).title !== "string" || typeof (body as { description?: unknown }).description !== "string") {
      return NextResponse.json({ error: "A challenge title and description are required." }, { status: 400 });
    }
    const { id, title, description, category, location, learnerLevel } = body as {
      id?: string;
      title: string;
      description: string;
      category?: string;
      location?: string;
      learnerLevel?: string;
    };
    if (!id) return NextResponse.json({ error: "Save and approve this challenge before generating its project brief." }, { status: 400 });
    const allowedLevels = ["Primary P1–P7", "Lower secondary S1–S4", "Advanced secondary S5–S6"];
    if (!learnerLevel || !allowedLevels.includes(learnerLevel)) {
      return NextResponse.json({ error: "Choose a Ugandan learner level before generating the project brief." }, { status: 400 });
    }
    const challenge = await prisma.challenge.findUnique({ where: { id } });
    if (!challenge || challenge.status !== "published") {
      return NextResponse.json({ error: "A teacher must approve this challenge before AI project generation." }, { status: 409 });
    }
    const brief = await generateProjectBrief({ title, description, category, location, learnerLevel });
    const savedBrief = await prisma.projectBrief.upsert({
      where: { challengeId: id },
      create: {
        challengeId: id,
        projectTitle: brief.projectTitle,
        learnerLevel,
        subjects: JSON.stringify(brief.subjects),
        competencies: JSON.stringify(brief.competencies),
        objectives: JSON.stringify(brief.objectives),
        activities: JSON.stringify(brief.activities),
        assessment: JSON.stringify(brief.assessment),
        safetyNote: brief.safetyNote,
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      },
      update: {
        projectTitle: brief.projectTitle,
        learnerLevel,
        subjects: JSON.stringify(brief.subjects),
        competencies: JSON.stringify(brief.competencies),
        objectives: JSON.stringify(brief.objectives),
        activities: JSON.stringify(brief.activities),
        assessment: JSON.stringify(brief.assessment),
        safetyNote: brief.safetyNote,
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        approved: false,
      },
    });
    return NextResponse.json({ brief, projectBriefId: savedBrief.id, approved: savedBrief.approved });
  } catch (error) {
    console.error("Impact Engine request failed:", error);
    const message = error instanceof Error ? error.message : "Could not generate a project brief. Please try again.";
    const status = message.startsWith("OpenAI is not configured") ? 503 : message.startsWith("OpenAI returned") || message.startsWith("OpenAI could not") ? 502 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
