import { timingSafeEqual } from "node:crypto";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Registration details are required." }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const name = typeof input.name === "string" ? input.name.trim() : "";
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const password = typeof input.password === "string" ? input.password : "";
    const role = input.role;
    const inviteCode = typeof input.inviteCode === "string" ? input.inviteCode : "";

    if (name.length < 2 || name.length > 60 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 10 || password.length > 128) {
      return NextResponse.json({
        error: "Enter a display name, valid email and password between 10 and 128 characters.",
      }, { status: 400 });
    }
    if (role !== "community" && role !== "teacher") {
      return NextResponse.json({
        error: "Students must be registered by a supervising teacher. Choose community or teacher registration.",
      }, { status: 400 });
    }
    if (role === "teacher" && !secureEquals(inviteCode, process.env.TEACHER_INVITE_CODE ?? "")) {
      return NextResponse.json({ error: "A valid teacher invitation code is required." }, { status: 403 });
    }
    if (role === "teacher" && !process.env.TEACHER_INVITE_CODE) {
      return NextResponse.json({ error: "Teacher registration is not configured yet." }, { status: 503 });
    }
    if (await prisma.user.findUnique({ where: { email } })) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hash(password, 12),
        role,
        ...(role === "teacher"
          ? { teacherProfile: { create: { verified: true } } }
          : { communityProfile: { create: {} } }),
      },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Could not register account:", error);
    return NextResponse.json({ error: "Could not create your account." }, { status: 500 });
  }
}

function secureEquals(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}
