import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SchoolSelector from "@/components/school/school-selector";

export default async function SchoolSelectPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.mustChangePassword) redirect("/change-password");

  const memberships = await prisma.schoolMembership.findMany({
    where: { userId: session.user.id, status: "active" },
    include: { school: true },
    orderBy: { createdAt: "asc" },
  });
  if (memberships.length === 0) redirect("/dashboard");
  if (memberships.length === 1) {
    redirect(memberships[0].role === "SCHOOL_ADMIN" ? "/school/dashboard" : "/dashboard");
  }

  return (
    <main className="auth-page school-register-page">
      <section className="auth-card">
        <p className="section-kicker">YOUR KIVORA WORKSPACES</p>
        <h1>Choose a school</h1>
        <p className="auth-description">Select a school where you have an active membership. Your access is checked by KIVORA before each protected request.</p>
        <SchoolSelector
          memberships={memberships.map(({ school, role }) => ({
            schoolId: school.id,
            schoolName: school.name,
            district: school.district,
            role,
          }))}
        />
      </section>
    </main>
  );
}
