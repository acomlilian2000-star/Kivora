import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || (body as { approved?: unknown }).approved !== true) {
      return NextResponse.json({ error: "Teacher approval is required." }, { status: 400 });
    }
    const { id } = await context.params;
    const brief = await prisma.projectBrief.update({ where: { id }, data: { approved: true } });
    return NextResponse.json({ brief });
  } catch (error) {
    console.error("Could not approve project brief:", error);
    return NextResponse.json({ error: "Could not approve this project brief." }, { status: 404 });
  }
}
