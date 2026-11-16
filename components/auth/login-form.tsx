"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });
      if (!result || result.error) {
        setError("Those sign-in details were not recognised.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-brand" href="/"><span><Sparkles size={18} /></span>KIVORA</Link>
        <p className="section-kicker">IDEAS INTO IMPACT</p>
        <h1>Welcome back</h1>
        <p className="auth-description">Sign in to continue learning, building and sharing with your community.</p>
        <form className="auth-form" onSubmit={(event) => void submit(event)}>
          <label className="form-label">Email or student login ID
            <input autoComplete="username" required value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
          </label>
          <label className="form-label">Password
            <input autoComplete="current-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark full-button" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"} {!pending && <ArrowRight size={15} />}
          </button>
        </form>
        <p className="auth-switch">New to KIVORA? <Link href="/register">Create an account</Link></p>
        <p className="auth-safety">Student accounts are created by a supervising teacher. KIVORA does not ask learners to publish personal contact details.</p>
      </section>
    </main>
  );
}
