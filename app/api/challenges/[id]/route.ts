import { NextResponse } from "next/server";
import { publishChallenge } from "@/lib/challenges";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/africastalking";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || (body as { status?: unknown }).status !== "published") {
      return NextResponse.json({ error: "Only teacher approval (status: published) is supported." }, { status: 400 });
    }
    const { id } = await context.params;
    const challenge = await publishChallenge(id);
    if (!challenge) return NextResponse.json({ error: "Challenge not found." }, { status: 404 });
    const smsStatus = challenge.contactPhone
      ? await sendSms(challenge.contactPhone, `KIVORA: "${challenge.title}" was approved and is ready for students.`)
      : undefined;
    await prisma.notification.create({
      data: {
        channel: "in-app",
        message: `Teacher approved the challenge "${challenge.title}".`,
        status: "sent",
      },
    });
    return NextResponse.json({ challenge, smsStatus });
  } catch (error) {
    console.error("Could not approve challenge:", error);
    return NextResponse.json({ error: "Could not approve this challenge." }, { status: 500 });
  }
}
