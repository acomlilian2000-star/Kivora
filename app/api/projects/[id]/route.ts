import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const textFields = [
  "proposedSolution",
  "objectives",
  "availableResources",
  "materialsNeeded",
  "steps",
  "estimatedDuration",
  "safetyConsiderations",
  "expectedOutcomes",
] as const;

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireUser(["student", "teacher", "admin"]);
  if (response || !user) return response;

  try {
    const { id } = await context.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: { team: { include: { members: { select: { userId: true } }, challenge: { select: { reviewerId: true } } } } },
    });
    if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

    const isStudentMember = user.role === "student" &&
      (project.team.ownerId === user.id || project.team.members.some((member) => member.userId === user.id));
    const isSupervisingTeacher = user.role === "teacher" && project.team.challenge.reviewerId === user.id;
    if (!isStudentMember && !isSupervisingTeacher && user.role !== "admin") {
      return NextResponse.json({ error: "You cannot edit this project." }, { status: 403 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Project details are required." }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const data: Prisma.ProjectUpdateInput = {};
    for (const field of textFields) {
      if (field in input) {
        const value = input[field];
        const limit = field === "steps" || field === "objectives" || field === "expectedOutcomes" ? 3000 : 1500;
        if (typeof value !== "string" || value.length > limit) {
          return NextResponse.json({ error: `${field} must be text no longer than ${limit} characters.` }, { status: 400 });
        }
        data[field] = value.trim();
      }
    }
    if ("status" in input) {
      const studentStatuses = ["planning", "building", "testing", "ready-for-review"];
      const teacherStatuses = [...studentStatuses, "approved"];
      const allowed = user.role === "student" ? studentStatuses : teacherStatuses;
      if (typeof input.status !== "string" || !allowed.includes(input.status)) {
        return NextResponse.json({ error: "Choose a valid project stage." }, { status: 400 });
      }
      data.status = input.status;
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No project changes were provided." }, { status: 400 });
    }

    const updatedProject = await prisma.project.update({ where: { id }, data });
    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Could not update project:", error);
    return NextResponse.json({ error: "Could not save project changes." }, { status: 500 });
  }
}
