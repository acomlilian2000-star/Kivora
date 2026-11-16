"use client";

import { FormEvent, useEffect, useState } from "react";
import { KeyRound, UserPlus } from "lucide-react";

type Student = {
  id: string;
  name: string;
  loginId: string | null;
  studentProfile: { classLevel: string; educationLevel: string } | null;
};

type NewCredentials = { name: string; loginId: string; temporaryPassword: string };

export default function StudentAccess() {
  const [students, setStudents] = useState<Student[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [educationLevel, setEducationLevel] = useState("primary");
  const [credentials, setCredentials] = useState<NewCredentials | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function loadStudents() {
    const response = await fetch("/api/students");
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not load learners.");
    setStudents(result.students);
  }

  useEffect(() => {
    loadStudents().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load learners."));
  }, []);

  async function createStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setCredentials(null);
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, classLevel, educationLevel }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not create the learner account.");
      setCredentials({ name: result.student.name, loginId: result.student.loginId, temporaryPassword: result.temporaryPassword });
      setDisplayName("");
      setClassLevel("");
      await loadStudents();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create the learner account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="inner-view student-module">
      <div className="page-intro"><div><p className="section-kicker">TEACHER-SUPERVISED ONBOARDING</p><h1>Manage learners</h1><p>Create learner accounts without collecting student email addresses or phone numbers.</p></div><div className="intro-art"><UserPlus size={27} /></div></div>
      <div className="student-access-layout">
        <form className="panel mentor-form" onSubmit={(event) => void createStudent(event)}>
          <h2>Create a learner account</h2>
          <label className="form-label">First name or approved display name<input required minLength={2} maxLength={50} value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
          <label className="form-label">Class / grade<input required minLength={2} maxLength={40} value={classLevel} onChange={(event) => setClassLevel(event.target.value)} placeholder="For example: P6 or S2" /></label>
          <label className="form-label">Uganda education level<select value={educationLevel} onChange={(event) => setEducationLevel(event.target.value)}><option value="primary">Primary P1–P7</option><option value="lower_secondary">Lower secondary S1–S4</option><option value="advanced_secondary">Advanced secondary S5–S6</option></select></label>
          <p className="mentor-privacy"><KeyRound size={15} /> Give the one-time password to the learner and guardian privately. Do not display it publicly or send it in a group chat.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark" disabled={pending}>{pending ? "Creating…" : "Create account"} <UserPlus size={15} /></button>
          {credentials && <div className="one-time-credentials" role="status"><strong>Copy these once; the password won’t be shown again.</strong><span>Learner: {credentials.name}</span><code>Login ID: {credentials.loginId}</code><code>Temporary password: {credentials.temporaryPassword}</code></div>}
        </form>
        <section className="panel student-list"><h2>Your supervised learners</h2>{students.length ? students.map((student) => <article key={student.id}><strong>{student.name}</strong><span>{student.studentProfile?.classLevel} · {student.studentProfile?.educationLevel.replaceAll("_", " ")}</span></article>) : <div className="empty-state"><UserPlus size={22} /><strong>No learner accounts yet</strong><span>Accounts you create will appear here.</span></div>}</section>
      </div>
    </div>
  );
}
