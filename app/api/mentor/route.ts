import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authorization";
import { guideLearner, isMentorStage } from "@/lib/ai/mentor";

export const runtime = "nodejs";

const learnerLevels = ["Primary P1–P7", "Lower secondary S1–S4", "Advanced secondary S5–S6"];

export async function POST(request: Request) {
  const { user, response } = await requireUser(["student", "teacher"]);
  if (response || !user) return response;

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Add a problem for the mentor to help you explore." }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const problem = typeof input.problem === "string" ? input.problem.trim() : "";
    const studentIdea = typeof input.studentIdea === "string" ? input.studentIdea.trim() : "";
    const materials = typeof input.materials === "string" ? input.materials.trim() : "";
    if (problem.length < 10 || problem.length > 500 || studentIdea.length > 500 || materials.length > 300 ||
      typeof input.learnerLevel !== "string" || !learnerLevels.includes(input.learnerLevel) || !isMentorStage(input.stage)) {
      return NextResponse.json({ error: "Check the problem, learner level and mentor step, then try again." }, { status: 400 });
    }

    return NextResponse.json({
      guide: await guideLearner({
        problem,
        learnerLevel: input.learnerLevel,
        stage: input.stage,
        studentIdea,
        materials,
      }),
    });
  } catch (error) {
    console.error("KIVORA mentor request failed:", error);
    const message = error instanceof Error ? error.message : "The KIVORA mentor is temporarily unavailable.";
    const status = message.startsWith("OpenAI is not configured") ? 503 : message.startsWith("The KIVORA mentor returned") ? 502 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
