import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [publishedChallenges, pendingChallenges, schoolChallenges, teams, submissions, impact] = await Promise.all([
      prisma.challenge.count({ where: { status: "published" } }),
      prisma.challenge.count({ where: { status: "pending" } }),
      prisma.challenge.count({ where: { status: "published", kind: "school" } }),
      prisma.team.count(),
      prisma.submission.count(),
      prisma.submission.aggregate({
        _sum: { peopleHelped: true, materialsReused: true, problemsAddressed: true },
      }),
    ]);
    return NextResponse.json({
      publishedChallenges,
      pendingChallenges,
      schoolChallenges,
      teams,
      submissions,
      peopleHelped: impact._sum.peopleHelped ?? 0,
      materialsReused: impact._sum.materialsReused ?? 0,
      problemsAddressed: impact._sum.problemsAddressed ?? 0,
    });
  } catch (error) {
    console.error("Could not load dashboard summary:", error);
    return NextResponse.json({ error: "Could not load current KIVORA activity." }, { status: 500 });
  }
}
