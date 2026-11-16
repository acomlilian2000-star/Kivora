"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, MessageCircleQuestion, ShieldCheck, Sparkles } from "lucide-react";
import type { MentorGuide, MentorStage } from "@/lib/ai/mentor";

const stages: MentorStage[] = [
  "understand the problem",
  "who is affected",
  "explore possible causes",
  "student-generated ideas",
  "compare ideas",
  "local resources",
  "plan and test",
];

export default function InnovationMentor() {
  const [problem, setProblem] = useState("");
  const [studentIdea, setStudentIdea] = useState("");
  const [materials, setMaterials] = useState("");
  const [learnerLevel, setLearnerLevel] = useState("Lower secondary S1–S4");
  const [stage, setStage] = useState<MentorStage>(stages[0]);
  const [guide, setGuide] = useState<MentorGuide | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setGuide(null);
    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, studentIdea, materials, learnerLevel, stage }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The mentor could not respond.");
      setGuide(result.guide as MentorGuide);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The mentor could not respond.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="inner-view student-module">
      <div className="page-intro"><div><p className="section-kicker">A THINKING PARTNER, NOT AN ANSWER MACHINE</p><h1>AI innovation mentor</h1><p>Take one small step at a time. Your ideas and choices stay yours.</p></div><div className="intro-art"><MessageCircleQuestion size={29} /></div></div>
      <div className="mentor-layout">
        <form className="panel mentor-form" onSubmit={(event) => void submit(event)}>
          <label className="form-label">What problem have you noticed?<textarea required minLength={10} maxLength={500} rows={4} value={problem} onChange={(event) => setProblem(event.target.value)} placeholder="Describe what you observed. Do not include names, phone numbers or exact home addresses." /></label>
          <label className="form-label">Which step are you thinking about?
            <select value={stage} onChange={(event) => setStage(event.target.value as MentorStage)}>{stages.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </label>
          <label className="form-label">Your idea so far (optional)
            <textarea maxLength={500} rows={3} value={studentIdea} onChange={(event) => setStudentIdea(event.target.value)} placeholder="It is okay if you are still thinking." />
          </label>
          <label className="form-label">Materials you might be able to use (optional)
            <input maxLength={300} value={materials} onChange={(event) => setMaterials(event.target.value)} placeholder="For example: cardboard, string, old containers" />
          </label>
          <label className="form-label">Uganda learner level
            <select value={learnerLevel} onChange={(event) => setLearnerLevel(event.target.value)}>
              <option>Primary P1–P7</option>
              <option>Lower secondary S1–S4</option>
              <option>Advanced secondary S5–S6</option>
            </select>
          </label>
          <p className="mentor-privacy"><ShieldCheck size={16} /> Please don’t enter personal details. Your response is sent securely to the configured OpenAI service and is not saved as a chat history.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark" disabled={pending}>{pending ? "Thinking with you…" : "Get a guiding question"} {!pending && <ArrowRight size={15} />}</button>
        </form>
        <section className="panel mentor-response" aria-live="polite">
          {!guide && <div className="mentor-empty"><span><Sparkles size={24} /></span><h2>Curiosity comes first</h2><p>The mentor will help you observe, ask questions and choose a safe next step. It will not design the whole solution for you.</p></div>}
          {guide && <>
            <p className="section-kicker">A QUESTION TO THINK ABOUT</p>
            <h2>{guide.reflectionQuestion}</h2>
            <div className="mentor-response-section"><strong>Try these next steps</strong><ol>{guide.nextSteps.map((step, index) => <li key={index}>{step}</li>)}</ol></div>
            {guide.thingsToNotice.length > 0 && <div className="mentor-response-section"><strong>Things you could notice</strong><ul>{guide.thingsToNotice.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}
            <p className="safety-note"><ShieldCheck size={16} /> {guide.safetyReminder}</p>
          </>}
        </section>
      </div>
    </div>
  );
}
