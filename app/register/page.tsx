import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/register-form";
import { auth } from "@/lib/auth";

export default async function RegisterPage() {
  if ((await auth())?.user) redirect("/dashboard");
  return <RegisterForm />;
}
