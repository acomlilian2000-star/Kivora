import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const rawIds = new URL(request.url).searchParams.get("ids") ?? "";
    const ids = rawIds.split(",").filter((id) => /^[a-zA-Z0-9_-]{1,30}$/.test(id)).slice(0, 50);
    if (!ids.length) return NextResponse.json({ teams: [] });
    const teams = await prisma.team.findMany({
      where: { id: { in: ids } },
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
        data: { name: teamName.trim(), challengeId },
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
