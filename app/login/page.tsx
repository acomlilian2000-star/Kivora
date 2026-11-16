import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  if ((await auth())?.user) redirect("/dashboard");
  return <LoginForm />;
}
