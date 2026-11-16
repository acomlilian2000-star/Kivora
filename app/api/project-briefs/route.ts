import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authorization";

export async function GET() {
  const { user, response } = await requireUser(["teacher", "admin"]);
  if (response || !user) return response;

  try {
    const briefs = await prisma.projectBrief.findMany({
      where: { approved: false },
      include: { challenge: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ briefs });
  } catch (error) {
    console.error("Could not load project briefs:", error);
    return NextResponse.json({ error: "Could not load project briefs." }, { status: 500 });
  }
}
