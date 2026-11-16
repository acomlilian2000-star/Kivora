"use client";

import { FormEvent, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not change your password.");
      await signOut({ redirect: false });
      router.push("/login?passwordUpdated=1");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not change your password.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><span><KeyRound size={18} /></span>Protect your account</div>
        <p className="section-kicker">FIRST SIGN-IN</p>
        <h1>Choose a new password</h1>
        <p className="auth-description">Your teacher gave you a one-time password. Change it before continuing.</p>
        <form className="auth-form" onSubmit={(event) => void submit(event)}>
          <label className="form-label">One-time password<input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
          <label className="form-label">New password<input required type="password" minLength={10} maxLength={128} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><small>Use at least 10 characters and keep it private.</small></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark full-button" disabled={pending}>{pending ? "Updating…" : "Change password"}</button>
        </form>
      </section>
    </main>
  );
}
