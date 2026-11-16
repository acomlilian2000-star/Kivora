import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { user, response } = await requireUser(["teacher"]);
  if (response || !user) return response;

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Student details are required." }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const displayName = typeof input.displayName === "string" ? input.displayName.trim() : "";
    const classLevel = typeof input.classLevel === "string" ? input.classLevel.trim() : "";
    const educationLevel = input.educationLevel;
    if (displayName.length < 2 || displayName.length > 50 || classLevel.length < 2 || classLevel.length > 40 ||
      !["primary", "lower_secondary", "advanced_secondary"].includes(String(educationLevel))) {
      return NextResponse.json({ error: "Enter a learner display name, class and Ugandan education level." }, { status: 400 });
    }

    const teacher = await prisma.user.findUnique({
      where: { id: user.id },
      include: { teacherProfile: true },
    });
    if (!teacher?.teacherProfile?.verified) {
      return NextResponse.json({ error: "Only a verified teacher can create learner accounts." }, { status: 403 });
    }

    const loginId = `KIV-${randomBytes(5).toString("hex").toUpperCase()}`;
    const temporaryPassword = randomBytes(12).toString("base64url");
    const student = await prisma.user.create({
      data: {
        name: displayName,
        loginId,
        passwordHash: await hash(temporaryPassword, 12),
        role: "student",
        school: teacher.school,
        studentProfile: {
          create: {
            classLevel,
            educationLevel: String(educationLevel),
            supervisingTeacherId: teacher.id,
            schoolId: teacher.teacherProfile.schoolId,
          },
        },
      },
      select: { id: true, name: true, loginId: true },
    });

    return NextResponse.json({
      student,
      temporaryPassword,
      message: "Give these sign-in details directly to the learner and their guardian. They are shown only once.",
    }, { status: 201 });
  } catch (error) {
    console.error("Could not create supervised student account:", error);
    return NextResponse.json({ error: "Could not create the student account." }, { status: 500 });
  }
}
