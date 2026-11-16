"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function SchoolRegistrationForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const input = Object.fromEntries(formData.entries());
    const identifier = String(input.identifier ?? "");
    const password = String(input.password ?? "");

    try {
      const response = await fetch("/api/schools/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not register the school.");

      const signedIn = await signIn("credentials", { identifier, password, redirect: false });
      if (signedIn?.error) throw new Error("School registered, but sign-in failed. Please sign in.");
      router.push("/school/dashboard");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not register the school.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page school-register-page">
      <section className="auth-card school-register-card">
        <Link className="auth-brand" href="/"><span><Sparkles size={18} /></span>KIVORA</Link>
        <p className="section-kicker">SCHOOL-OWNED INNOVATION</p>
        <h1>Register your school</h1>
        <p className="auth-description">Your school manages its own teachers, learners and innovation activities. The first account becomes the school administrator.</p>
        <form className="auth-form" onSubmit={(event) => void submit(event)}>
          <div className="school-form-section">
            <h2>School details</h2>
            <label className="form-label">School name
              <input name="schoolName" autoComplete="organization" required minLength={2} maxLength={120} />
            </label>
            <div className="form-two-col">
              <label className="form-label">School type
                <select name="schoolType" defaultValue="primary" required>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </label>
              <label className="form-label">Country
                <input name="country" defaultValue="Uganda" autoComplete="country-name" required maxLength={80} />
              </label>
            </div>
            <div className="form-two-col">
              <label className="form-label">District
                <input name="district" required maxLength={80} />
              </label>
              <label className="form-label">Village, parish or town
                <input name="location" required maxLength={120} />
              </label>
            </div>
            <div className="form-two-col">
              <label className="form-label">School contact phone <span>(optional)</span>
                <input name="contactPhone" autoComplete="tel" type="tel" maxLength={20} />
              </label>
              <label className="form-label">Headteacher or authorised representative
                <input name="headteacher" required maxLength={80} />
              </label>
            </div>
          </div>

          <div className="school-form-section">
            <h2>School administrator</h2>
            <label className="form-label">Administrator's name
              <input name="administratorName" autoComplete="name" required minLength={2} maxLength={60} />
            </label>
            <label className="form-label">Email or create a login ID
              <input name="identifier" autoComplete="username" required maxLength={100} />
              <small>Use an email address or a unique login ID with letters and numbers.</small>
            </label>
            <label className="form-label">Password
              <input name="password" autoComplete="new-password" type="password" required minLength={10} maxLength={128} />
              <small>Use at least 10 characters.</small>
            </label>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark full-button" disabled={pending}>
            {pending ? "Registering school…" : "Register school"} {!pending && <ArrowRight size={15} />}
          </button>
        </form>
        <p className="auth-switch">Already registered? <Link href="/login">Sign in</Link></p>
        <p className="auth-safety">Your school receives a unique code for community problem routing. Keep administrator credentials private.</p>
      </section>
    </main>
  );
}
