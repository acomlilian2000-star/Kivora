import KivoraApp from "@/components/kivora-app";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.mustChangePassword) redirect("/change-password");
  if (session.user.role === "school_admin") redirect("/school/dashboard");
  return <KivoraApp role={session.user.role} />;
}
