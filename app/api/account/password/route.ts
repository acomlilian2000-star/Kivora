import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (response || !user) return response;

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Password details are required." }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    const currentPassword = typeof input.currentPassword === "string" ? input.currentPassword : "";
    const newPassword = typeof input.newPassword === "string" ? input.newPassword : "";
    if (newPassword.length < 10 || newPassword.length > 128) {
      return NextResponse.json({ error: "Your new password must be 10–128 characters." }, { status: 400 });
    }

    const account = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });
    if (!account?.passwordHash || !(await compare(currentPassword, account.passwordHash))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hash(newPassword, 12), mustChangePassword: false },
    });
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("Could not update password:", error);
    return NextResponse.json({ error: "Could not update your password." }, { status: 500 });
  }
}
