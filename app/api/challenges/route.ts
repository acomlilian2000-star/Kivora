import { NextResponse } from "next/server";
import { createChallenge, listChallenges, type ChallengeStatus } from "@/lib/challenges";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const status = new URL(request.url).searchParams.get("status");
    if (status && status !== "pending" && status !== "published") {
      return NextResponse.json({ error: "Status must be pending or published." }, { status: 400 });
    }
    return NextResponse.json({ challenges: await listChallenges(status as ChallengeStatus | undefined) });
  } catch (error) {
    console.error("Could not read challenges:", error);
    return NextResponse.json({ error: "Could not load challenges." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isChallengeInput(body)) {
      return NextResponse.json({ error: "Add a title, topic, location, and description (at least 15 characters)." }, { status: 400 });
    }
    const challenge = await createChallenge({
      title: body.title.trim(),
      category: body.category.trim(),
      location: body.location.trim(),
      description: body.description.trim(),
      difficulty: "Beginner",
      duration: "2–3 weeks",
      color: "mint",
      icon: "leaf",
    });
    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error) {
    console.error("Could not create challenge:", error);
    return NextResponse.json({ error: "Could not submit your challenge." }, { status: 500 });
  }
}

function isChallengeInput(value: unknown): value is Record<"title" | "category" | "location" | "description", string> {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  return ["title", "category", "location", "description"].every((key) => typeof input[key] === "string" && input[key].trim().length > 0) &&
    (input.description as string).trim().length >= 15;
}
