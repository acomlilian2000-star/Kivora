import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireUser(["teacher", "admin"]);
  if (response || !user) return response;

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Assessment details are required." }, { status: 400 });
    const input = body as Record<string, unknown>;
    if (!Number.isInteger(input.score) || (input.score as number) < 1 || (input.score as number) > 5 ||
      typeof input.feedback !== "string" || input.feedback.trim().length < 5 || input.feedback.trim().length > 2000) {
      return NextResponse.json({ error: "Provide a score from 1 to 5 and feedback of 5–2,000 characters." }, { status: 400 });
    }
    const { id } = await context.params;
    if (input.publishPublicly !== undefined && typeof input.publishPublicly !== "boolean") {
      return NextResponse.json({ error: "Public showcase approval must be true or false." }, { status: 400 });
    }
    const submission = await prisma.submission.findUnique({
      where: { id },
      select: { id: true, sharedPublicly: true },
    });
    if (!submission) return NextResponse.json({ error: "The student submission could not be found." }, { status: 404 });
    if (input.publishPublicly === true && !submission.sharedPublicly) {
      return NextResponse.json({ error: "The student has not consented to share this work publicly." }, { status: 409 });
    }
    const assessment = await prisma.assessment.upsert({
      where: { submissionId: id },
      create: {
        submissionId: id,
        teacherId: user.id,
        score: input.score as number,
        feedback: input.feedback.trim(),
        badge: typeof input.badge === "string" ? input.badge : null,
        publiclyApproved: input.publishPublicly === true,
      },
      update: {
        teacherId: user.id,
        score: input.score as number,
        feedback: input.feedback.trim(),
        badge: typeof input.badge === "string" ? input.badge : null,
        publiclyApproved: input.publishPublicly === true,
      },
    });
    await prisma.submission.update({ where: { id }, data: { status: "reviewed" } });
    await prisma.notification.create({
      data: { channel: "in-app", message: `Teacher feedback is ready for submission ${id}.`, status: "sent" },
    });
    return NextResponse.json({ assessment });
  } catch (error) {
    console.error("Could not save teacher assessment:", error);
    return NextResponse.json({ error: "Could not save this assessment." }, { status: 404 });
  }
}
