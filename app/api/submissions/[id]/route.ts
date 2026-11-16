import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Assessment details are required." }, { status: 400 });
    const input = body as Record<string, unknown>;
    if (!Number.isInteger(input.score) || (input.score as number) < 1 || (input.score as number) > 5 ||
      typeof input.feedback !== "string" || input.feedback.trim().length < 5 ||
      typeof input.teacherName !== "string" || input.teacherName.trim().length < 2 || input.teacherName.trim().length > 80) {
      return NextResponse.json({ error: "Provide a teacher name, a score from 1 to 5, and feedback of at least 5 characters." }, { status: 400 });
    }
    const { id } = await context.params;
    const submission = await prisma.submission.findUnique({ where: { id }, select: { id: true } });
    if (!submission) return NextResponse.json({ error: "The student submission could not be found." }, { status: 404 });
    const teacherName = input.teacherName.trim();
    const teacher = await prisma.user.findFirst({
      where: { name: teacherName, role: "teacher" },
      orderBy: { createdAt: "asc" },
    }) ?? await prisma.user.create({ data: { name: teacherName, role: "teacher" } });
    const assessment = await prisma.assessment.upsert({
      where: { submissionId: id },
      create: {
        submissionId: id,
        teacherId: teacher.id,
        score: input.score as number,
        feedback: input.feedback.trim(),
        badge: typeof input.badge === "string" ? input.badge : null,
      },
      update: {
        teacherId: teacher.id,
        score: input.score as number,
        feedback: input.feedback.trim(),
        badge: typeof input.badge === "string" ? input.badge : null,
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
