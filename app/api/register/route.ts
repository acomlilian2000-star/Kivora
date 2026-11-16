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

    if (name.length < 2 || name.length > 60 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 10 || password.length > 128) {
      return NextResponse.json({
        error: "Enter a display name, valid email and password between 10 and 128 characters.",
      }, { status: 400 });
    }
    if (role !== "community") {
      return NextResponse.json({
        error: "Public registration is for community members. School administrators register their school, and teachers are added by their school.",
      }, { status: 400 });
    }
    if (await prisma.user.findUnique({ where: { email } })) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await hash(password, 12),
        role: "community",
        communityProfile: { create: {} },
      },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Could not register account:", error);
    return NextResponse.json({ error: "Could not create your account." }, { status: 500 });
  }
}
