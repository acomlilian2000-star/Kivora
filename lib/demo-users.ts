import { prisma } from "@/lib/prisma";

export async function getDemoUser(role: "student" | "teacher") {
  const isStudent = role === "student";
  return prisma.user.upsert({
    where: { email: isStudent ? "amina@kivora.demo" : "neema@kivora.demo" },
    create: {
      email: isStudent ? "amina@kivora.demo" : "neema@kivora.demo",
      name: isStudent ? "Amina M." : "Neema T.",
      role,
      school: "Upanga Secondary",
    },
    update: {},
  });
}
