import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [publishedChallenges, pendingChallenges, teams, submissions] = await Promise.all([
      prisma.challenge.count({ where: { status: "published" } }),
      prisma.challenge.count({ where: { status: "pending" } }),
      prisma.team.count(),
      prisma.submission.count(),
    ]);

    return NextResponse.json({ publishedChallenges, pendingChallenges, teams, submissions });
  } catch (error) {
    console.error("Could not load dashboard summary:", error);
    return NextResponse.json({ error: "Could not load current KIVORA activity." }, { status: 500 });
  }
}
