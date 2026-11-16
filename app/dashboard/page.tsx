import KivoraApp from "@/components/kivora-app";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <KivoraApp role={session.user.role} />;
}
