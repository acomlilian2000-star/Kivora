import { NextResponse } from "next/server";
import { publishChallenge } from "@/lib/challenges";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || (body as { status?: unknown }).status !== "published") {
      return NextResponse.json({ error: "Only teacher approval (status: published) is supported." }, { status: 400 });
    }
    const { id } = await context.params;
    const challenge = await publishChallenge(id);
    if (!challenge) return NextResponse.json({ error: "Challenge not found." }, { status: 404 });
    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Could not approve challenge:", error);
    return NextResponse.json({ error: "Could not approve this challenge." }, { status: 500 });
  }
}
