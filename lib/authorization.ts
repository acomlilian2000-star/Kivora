import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireUser(
  allowedRoles?: string[],
  options: { allowPasswordChange?: boolean } = {},
) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      user: null,
      response: NextResponse.json({ error: "Sign in to continue." }, { status: 401 }),
    };
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return {
      user: null,
      response: NextResponse.json({ error: "You do not have permission to do that." }, { status: 403 }),
    };
  }

  if (session.user.mustChangePassword && !options.allowPasswordChange) {
    return {
      user: null,
      response: NextResponse.json({ error: "Change your one-time password before continuing." }, { status: 403 }),
    };
  }

  return {
    user: { id: session.user.id, role: session.user.role },
    response: null,
  };
}

export async function requireSchoolMembership(allowedRoles: readonly string[]) {
  const { user, response } = await requireUser();
  if (response || !user) return { user: null, membership: null, response };

  const memberships = await prisma.schoolMembership.findMany({
    where: {
      userId: user.id,
      status: "active",
      role: { in: [...allowedRoles] },
    },
    include: { school: true, user: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });
  const activeSchoolId = (await cookies()).get("kivora-active-school")?.value;
  const membership = activeSchoolId
    ? memberships.find((item) => item.schoolId === activeSchoolId) ?? null
    : memberships.length === 1 ? memberships[0] : null;

  if (!membership) {
    const multipleSchools = memberships.length > 1 && !activeSchoolId;
    return {
      user: null,
      membership: null,
      response: NextResponse.json(
        { error: multipleSchools ? "Choose an active school to continue." : "An active school membership is required." },
        { status: multipleSchools ? 409 : 403 },
      ),
    };
  }

  return { user, membership, response: null };
}
