import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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
