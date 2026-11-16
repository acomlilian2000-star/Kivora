import { randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "School registration details are required." }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const schoolName = text(input.schoolName);
    const schoolType = text(input.schoolType).toLowerCase();
    const country = text(input.country) || "Uganda";
    const district = text(input.district);
    const location = text(input.location);
    const contactPhone = text(input.contactPhone);
    const headteacher = text(input.headteacher);
    const administratorName = text(input.administratorName);
    const identifier = text(input.identifier);
    const password = typeof input.password === "string" ? input.password : "";
    const email = isEmail(identifier) ? identifier.toLowerCase() : null;
    const loginId = email ? null : identifier.toUpperCase();

    if (schoolName.length < 2 || schoolName.length > 120 ||
      !["primary", "secondary"].includes(schoolType) ||
      country.length < 2 || country.length > 80 ||
      district.length < 2 || district.length > 80 ||
      location.length < 2 || location.length > 120 ||
      headteacher.length < 2 || headteacher.length > 80 ||
      administratorName.length < 2 || administratorName.length > 60 ||
      password.length < 10 || password.length > 128 ||
      (!email && !/^[A-Z0-9._-]{4,40}$/.test(loginId ?? "")) ||
      (contactPhone && !/^\+?[0-9\s()-]{7,20}$/.test(contactPhone))) {
      return NextResponse.json({
        error: "Check the school details, administrator sign-in ID and password. Passwords must be at least 10 characters.",
      }, { status: 400 });
    }

    const [existingUser, existingSchool] = await Promise.all([
      prisma.user.findFirst({
        where: { OR: email ? [{ email }] : [{ loginId }] },
        select: { id: true },
      }),
      prisma.school.findFirst({
        where: { name: schoolName, district },
        select: { id: true },
      }),
    ]);
    if (existingUser) {
      return NextResponse.json({ error: "An account with that email or login ID already exists." }, { status: 409 });
    }
    if (existingSchool) {
      return NextResponse.json({ error: "A school with that name and district is already registered." }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const schoolCode = `KIV-${randomBytes(3).toString("hex").toUpperCase()}`;
      try {
        const registration = await prisma.$transaction(async (transaction) => {
          const school = await transaction.school.create({
            data: {
              name: schoolName,
              schoolType,
              country,
              district,
              location,
              contactPhone: contactPhone || null,
              headteacher,
              schoolCode,
            },
            select: { id: true, name: true, district: true, schoolCode: true },
          });
          const user = await transaction.user.create({
            data: {
              name: administratorName,
              email,
              loginId,
              passwordHash,
              role: "school_admin",
              school: school.name,
              schoolMemberships: {
                create: {
                  role: "SCHOOL_ADMIN",
                  status: "active",
                  school: { connect: { id: school.id } },
                  administratorProfile: { create: { title: "School administrator" } },
                },
              },
            },
            select: { id: true, name: true, email: true, loginId: true, role: true },
          });
          return { school, user };
        });

        const response = NextResponse.json(registration, { status: 201 });
        response.cookies.set("kivora-active-school", registration.school.id, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
        return response;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          const [duplicateUser, duplicateSchool] = await Promise.all([
            prisma.user.findFirst({
              where: { OR: email ? [{ email }] : [{ loginId }] },
              select: { id: true },
            }),
            prisma.school.findFirst({
              where: { name: schoolName, district },
              select: { id: true },
            }),
          ]);
          if (duplicateUser) {
            return NextResponse.json({ error: "An account with that email or login ID already exists." }, { status: 409 });
          }
          if (duplicateSchool) {
            return NextResponse.json({ error: "A school with that name and district is already registered." }, { status: 409 });
          }
          if (attempt < 2) continue;
        }
        throw error;
      }
    }
    return NextResponse.json({ error: "Could not generate a unique school code. Please try again." }, { status: 503 });
  } catch (error) {
    console.error("Could not register school:", error);
    return NextResponse.json({ error: "Could not complete school registration." }, { status: 500 });
  }
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
