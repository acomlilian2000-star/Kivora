import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createChallenge } from "@/lib/challenges";
import { sendSms } from "@/lib/africastalking";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await readForm(request);
    const sessionId = form.get("sessionId");
    const phoneNumber = form.get("phoneNumber");
    const text = form.get("text") ?? "";
    if (!sessionId || !phoneNumber) return ussd("END KIVORA could not verify this session.");

    const session = await prisma.ussdSession.upsert({
      where: { sessionId },
      create: { sessionId, phoneNumber, state: "active" },
      update: { phoneNumber },
    });
    if (session.state === "completed") return ussd("END Your challenge was already submitted.");

    const parts = text.split("*");
    if (!text) {
      await storeSession(sessionId, phoneNumber, "menu", {});
      return ussd("CON Welcome to KIVORA. Ideas into Impact.\n1. Submit a community problem\n2. Check my submission\n3. View learning opportunities\n4. Get help");
    }

    if (parts[0] === "1") {
      if (parts.length === 1) return ussd("CON What is the problem? Enter a short title:");
      if (parts.length === 2) return ussd("CON Describe the problem in your community:");
      if (parts.length === 3) return ussd("CON Where is this happening? Enter a location:");
      if (parts.length === 4) {
        const [title, description, location] = parts.slice(1);
        if (!title.trim() || description.trim().length < 15 || !location.trim()) {
          return ussd("END Please try again with a title, a description of at least 15 characters, and a location.");
        }
        const challenge = await createChallenge({
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          category: "Community-submitted",
          contactPhone: phoneNumber,
        });
        await storeSession(sessionId, phoneNumber, "completed", { challengeId: challenge.id });
        await sendSms(phoneNumber, `KIVORA: "${challenge.title}" was received and is awaiting teacher review.`);
        if (process.env.TEACHER_PHONE_NUMBER) {
          await sendSms(process.env.TEACHER_PHONE_NUMBER, `KIVORA: New USSD challenge awaiting review: "${challenge.title}".`);
        }
        return ussd("END Asante! Your challenge was sent for teacher review.");
      }
    }

    if (parts[0] === "2") {
      const recent = await prisma.challenge.findFirst({
        where: { contactPhone: phoneNumber },
        orderBy: { createdAt: "desc" },
      });
      return ussd(recent
        ? `END Latest challenge: ${recent.title} — ${recent.status === "published" ? "published" : "awaiting teacher review"}.`
        : "END We could not find a challenge for this phone number yet.");
    }
    if (parts[0] === "3") {
      const opportunities = await prisma.challenge.findMany({
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        take: 3,
      });
      const menu = opportunities.map((item, index) => `${index + 1}. ${item.title}`).join("\n");
      return ussd(opportunities.length ? `END Learning opportunities:\n${menu}` : "END No learning opportunities are available right now.");
    }
    if (parts[0] === "4") return ussd("END KIVORA connects local challenges with student ideas. Call your teacher for help.");
    return ussd("END Invalid choice. Please dial again and select 1, 2, 3 or 4.");
  } catch (error) {
    console.error("USSD callback failed:", error);
    return ussd("END KIVORA could not process your request. Please try again later.");
  }
}

async function readForm(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await request.json() as Record<string, unknown>;
    return new Map(Object.entries(body).map(([key, value]) => [key, String(value ?? "")]));
  }
  const body = new URLSearchParams(await request.text());
  return new Map(body.entries());
}

async function storeSession(sessionId: string, phoneNumber: string, state: string, answers: object) {
  await prisma.ussdSession.upsert({
    where: { sessionId },
    create: { sessionId, phoneNumber, state, answers: JSON.stringify(answers) },
    update: { phoneNumber, state, answers: JSON.stringify(answers) },
  });
}

function ussd(message: string) {
  return new NextResponse(message, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
