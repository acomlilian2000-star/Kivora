import { redirect } from "next/navigation";
import SchoolRegistrationForm from "@/components/auth/school-registration-form";
import { auth } from "@/lib/auth";

export default async function SchoolRegisterPage() {
  if ((await auth())?.user) redirect("/dashboard");
  return <SchoolRegistrationForm />;
}
