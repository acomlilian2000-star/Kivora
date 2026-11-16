"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, BookOpen, Search } from "lucide-react";

type Resource = { id: string; title: string; subject: string; summary: string; url: string | null };

export default function ResourceFinder({ onBuildProject }: { onBuildProject: () => void }) {
  const [query, setQuery] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [searched, setSearched] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/resources?q=${encodeURIComponent(query)}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not search resources.");
      setResources(result.resources);
      setSearched(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not search resources.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="inner-view student-module">
      <div className="page-intro"><div><p className="section-kicker">START WITH WHAT YOUR COMMUNITY HAS</p><h1>Resource finder</h1><p>Search KIVORA’s real learning library, or plan with safe, locally available materials you already know about.</p></div><div className="intro-art"><BookOpen size={29} /></div></div>
      <form className="resource-search panel" onSubmit={(event) => void search(event)}>
        <label className="form-label" htmlFor="resource-query">What problem or subject are you exploring?</label>
        <div className="resource-search-row"><input id="resource-query" maxLength={160} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try water, waste, health or mathematics" /><button className="button button-dark" disabled={pending}>{pending ? "Searching…" : "Search library"} <Search size={15} /></button></div>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
      {resources.length > 0 && <div className="resource-cards">{resources.map((resource) => <article className="panel resource-card" key={resource.id}><span className="category-chip">{resource.subject}</span><h2>{resource.title}</h2><p>{resource.summary}</p>{resource.url && <a href={resource.url} target="_blank" rel="noreferrer">Open learning resource <ArrowRight size={14} /></a>}</article>)}</div>}
      {searched && resources.length === 0 && <div className="empty-state"><BookOpen size={22} /><strong>No library resources found</strong><span>The KIVORA resource library has no matching published materials yet. We won’t invent resources or claim they’re locally available.</span></div>}
      {!searched && <div className="resource-materials panel"><p className="section-kicker">YOUR LOCAL MATERIALS</p><h2>What could be reused safely?</h2><p>As you plan, consider ordinary materials that you can confirm are available, such as used paper, clean containers or cardboard. Ask a teacher before collecting or testing materials.</p><button className="button button-outline" onClick={onBuildProject}>Continue to project builder <ArrowRight size={15} /></button></div>}
    </div>
  );
}
