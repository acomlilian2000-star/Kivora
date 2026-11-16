import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { user, response } = await requireUser(["student"]);
  if (response || !user) return response;

  try {
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } },
        ],
      },
      include: {
        challenge: { select: { id: true, title: true, category: true, description: true } },
        members: { select: { id: true, memberRole: true } },
        submissions: {
          include: { assessment: { select: { score: true, feedback: true, badge: true } } },
          orderBy: { createdAt: "desc" },
        },
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
  const { user, response } = await requireUser(["student"]);
  if (response || !user) return response;

  try {
    const body: unknown = await request.json();
    const challengeId = body && typeof body === "object" ? (body as { challengeId?: unknown }).challengeId : undefined;
    const teamName = body && typeof body === "object" ? (body as { teamName?: unknown }).teamName : undefined;
    if (typeof challengeId !== "string" || typeof teamName !== "string" || teamName.trim().length < 2 || teamName.trim().length > 60) {
      return NextResponse.json({ error: "A challenge and a team name (2–60 characters) are required." }, { status: 400 });
    }
    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge || challenge.status !== "published") {
      return NextResponse.json({ error: "Only published challenges can be joined." }, { status: 409 });
    }
    const team = await prisma.$transaction(async (transaction) => {
      const created = await transaction.team.create({
        data: {
          name: teamName.trim(),
          challengeId,
          ownerId: user.id,
          members: { create: { userId: user.id } },
        },
      });
      await transaction.challenge.update({
        where: { id: challengeId },
        data: { participants: { increment: 1 } },
      });
      return created;
    });
    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Could not join challenge:", error);
    return NextResponse.json({ error: "Could not join this challenge." }, { status: 500 });
  }
}
