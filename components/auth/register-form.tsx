"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"community" | "teacher">("community");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, inviteCode }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not create your account.");
      const signedIn = await signIn("credentials", { identifier: email, password, redirect: false });
      if (signedIn?.error) throw new Error("Account created, but sign-in failed. Please sign in.");
      router.push("/dashboard");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create your account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-brand" href="/"><span><Sparkles size={18} /></span>KIVORA</Link>
        <p className="section-kicker">JOIN THE INNOVATION JOURNEY</p>
        <h1>Create an account</h1>
        <p className="auth-description">Choose how you take part. Learner accounts are set up by their supervising teachers.</p>
        <form className="auth-form" onSubmit={(event) => void submit(event)}>
          <label className="form-label">I’m joining as
            <select value={role} onChange={(event) => setRole(event.target.value as "community" | "teacher")}>
              <option value="community">Community member</option>
              <option value="teacher">Teacher (invitation required)</option>
            </select>
          </label>
          <label className="form-label">Name or display name
            <input autoComplete="name" required minLength={2} maxLength={60} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="form-label">Email
            <input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="form-label">Password
            <input autoComplete="new-password" type="password" required minLength={10} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} />
            <small>Use at least 10 characters.</small>
          </label>
          {role === "teacher" && <label className="form-label">Teacher invitation code
            <input required autoComplete="off" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} />
          </label>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark full-button" disabled={pending}>
            {pending ? "Creating account…" : "Create account"} {!pending && <ArrowRight size={15} />}
          </button>
        </form>
        <p className="auth-switch">Already registered? <Link href="/login">Sign in</Link></p>
        <p className="auth-safety">Community accounts cannot access private student projects. Teachers need an invitation code; student accounts are teacher-managed.</p>
      </section>
    </main>
  );
}
