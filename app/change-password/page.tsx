import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/auth/change-password-form";
import { auth } from "@/lib/auth";

export default async function ChangePasswordPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!session.user.mustChangePassword) redirect("/dashboard");
  return <ChangePasswordForm />;
}
