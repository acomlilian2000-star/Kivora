import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (response || !user) return response;

  try {
    const body: unknown = await request.json();
    const schoolId = body && typeof body === "object" && !Array.isArray(body) &&
      typeof (body as Record<string, unknown>).schoolId === "string"
      ? ((body as Record<string, unknown>).schoolId as string).trim()
      : "";
    if (!schoolId) return NextResponse.json({ error: "Choose a school." }, { status: 400 });

    const membership = await prisma.schoolMembership.findFirst({
      where: { userId: user.id, schoolId, status: "active" },
      select: { schoolId: true, role: true },
    });
    if (!membership) {
      return NextResponse.json({ error: "You do not have an active membership at that school." }, { status: 403 });
    }

    const result = NextResponse.json({ success: true, role: membership.role });
    result.cookies.set("kivora-active-school", membership.schoolId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return result;
  } catch (error) {
    console.error("Could not change active school:", error);
    return NextResponse.json({ error: "Could not change the active school." }, { status: 500 });
  }
}
