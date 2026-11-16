"use client";

import { useEffect, useState } from "react";
import { Heart, Trophy } from "lucide-react";

type ShowcaseProject = {
  id: string;
  title: string;
  description: string;
  evidence: string[];
  peopleHelped: number;
  materialsReused: number;
  problemsAddressed: number;
  challenge: { title: string; category: string };
};

export default function InnovationShowcase() {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/showcase")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load approved projects.");
        setProjects(result.projects);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load approved projects."));
  }, []);

  return (
    <div className="inner-view student-module">
      <div className="page-intro"><div><p className="section-kicker">LEARN FROM ONE ANOTHER</p><h1>Innovation showcase</h1><p>Only projects with student sharing consent and teacher approval appear here. Student names and contact details are never shown.</p></div><div className="intro-art"><Trophy size={29} /></div></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {projects.length > 0
        ? <div className="showcase-grid">{projects.map((project) => <article className="panel showcase-card" key={project.id}><span className="category-chip">{project.challenge.category}</span><p className="showcase-challenge">Inspired by: {project.challenge.title}</p><h2>{project.title}</h2><p>{project.description}</p>{project.evidence.map((url) => <a className="showcase-evidence" href={url} target="_blank" rel="noreferrer" key={url}>View approved evidence</a>)}<div className="showcase-reported-impact"><Heart size={15} /><span>Learner-reported: {project.peopleHelped} people helped · {project.materialsReused} materials reused · {project.problemsAddressed} problems addressed</span></div></article>)}</div>
        : !error && <div className="empty-state"><Trophy size={22} /><strong>No approved projects to show yet</strong><span>Completed work will appear only after student sharing consent and teacher review.</span></div>}
    </div>
  );
}
