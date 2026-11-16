import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDemoUser } from "@/lib/demo-users";

export async function GET() {
  try {
    const user = await getDemoUser("student");
    const teams = await prisma.team.findMany({
      where: { members: { some: { userId: user.id } } },
      include: {
        challenge: true,
        members: { include: { user: true } },
        submissions: { include: { assessment: true }, orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Could not load student teams:", error);
    return NextResponse.json({ error: "Could not load your projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const challengeId = body && typeof body === "object" ? (body as { challengeId?: unknown }).challengeId : undefined;
    if (typeof challengeId !== "string") return NextResponse.json({ error: "A challenge is required." }, { status: 400 });
    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge || challenge.status !== "published") {
      return NextResponse.json({ error: "Only published challenges can be joined." }, { status: 409 });
    }
    const user = await getDemoUser("student");
    const existing = await prisma.team.findFirst({
      where: { challengeId, members: { some: { userId: user.id } } },
    });
    if (existing) return NextResponse.json({ team: existing });
    const team = await prisma.team.create({
      data: {
        name: `${user.name}'s team`,
        challengeId,
        members: { create: { userId: user.id } },
      },
    });
    await prisma.challenge.update({ where: { id: challengeId }, data: { participants: { increment: 1 } } });
    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Could not join challenge:", error);
    return NextResponse.json({ error: "Could not join this challenge." }, { status: 500 });
  }
}
