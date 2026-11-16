import { NextResponse } from "next/server";
import { createChallenge, listChallenges, type ChallengeStatus } from "@/lib/challenges";
import { sendSms } from "@/lib/africastalking";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/authorization";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const canReview = session?.user?.role === "teacher" || session?.user?.role === "admin";
    const status = new URL(request.url).searchParams.get("status");
    if (status && status !== "pending" && status !== "published") {
      return NextResponse.json({ error: "Status must be pending or published." }, { status: 400 });
    }
    if (status === "pending" && !canReview) {
      return NextResponse.json({ error: "Only teachers can review pending challenges." }, { status: 403 });
    }
    return NextResponse.json({
      challenges: await listChallenges((status as ChallengeStatus | null) ?? (canReview ? undefined : "published")),
    });
  } catch (error) {
    console.error("Could not read challenges:", error);
    return NextResponse.json({ error: "Could not load challenges." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user, response } = await requireUser(["student", "teacher", "community"]);
  if (response || !user) return response;

  try {
    const body: unknown = await request.json();
    if (!isChallengeInput(body)) {
      return NextResponse.json({ error: "Add a title, topic, location, and description (at least 15 characters)." }, { status: 400 });
    }
    if (body.kind === "school" && user.role !== "teacher") {
      return NextResponse.json({ error: "Only teachers can create school innovation challenges." }, { status: 403 });
    }
    if (user.role === "student" && typeof body.contactPhone === "string" && body.contactPhone.trim()) {
      return NextResponse.json({ error: "Student problem reports must not include personal phone numbers." }, { status: 400 });
    }
    const challenge = await createChallenge({
      title: body.title.trim(),
      category: body.category.trim(),
      kind: body.kind === "school" ? "school" : "community",
      schoolName: typeof body.schoolName === "string" ? body.schoolName.trim() : undefined,
      location: body.location.trim(),
      description: body.description.trim(),
      contactPhone: typeof body.contactPhone === "string" ? body.contactPhone.trim() : undefined,
      peopleAffected: typeof body.peopleAffected === "string" ? body.peopleAffected.trim() : undefined,
      whyItMatters: typeof body.whyItMatters === "string" ? body.whyItMatters.trim() : undefined,
      possibleAreas: typeof body.possibleAreas === "string" ? body.possibleAreas.trim() : undefined,
      submittedById: user.id,
    });
    const notificationStatuses: string[] = [];
    if (challenge.contactPhone) {
      notificationStatuses.push(await sendSms(challenge.contactPhone, `KIVORA: "${challenge.title}" was received and is awaiting teacher review.`));
    }
    if (process.env.TEACHER_PHONE_NUMBER) {
      notificationStatuses.push(await sendSms(process.env.TEACHER_PHONE_NUMBER, `KIVORA: New challenge awaiting review: "${challenge.title}".`));
    }
    return NextResponse.json({ challenge, notificationStatuses }, { status: 201 });
  } catch (error) {
    console.error("Could not create challenge:", error);
    return NextResponse.json({ error: "Could not submit your challenge." }, { status: 500 });
  }
}

function isChallengeInput(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  return ["title", "category", "location", "description"].every((key) => typeof input[key] === "string" && input[key].trim().length > 0) &&
    (input.description as string).trim().length >= 15 &&
    (input.kind === undefined || input.kind === "community" || input.kind === "school") &&
    (input.schoolName === undefined || typeof input.schoolName === "string") &&
    (input.kind !== "school" || (typeof input.schoolName === "string" && input.schoolName.trim().length >= 2)) &&
    (input.contactPhone === undefined || (typeof input.contactPhone === "string" && /^\+?[0-9\s()-]{7,20}$/.test(input.contactPhone)));
}
