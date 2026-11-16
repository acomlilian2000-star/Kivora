"use client";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  FileText,
  Filter,
  Globe2,
  GraduationCap,
  Heart,
  Leaf,
  Lightbulb,
  LogOut,
  MapPin,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  Send,
  Smartphone,
  Sparkles,
  Sprout,
  Target,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import MobileAccess from "@/components/dashboard/mobile-access";
import ProjectBriefPreview from "@/components/dashboard/project-brief-preview";
import ImpactTracker from "@/components/student/impact-tracker";
import InnovationMentor from "@/components/student/innovation-mentor";
import InnovationShowcase from "@/components/student/innovation-showcase";
import ResourceFinder from "@/components/student/resource-finder";
import StudentHome from "@/components/student/student-home";
import StudentAccess from "@/components/teacher/student-access";
import type { ProjectBrief } from "@/lib/types";

type View = "Home" | "Problem discovery" | "AI mentor" | "Resource finder" | "Project builder" | "Innovation showcase" | "Impact tracker" | "School challenges" | "Teacher review" | "Manage learners" | "Mobile access" | "Submit a challenge" | "Discover challenges" | "My projects" | "Impact stories";
type Challenge = {
  id?: string;
  status?: "pending" | "published";
  kind?: "community" | "school";
  schoolName?: string | null;
  peopleAffected?: string | null;
  whyItMatters?: string | null;
  possibleAreas?: string | null;
  title: string;
  category: string;
  location: string;
  contactPhone?: string;
  description: string;
  difficulty: string;
  duration: string;
  participants: number;
  color: string;
  icon: "leaf" | "water" | "bulb";
};

type DashboardSummary = {
  publishedChallenges: number;
  pendingChallenges: number;
  schoolChallenges: number;
  teams: number;
  submissions: number;
  peopleHelped: number;
  materialsReused: number;
  problemsAddressed: number;
};

const navGroups: { title: string; items: { label: View; icon: typeof Activity }[] }[] = [
  { title: "Workspace", items: [{ label: "Home", icon: Activity }] },
  { title: "Explore", items: [{ label: "Problem discovery", icon: Compass }, { label: "School challenges", icon: GraduationCap }] },
  { title: "Make", items: [{ label: "AI mentor", icon: MessageSquareText }, { label: "Resource finder", icon: BookOpen }, { label: "Project builder", icon: Lightbulb }] },
  { title: "Share", items: [{ label: "Innovation showcase", icon: Globe2 }, { label: "Impact tracker", icon: Heart }] },
  { title: "Community", items: [{ label: "Submit a challenge", icon: MessageSquareText }, { label: "Mobile access", icon: Smartphone }] },
  { title: "For educators", items: [{ label: "Teacher review", icon: GraduationCap }, { label: "Manage learners", icon: Users }] },
];

function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark"><Sparkles size={17} strokeWidth={2.1} /></div>
      <span>KIVORA</span>
      <span className="brand-period">.</span>
    </div>
  );
}

function Sidebar({
  active,
  role,
  onNavigate,
  mobileOpen,
  onClose,
  openChallengeCount,
  pendingReviewCount,
}: {
  active: View;
  role: string;
  onNavigate: (view: View) => void;
  mobileOpen: boolean;
  onClose: () => void;
  openChallengeCount: number;
  pendingReviewCount: number;
}) {
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const allowedViews = role === "teacher" || role === "admin"
    ? new Set<View>(["Home", "Problem discovery", "AI mentor", "Resource finder", "Project builder", "Innovation showcase", "Impact tracker", "School challenges", "Teacher review", "Manage learners", "Mobile access", "Submit a challenge"])
    : role === "community"
      ? new Set<View>(["Home", "Problem discovery", "School challenges", "Innovation showcase", "Impact tracker", "Mobile access", "Submit a challenge"])
      : new Set<View>(["Home", "Problem discovery", "AI mentor", "Resource finder", "Project builder", "Innovation showcase", "Impact tracker", "School challenges", "Mobile access", "Submit a challenge"]);
  const toggleGroup = (title: string) => setCollapsedGroups((current) =>
    current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
  );
  return (
    <>
      {mobileOpen && <button className="mobile-scrim" onClick={onClose} aria-label="Close menu" />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-head">
          <Logo />
          <button className="icon-button mobile-close" onClick={onClose} aria-label="Close menu"><X size={19} /></button>
        </div>
        <div className="workspace-switch">
          <div className="workspace-avatar"><Users size={17} /></div>
          <span><strong>{role === "teacher" ? "Teacher workspace" : role === "community" ? "Community workspace" : "Student maker space"}</strong><small>Uganda · learner-led</small></span>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {navGroups.map(({ title, items }) => {
            const visibleItems = items.filter(({ label }) => allowedViews.has(label));
            if (!visibleItems.length) return null;
            const collapsed = collapsedGroups.includes(title);
            return (
              <section className="nav-section" key={title}>
                <button className="nav-group-toggle" aria-expanded={!collapsed} onClick={() => toggleGroup(title)}>
                  <span>{title}</span><ChevronDown size={13} className={collapsed ? "nav-group-chevron collapsed" : "nav-group-chevron"} />
                </button>
                {!collapsed && visibleItems.map(({ label, icon: Icon }) => (
                  <button
                    className={`nav-link ${active === label ? "nav-link-active" : ""}`}
                    key={label}
                    aria-current={active === label ? "page" : undefined}
                    onClick={() => { onNavigate(label); onClose(); }}
                  >
                    <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
                    {label === "Teacher review" && pendingReviewCount > 0 && <span className="nav-count">{pendingReviewCount}</span>}
                    {(label === "Problem discovery" || label === "School challenges") && openChallengeCount > 0 && <span className="nav-count">{openChallengeCount}</span>}
                  </button>
                ))}
              </section>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="impact-mini">
            <div className="impact-mini-icon"><Heart size={16} /></div>
            <div><strong>Community activity</strong><span>{openChallengeCount} open challenge{openChallengeCount === 1 ? "" : "s"}</span></div>
          </div>
          <button className="nav-link help-link" onClick={() => onNavigate("Mobile access")}><CircleHelp size={18} /><span>Basic-phone access</span></button>
          <button className="nav-link help-link" onClick={() => void signOut({ callbackUrl: "/" })}><LogOut size={18} /><span>Sign out</span></button>
        </div>
      </aside>
    </>
  );
}

function Topbar({
  title,
  onMenu,
  query,
  onQueryChange,
  onNavigate,
  searchEnabled,
}: {
  title: View;
  onMenu: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  onNavigate: (view: View) => void;
  searchEnabled: boolean;
}) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
        <span>Workspace</span><ChevronRight size={14} /><strong>{title}</strong>
      </div>
      <div className="topbar-actions">
        {searchEnabled && <label className="search-box">
          <Search size={16} />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search challenges..." aria-label="Search challenges" />
        </label>}
        <button className="button button-outline mobile-access-shortcut" onClick={() => onNavigate("Mobile access")}><Smartphone size={15} /> USSD / SMS</button>
      </div>
    </header>
  );
}

function Dashboard({
  challenges,
  summary,
  onNavigate,
  onOpenChallenge,
  search,
}: {
  challenges: Challenge[];
  summary: DashboardSummary;
  onNavigate: (view: View) => void;
  onOpenChallenge: (challenge: Challenge) => void;
  search: string;
}) {
  const visibleChallenges = challenges.filter((challenge) => `${challenge.title} ${challenge.category} ${challenge.location}`.toLowerCase().includes(search.toLowerCase())).slice(0, 3);
  return (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow"><span className="eyebrow-dot" /> UGANDA COMMUNITY LEARNING SPACE</p><h1>Ideas into impact. <span>✦</span></h1><p className="welcome-subtitle">Start with what your community knows. See what learners can make possible.</p></div>
        <button className="button button-outline" onClick={() => onNavigate("Submit a challenge")}><Plus size={17} /> Share a challenge</button>
      </section>
      <section className="hero-card">
        <div className="hero-content">
          <div className="hero-pill"><Sparkles size={13} /> YOUR IDEAS HAVE POWER</div>
          <h2>Big change starts<br />with <em>one good question.</em></h2>
          <p>Explore challenges from nearby schools and communities. Turn local knowledge into something that matters.</p>
          <button className="button button-light" onClick={() => onNavigate("Discover challenges")}>Explore challenges <ArrowRight size={16} /></button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="art-sun" /><div className="art-leaf leaf-one"><Leaf size={54} /></div><div className="art-leaf leaf-two"><Leaf size={35} /></div>
          <div className="art-badge"><Sprout size={19} /><span>Ideas<br /><strong>grow here</strong></span></div>
          <div className="art-star star-one">✳</div><div className="art-star star-two">✦</div>
        </div>
        <span className="hero-decoration">K</span>
      </section>
      <section className="stat-grid" aria-label="Your impact at a glance">
        <StatCard icon={<Compass size={18} />} label="Published challenges" value={String(summary.publishedChallenges)} caption="Ready for learners" tone="lime" />
        <StatCard icon={<Clock3 size={18} />} label="Awaiting review" value={String(summary.pendingChallenges)} caption="Community submissions" tone="peach" />
        <StatCard icon={<Users size={18} />} label="Project teams" value={String(summary.teams)} caption="Started by learners" tone="lavender" />
        <StatCard icon={<FileText size={18} />} label="Project submissions" value={String(summary.submissions)} caption="Shared for feedback" tone="blue" />
      </section>
      <div className="content-grid">
        <section className="panel challenges-panel">
          <div className="section-heading">
            <div><p className="section-kicker">REAL COMMUNITY NEEDS</p><h2>Published challenges <span className="heading-count">{challenges.length}</span></h2></div>
            <button className="text-button" onClick={() => onNavigate("Discover challenges")}>See all <ArrowRight size={15} /></button>
          </div>
          <div className="challenge-list">
            {visibleChallenges.length
              ? visibleChallenges.map((challenge) => <ChallengeRow key={challenge.id ?? challenge.title} challenge={challenge} onClick={() => onOpenChallenge(challenge)} />)
              : <div className="empty-search">{search ? `No challenges match “${search}”.` : "No challenges have been approved for learners yet."}</div>}
          </div>
        </section>
        <section className="panel progress-panel">
          <div className="section-heading">
            <div><p className="section-kicker">LEARN TOGETHER</p><h2>Start a project team</h2></div>
            <Users size={18} />
          </div>
          <p>Choose an approved challenge, give your team a name, and work with a teacher to investigate it in your community.</p>
          <button className="button button-dark full-button" onClick={() => onNavigate("Discover challenges")}>Find a challenge <ArrowRight size={15} /></button>
        </section>
      </div>
      <section className="impact-banner">
        <div className="impact-banner-icon"><Heart size={19} /></div>
        <div><strong>Small steps, real-world impact.</strong><span>Every local challenge is a chance for students, teachers and community members to learn by doing.</span></div>
        <button className="text-button" onClick={() => onNavigate("Impact stories")}>See the impact <ArrowRight size={15} /></button>
      </section>
    </>
  );
}

function StatCard({ icon, label, value, caption, tone }: { icon: React.ReactNode; label: string; value: string; caption: string; tone: string }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-caption">{caption}</span></article>;
}

function ChallengeRow({ challenge, onClick }: { challenge: Challenge; onClick: () => void }) {
  const Icon = challenge.icon === "leaf" ? Leaf : challenge.icon === "water" ? Sprout : Lightbulb;
  return <button className="challenge-row" onClick={onClick}>
    <div className={`challenge-thumb ${challenge.color}`}><Icon size={22} strokeWidth={1.7} /></div>
    <div className="challenge-copy"><div className="challenge-title-line"><strong>{challenge.title}</strong><span className="category-chip">{challenge.category}</span></div><span className="challenge-location"><MapPin size={13} />{challenge.location}</span></div>
    <div className="challenge-facts"><span><Clock3 size={13} />{challenge.duration}</span><span><Users size={13} />{challenge.participants} teams</span></div>
    <ChevronRight className="row-chevron" size={17} />
  </button>;
}

function ChallengeBrowser({ challenges, onOpen, search, kind }: { challenges: Challenge[]; onOpen: (challenge: Challenge) => void; search: string; kind?: "community" | "school" }) {
  const [category, setCategory] = useState("All challenges");
  const categories = ["All challenges", "Environment", "Water & sanitation", "Energy"];
  const filtered = challenges.filter((challenge) =>
    (!kind || (challenge.kind ?? "community") === kind) &&
    (category === "All challenges" || challenge.category === category) &&
    `${challenge.title} ${challenge.description} ${challenge.location} ${challenge.category}`.toLowerCase().includes(search.toLowerCase()),
  );
  return <div className="inner-view">
    <div className="page-intro"><div><p className="section-kicker">LEARN BY DOING</p><h1>Find your next challenge</h1><p>Real problems. Curious minds. Solutions that start right here.</p></div><div className="intro-art"><Compass size={29} /></div></div>
    <div className="filter-bar"><div className="filter-label"><Filter size={16} /> Explore by topic</div><div className="filter-chips">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? "filter-chip-active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
    <div className="browse-count"><span>{filtered.length} {kind === "school" ? "school challenges" : "community problems"}</span><span>Sorted by <strong>recently published <ChevronDown size={13} /></strong></span></div>
    <div className="browser-list">{filtered.map((challenge) => <button className="browser-card" key={challenge.id ?? challenge.title} onClick={() => onOpen(challenge)}><div className={`browser-illustration ${challenge.color}`}><span className="illustration-orbit" /><span className="illustration-symbol">{challenge.icon === "leaf" ? <Leaf size={34} /> : challenge.icon === "water" ? <Sprout size={34} /> : <Lightbulb size={34} />}</span></div><div className="browser-card-body"><div className="browser-card-top"><span className="category-chip">{challenge.category}</span><span className="challenge-open">{challenge.kind === "school" ? "SCHOOL CHALLENGE" : "OPEN TO JOIN"}</span></div><h3>{challenge.title}</h3>{challenge.schoolName && <span className="challenge-school-name">{challenge.schoolName}</span>}<p>{challenge.description}</p><div className="browser-meta"><span><MapPin size={14} />{challenge.location}</span><span><Clock3 size={14} />{challenge.duration}</span><span><Users size={14} />{challenge.participants} teams</span></div><div className="browser-card-footer"><span className="difficulty"><span className={`difficulty-dot ${challenge.difficulty.toLowerCase()}`} />{challenge.difficulty}</span><span className="text-button">Explore challenge <ArrowRight size={14} /></span></div></div></button>)}</div>
    {!filtered.length && <div className="empty-state"><Search size={22} /><strong>No challenges found</strong><span>Try a different search or topic.</span></div>}
  </div>;
}

type StudentTeam = {
  id: string;
  name: string;
  challenge: { id: string; title: string; category: string; description: string };
  project: {
    id: string;
    title: string;
    proposedSolution: string;
    objectives: string;
    availableResources: string;
    materialsNeeded: string;
    steps: string;
    estimatedDuration: string | null;
    safetyConsiderations: string;
    expectedOutcomes: string;
    status: string;
  } | null;
  submissions: Array<{ id: string; title: string; description: string; status: string; assessment: { score: number | null; feedback: string; badge: string | null } | null }>;
};

function ProjectTeamCard({ team }: { team: StudentTeam }) {
  const [project, setProject] = useState(team.project);
  const [plan, setPlan] = useState({
    proposedSolution: team.project?.proposedSolution ?? "",
    objectives: team.project?.objectives ?? "",
    availableResources: team.project?.availableResources ?? "",
    materialsNeeded: team.project?.materialsNeeded ?? "",
    steps: team.project?.steps ?? "",
    estimatedDuration: team.project?.estimatedDuration ?? "",
    safetyConsiderations: team.project?.safetyConsiderations ?? "",
    expectedOutcomes: team.project?.expectedOutcomes ?? "",
    status: team.project?.status ?? "planning",
  });
  const [planError, setPlanError] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState("");
  const [peopleHelped, setPeopleHelped] = useState("0");
  const [materialsReused, setMaterialsReused] = useState("0");
  const [problemsAddressed, setProblemsAddressed] = useState("0");
  const [sharePublicly, setSharePublicly] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function savePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!project) return;
    setSavingPlan(true);
    setPlanError("");
    setPlanSaved(false);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save your project plan.");
      setProject(result.project);
      setPlanSaved(true);
    } catch (reason) {
      setPlanError(reason instanceof Error ? reason.message : "Could not save your project plan.");
    } finally {
      setSavingPlan(false);
    }
  }

  function updatePlan(field: keyof typeof plan, value: string) {
    setPlan((current) => ({ ...current, [field]: value }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    setSent(false);
    try {
      const links = evidence.split(/\s+/).filter(Boolean);
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: team.id,
          title,
          description,
          evidence: links,
          peopleHelped: Number(peopleHelped),
          materialsReused: Number(materialsReused),
          problemsAddressed: Number(problemsAddressed),
          sharePublicly,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit the project.");
      setTitle("");
      setDescription("");
      setEvidence("");
      setPeopleHelped("0");
      setMaterialsReused("0");
      setProblemsAddressed("0");
      setSharePublicly(false);
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not submit the project.");
    } finally {
      setSending(false);
    }
  }
  return <article className="project-card"><div className="project-card-top"><div className="project-icon project-icon-green"><Lightbulb size={20} /></div><span className="project-status">{(project?.status ?? "planning").replaceAll("-", " ").toUpperCase()}</span></div><h3>{team.challenge.title}</h3><p>{team.challenge.description}</p><div className="project-tags"><span>{team.challenge.category}</span><span>Team: {team.name}</span></div>
    {project && <form className="project-submit-form project-plan-form" onSubmit={(event) => void savePlan(event)}>
      <strong>Plan your project</strong>
      <textarea maxLength={1500} value={plan.proposedSolution} onChange={(event) => updatePlan("proposedSolution", event.target.value)} placeholder="What solution could your team try?" rows={2} />
      <textarea maxLength={3000} value={plan.objectives} onChange={(event) => updatePlan("objectives", event.target.value)} placeholder="What will your team learn or find out?" rows={2} />
      <div className="project-impact-inputs"><label>Resources nearby<textarea maxLength={1500} value={plan.availableResources} onChange={(event) => updatePlan("availableResources", event.target.value)} placeholder="What can you safely reuse?" rows={2} /></label><label>Materials needed<textarea maxLength={1500} value={plan.materialsNeeded} onChange={(event) => updatePlan("materialsNeeded", event.target.value)} placeholder="What else is needed?" rows={2} /></label></div>
      <textarea maxLength={3000} value={plan.steps} onChange={(event) => updatePlan("steps", event.target.value)} placeholder="List your steps, one per line" rows={3} />
      <div className="project-impact-inputs"><label>Time needed<input maxLength={100} value={plan.estimatedDuration} onChange={(event) => updatePlan("estimatedDuration", event.target.value)} placeholder="e.g. 3 weeks" /></label><label>Project stage<select value={plan.status} onChange={(event) => updatePlan("status", event.target.value)}><option value="planning">Planning</option><option value="building">Building</option><option value="testing">Testing</option><option value="ready-for-review">Ready for teacher review</option></select></label></div>
      <textarea maxLength={1500} value={plan.safetyConsiderations} onChange={(event) => updatePlan("safetyConsiderations", event.target.value)} placeholder="Safety: What should your team and teacher check first?" rows={2} />
      <textarea maxLength={3000} value={plan.expectedOutcomes} onChange={(event) => updatePlan("expectedOutcomes", event.target.value)} placeholder="What change do you hope to see?" rows={2} />
      {planError && <span className="form-error" role="alert">{planError}</span>}{planSaved && <span className="form-success">Project plan saved.</span>}
      <button className="button button-outline" disabled={savingPlan}>{savingPlan ? "Saving plan…" : "Save project plan"}</button>
    </form>}
    <div className="team-submissions">{team.submissions.map((submission) => <div className="student-submission" key={submission.id}><strong>{submission.title}</strong><span>{submission.status === "reviewed" ? `Teacher score: ${submission.assessment?.score ?? "—"}/5` : "Awaiting teacher feedback"}</span>{submission.assessment && <p>{submission.assessment.feedback}{submission.assessment.badge ? ` · Badge: ${submission.assessment.badge}` : ""}</p>}</div>)}</div>
    <form className="project-submit-form" onSubmit={(event) => void submit(event)}><strong>Share your team’s progress</strong><input required minLength={3} maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your idea a title" /><textarea required minLength={20} maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what you tried, what happened, and what you will change" rows={3} /><input value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Evidence links (optional, space-separated)" aria-label="Evidence links" /><div className="project-impact-inputs"><label>People helped<input type="number" min="0" max="10000" value={peopleHelped} onChange={(event) => setPeopleHelped(event.target.value)} /></label><label>Materials reused<input type="number" min="0" max="10000" value={materialsReused} onChange={(event) => setMaterialsReused(event.target.value)} /></label><label>Problems addressed<input type="number" min="0" max="10000" value={problemsAddressed} onChange={(event) => setProblemsAddressed(event.target.value)} /></label></div><label className="assessment-public"><input type="checkbox" checked={sharePublicly} onChange={(event) => setSharePublicly(event.target.checked)} /> I agree to share this work without my name or contact details in the KIVORA showcase after teacher approval.</label><small>These impact counts are your report; a teacher must review them before they can be described as verified.</small>{error && <span className="form-error" role="alert">{error}</span>}{sent && <span className="form-success">Your work was sent to your teacher for review.</span>}<button className="button button-dark" disabled={sending}>{sending ? "Submitting…" : "Submit project update"} <Send size={14} /></button></form></article>;
}

function ProjectsView() {
  const [teams, setTeams] = useState<StudentTeam[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/teams")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load projects.");
        setTeams(result.teams);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load projects."));
  }, []);
  return <div className="inner-view"><div className="page-intro"><div><p className="section-kicker">YOUR IDEAS, IN ACTION</p><h1>My projects</h1><p>Plan your approach, use resources from your community, test safely and share progress with a teacher.</p></div><div className="intro-art"><Lightbulb size={29} /></div></div>{error && <p className="form-error" role="alert">{error}</p>}{teams.length ? <div className="project-cards">{teams.map((team) => <ProjectTeamCard key={team.id} team={team} />)}</div> : <div className="empty-projects"><span className="project-icon project-icon-green"><Lightbulb size={20} /></span><h2>Your next idea starts with a challenge</h2><p>Explore a published community challenge, then choose “I’m interested” to start a team project here.</p></div>}</div>;
}

function ImpactView() {
  return (
    <div className="inner-view">
      <div className="page-intro">
        <div><p className="section-kicker">LOCAL IDEAS, SHARED PROGRESS</p><h1>Impact stories</h1><p>Community stories will appear here after learners share completed work and their community approves it.</p></div>
        <div className="intro-art"><Heart size={29} /></div>
      </div>
      <div className="empty-state"><Heart size={23} /><strong>No stories have been shared yet</strong><span>Completed work will only appear after the community agrees to share it.</span></div>
    </div>
  );
}

type TeacherProjectBrief = {
  id: string;
  projectTitle: string;
  learnerLevel: string;
  subjects: string;
  competencies: string;
  objectives: string;
  activities: string;
  materials: string;
  timeline: string;
  expectedOutcomes: string;
  assessment: string;
  safetyNote: string;
  challenge: { title: string };
};

type TeacherSubmission = {
  id: string;
  title: string;
  description: string;
  evidence: string;
  sharedPublicly: boolean;
  team: { name: string };
  challenge: { title: string };
};

function SubmissionReviewCard({ submission, onReviewed }: { submission: TeacherSubmission; onReviewed: () => void }) {
  const [score, setScore] = useState("4");
  const [feedback, setFeedback] = useState("");
  const [badge, setBadge] = useState("");
  const [publishPublicly, setPublishPublicly] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function assess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: Number(score), feedback, badge, publishPublicly }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save assessment.");
      onReviewed();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save assessment.");
    } finally {
      setSaving(false);
    }
  }
  let evidence: string[] = [];
  try {
    const parsed: unknown = JSON.parse(submission.evidence);
    if (Array.isArray(parsed)) evidence = parsed.filter((url): url is string => typeof url === "string" && /^https?:\/\//i.test(url));
  } catch {
    evidence = [];
  }
  return <article className="review-card submission-review-card"><div className="review-avatar"><FileText size={15} /></div><div className="review-card-main"><div className="review-meta"><span>STUDENT SOLUTION</span><span>·</span><span>{submission.team.name}</span></div><h3>{submission.title}</h3><p>For {submission.challenge.title}</p><div className="review-description">{submission.description}</div>{evidence.length > 0 && <div className="evidence-links">{evidence.map((url) => <a href={url} target="_blank" rel="noreferrer" key={url}>Review evidence</a>)}</div>}<form className="assessment-form" onSubmit={(event) => void assess(event)}><label>Score<select value={score} onChange={(event) => setScore(event.target.value)}>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label><label>Badge (optional)<input value={badge} maxLength={80} onChange={(event) => setBadge(event.target.value)} placeholder="e.g. Community problem-solver" /></label><label className="assessment-feedback">Feedback<textarea required minLength={5} maxLength={2000} value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Share specific, encouraging feedback" rows={2} /></label>{submission.sharedPublicly ? <label className="assessment-public"><input type="checkbox" checked={publishPublicly} onChange={(event) => setPublishPublicly(event.target.checked)} /> Approve this student-consented work for the public showcase</label> : <span className="review-text-button">Student has not opted into public sharing.</span>}{error && <span className="form-error" role="alert">{error}</span>}<button className="button button-outline small-button" disabled={saving}>{saving ? "Saving…" : "Send feedback"} <Send size={14} /></button></form></div></article>;
}

function TeacherReview({ challenges, onApprove }: { challenges: Challenge[]; onApprove: (challenge: Challenge) => Promise<void> }) {
  const [approving, setApproving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"challenges" | "briefs" | "submissions">("challenges");
  const [briefs, setBriefs] = useState<TeacherProjectBrief[]>([]);
  const [submissions, setSubmissions] = useState<TeacherSubmission[]>([]);
  const pending = challenges.filter((challenge) => challenge.status === "pending");
  useEffect(() => {
    Promise.all([fetch("/api/project-briefs"), fetch("/api/submissions")])
      .then(async ([briefResponse, submissionResponse]) => {
        const [briefResult, submissionResult] = await Promise.all([briefResponse.json(), submissionResponse.json()]);
        if (!briefResponse.ok) throw new Error(briefResult.error || "Could not load project briefs.");
        if (!submissionResponse.ok) throw new Error(submissionResult.error || "Could not load student submissions.");
        setBriefs(briefResult.briefs);
        setSubmissions(submissionResult.submissions);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load teacher reviews."));
  }, []);
  const handleApprove = async (challenge: Challenge) => {
    if (!challenge.id) return;
    setApproving(challenge.id);
    setError("");
    try {
      await onApprove(challenge);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not approve this challenge.");
    } finally {
      setApproving(null);
    }
  };
  const approveBrief = async (id: string) => {
    setApproving(id);
    setError("");
    try {
      const response = await fetch(`/api/project-briefs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not approve this project brief.");
      setBriefs((current) => current.filter((brief) => brief.id !== id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not approve this project brief.");
    } finally {
      setApproving(null);
    }
  };
  const reviewContent = tab === "challenges"
    ? (
      <div className="review-list">
        {pending.map((item) => (
          <article className="review-card" key={item.id}>
            <div className="review-avatar">KI</div>
            <div className="review-card-main">
              <div className="review-meta"><span>{item.category.toUpperCase()}</span><span>·</span><span>Community submission</span></div>
              <h3>{item.title}</h3><p>{item.location}</p>
              <div className="review-description">“{item.description}”</div>
            </div>
            <div className="review-actions">
              <button className="button button-outline small-button" disabled={approving === item.id} onClick={() => void handleApprove(item)}>
                {approving === item.id ? "Approving…" : "Approve challenge"} <Check size={15} />
              </button>
              <span className="review-text-button">Teacher approval required</span>
            </div>
          </article>
        ))}
        {pending.length === 0 && <div className="empty-state"><Check size={23} /><strong>You’re all caught up</strong><span>New community challenges will show up here.</span></div>}
      </div>
    )
    : tab === "briefs"
      ? (
        <div className="review-list">
          {briefs.map((brief) => (
            <article className="review-card" key={brief.id}>
              <div className="review-avatar"><Sparkles size={15} /></div>
              <div className="review-card-main">
                <div className="review-meta"><span>AI PROJECT BRIEF</span><span>·</span><span>For {brief.challenge.title}</span></div>
                <h3>{brief.projectTitle}</h3>
                <p>{brief.learnerLevel} · {JSON.parse(brief.subjects).join(", ")}</p>
                <div className="review-description">
                  Competencies: {JSON.parse(brief.competencies).join(" · ")}<br />
                  Learning objectives: {JSON.parse(brief.objectives).join(" · ")}<br />
                  Community project steps: {JSON.parse(brief.activities).join(" · ")}<br />
                  Possible materials: {JSON.parse(brief.materials).join(" · ")}<br />
                  Suggested timeline: {JSON.parse(brief.timeline).join(" · ")}<br />
                  Expected outcomes: {JSON.parse(brief.expectedOutcomes).join(" · ")}<br />
                  Safety: {brief.safetyNote}<br />
                  Assessment: {JSON.parse(brief.assessment).join(" · ")}
                </div>
              </div>
              <div className="review-actions">
                <button className="button button-outline small-button" disabled={approving === brief.id} onClick={() => void approveBrief(brief.id)}>
                  {approving === brief.id ? "Approving…" : "Approve project"} <Check size={15} />
                </button>
                <span className="review-text-button">Teacher review required</span>
              </div>
            </article>
          ))}
          {briefs.length === 0 && <div className="empty-state"><Check size={23} /><strong>No project briefs to review</strong><span>Generate a brief from a published challenge to begin.</span></div>}
        </div>
      )
      : (
        <div className="review-list">
          {submissions.map((submission) => (
            <SubmissionReviewCard key={submission.id} submission={submission} onReviewed={() => setSubmissions((current) => current.filter((item) => item.id !== submission.id))} />
          ))}
          {submissions.length === 0 && <div className="empty-state"><Check size={23} /><strong>No student work to review</strong><span>Student project submissions will appear here.</span></div>}
        </div>
      );
  return (
    <div className="inner-view">
      <div className="page-intro"><div><p className="section-kicker">GUIDE THE NEXT GENERATION</p><h1>Teacher review</h1><p>Review challenges, AI-generated projects and student work.</p></div><div className="review-count-card"><span>AWAITING YOUR REVIEW</span><strong>{pending.length + briefs.length + submissions.length}<small> items</small></strong></div></div>
      <div className="review-tabs">
        <button className={`review-tab ${tab === "challenges" ? "active" : ""}`} onClick={() => setTab("challenges")}>Challenges <span>{pending.length}</span></button>
        <button className={`review-tab ${tab === "briefs" ? "active" : ""}`} onClick={() => setTab("briefs")}>Project briefs <span>{briefs.length}</span></button>
        <button className={`review-tab ${tab === "submissions" ? "active" : ""}`} onClick={() => setTab("submissions")}>Student work <span>{submissions.length}</span></button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {reviewContent}
      <div className="ai-note"><Sparkles size={17} /><span><strong>AI-assisted, teacher-approved.</strong> Generated learning projects remain drafts until a teacher approves them.</span></div>
    </div>
  );
}

function SubmitChallenge({ role, onSubmit, onCancel }: { role: string; onSubmit: (challenge: Challenge) => Promise<void>; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [category, setCategory] = useState("Environment");
  const [kind, setKind] = useState<"community" | "school">("community");
  const [schoolName, setSchoolName] = useState("");
  const [peopleAffected, setPeopleAffected] = useState("");
  const [whyItMatters, setWhyItMatters] = useState("");
  const [possibleAreas, setPossibleAreas] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ title, description, location, contactPhone, category, kind, schoolName, peopleAffected, whyItMatters, possibleAreas, difficulty: "Beginner", duration: "2–3 weeks", participants: 0, color: "blue", icon: "bulb", status: "pending" });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not submit this challenge.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="inner-view">
      <div className="page-intro"><div><p className="section-kicker">YOUR COMMUNITY, YOUR IDEAS</p><h1>Share a challenge</h1><p>Tell us about a local problem or organise a school innovation challenge.</p></div><div className="intro-art"><MessageSquareText size={28} /></div></div>
      <div className="submit-layout">
        <form className="submit-form panel" onSubmit={submit}>
          <div className="form-heading"><span className="form-step">01</span><div><h2>What are you organising?</h2><p>A teacher reviews each entry before learners can join.</p></div></div>
          {role === "teacher" && <label className="form-label">Challenge type<select value={kind} onChange={(event) => setKind(event.target.value as "community" | "school")}><option value="community">Community problem</option><option value="school">School innovation challenge</option></select></label>}
          {kind === "school" && <label className="form-label">School name<input required maxLength={120} value={schoolName} onChange={(event) => setSchoolName(event.target.value)} placeholder="Name of the organising school" /></label>}
          <label className="form-label">Give your challenge a short title<input required maxLength={70} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Our school needs a greener lunch break" /></label>
          <label className="form-label">Tell us a little more<textarea required minLength={15} maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What’s happening? Who does it affect? What have you noticed?" rows={5} /><small>{description.length}/500</small></label>
          <label className="form-label">Who is affected? (optional)<input maxLength={200} value={peopleAffected} onChange={(event) => setPeopleAffected(event.target.value)} placeholder="For example: learners who use the school path" /></label>
          <label className="form-label">Why does this matter? (optional)<textarea maxLength={300} value={whyItMatters} onChange={(event) => setWhyItMatters(event.target.value)} rows={2} /></label>
          <label className="form-label">Where could learners contribute? (optional)<textarea maxLength={300} value={possibleAreas} onChange={(event) => setPossibleAreas(event.target.value)} rows={2} placeholder="Share possible directions, not a required solution." /></label>
          <div className="form-two-col">
            <label className="form-label">Where is this happening?<div className="input-with-icon"><MapPin size={16} /><input required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Community, town or school" /></div></label>
            <label className="form-label">Choose a topic<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Environment</option><option>Water & sanitation</option><option>Energy</option><option>Health & wellbeing</option><option>Community safety</option><option>Other</option></select></label>
          </div>
          {role === "community" && kind === "community" && <label className="form-label">Phone for SMS updates (optional)<input type="tel" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="+256 7XX XXX XXX" /></label>}
          <div className="form-footnote"><span><Heart size={15} /> Your contact details are never shown publicly.</span><span>Submissions are reviewed by a teacher.</span></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions"><button type="button" className="text-button" onClick={onCancel}>Cancel</button><button className="button button-dark" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send for review"} {!submitting && <Send size={15} />}</button></div>
        </form>
        <aside className="submit-aside"><div className="submit-aside-icon"><Lightbulb size={20} /></div><h3>What makes a great challenge?</h3><ul><li><Check size={14} /> It’s happening in your community</li><li><Check size={14} /> It affects people, places or nature</li><li><Check size={14} /> It leaves room for creative solutions</li></ul><div className="submit-aside-note"><Sparkles size={14} /><span>Once a teacher approves it, KIVORA can help shape it into a learning project.</span></div></aside>
      </div>
    </div>
  );
}

function ChallengeModal({ challenge, onClose, onJoin, role }: { challenge: Challenge; onClose: () => void; onJoin: (teamName: string) => Promise<void>; role: string }) {
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [learnerLevel, setLearnerLevel] = useState("Lower secondary S1–S4");
  const [teamName, setTeamName] = useState("");
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [briefError, setBriefError] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  async function generateBrief() {
    setLoadingBrief(true);
    setBriefError("");
    setBrief(null);
    try {
      const response = await fetch("/api/impact-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...challenge, learnerLevel }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not generate the project brief.");
      if (!isProjectBrief(result.brief)) throw new Error("The generated project brief is incomplete.");
      setBrief(result.brief);
    } catch (error) {
      setBriefError(error instanceof Error ? error.message : "Could not generate the project brief.");
    } finally {
      setLoadingBrief(false);
    }
  }

  async function joinProject() {
    setJoining(true);
    setJoinError("");
    try {
      if (teamName.trim().length < 2) throw new Error("Enter a name for your learning team.");
      await onJoin(teamName.trim());
    } catch (reason) {
      setJoinError(reason instanceof Error ? reason.message : "Could not join this challenge.");
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="challenge-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close icon-button" onClick={onClose} aria-label="Close challenge"><X size={19} /></button>
        <div className={`modal-art ${challenge.color}`}><div className="modal-art-orbit" /><div className="modal-art-plant"><Sparkles size={42} /></div><span className="modal-art-spark">✳</span></div>
        <div className="modal-body">
          <span className="category-chip">{challenge.category}</span>
          {challenge.kind === "school" && challenge.schoolName && <span className="challenge-school-name">{challenge.schoolName}</span>}
          <h2 id="modal-title">{challenge.title}</h2>
          <div className="modal-location"><MapPin size={14} />{challenge.location}</div>
          <p>{challenge.description}</p>
          {challenge.peopleAffected && <p className="challenge-context"><strong>Who is affected:</strong> {challenge.peopleAffected}</p>}
          {challenge.whyItMatters && <p className="challenge-context"><strong>Why it matters:</strong> {challenge.whyItMatters}</p>}
          {challenge.possibleAreas && <p className="challenge-context"><strong>Ways learners could contribute:</strong> {challenge.possibleAreas}</p>}
          <div className="modal-details">
            <span><Clock3 size={15} /><strong>{challenge.duration}</strong><small>project length</small></span>
            <span><Users size={15} /><strong>{challenge.participants} teams</strong><small>started</small></span>
            <span><GraduationCap size={15} /><strong>{challenge.difficulty}</strong><small>difficulty</small></span>
          </div>
          {role !== "community" && <><label className="form-label level-select">Uganda learner level
            <select value={learnerLevel} onChange={(event) => setLearnerLevel(event.target.value)}>
              <option>Primary P1–P7</option>
              <option>Lower secondary S1–S4</option>
              <option>Advanced secondary S5–S6</option>
            </select>
          </label>
          <button className="button button-outline full-button ai-generate-button" disabled={loadingBrief} onClick={() => void generateBrief()}>
            <Sparkles size={15} />{loadingBrief ? "Designing a learning project…" : "Generate learning project"}
          </button>
          {briefError && <p className="form-error" role="alert">{briefError}</p>}
          {brief && <ProjectBriefPreview brief={brief} />}</>}
          <div className="modal-steps"><strong>Learn with your community</strong><ol>
            <li>Listen to people affected and observe the challenge respectfully.</li>
            <li>Work with classmates and a teacher on a safe, practical idea.</li>
            <li>Share your findings and solution back with the community.</li>
          </ol></div>
          {role === "student" ? <><label className="form-label">Learning team name
            <input required minLength={2} maxLength={60} value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="Choose a name for your team" />
          </label>
          {joinError && <p className="form-error" role="alert">{joinError}</p>}
          <button className="button button-dark full-button" disabled={joining || teamName.trim().length < 2} onClick={() => void joinProject()}>
            {joining ? "Creating your team…" : "I’m interested"} {!joining && <ArrowRight size={15} />}
          </button></> : role === "teacher" ? <p className="student-safety-note">Learners can join this challenge from their supervised student accounts.</p> : null}
        </div>
      </section>
    </div>
  );
}

function isProjectBrief(value: unknown): value is ProjectBrief {
  if (!value || typeof value !== "object") return false;
  const brief = value as Record<string, unknown>;
  return typeof brief.projectTitle === "string" &&
    typeof brief.learnerLevel === "string" &&
    typeof brief.safetyNote === "string" &&
    ["subjects", "competencies", "objectives", "activities", "materials", "timeline", "expectedOutcomes", "assessment"].every(
      (key) => Array.isArray(brief[key]) && (brief[key] as unknown[]).every((item) => typeof item === "string"),
    );
}

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return <div className="toast"><span><Check size={16} /></span><strong>{message}</strong><button className="icon-button" onClick={onDismiss} aria-label="Dismiss"><X size={16} /></button></div>;
}

export default function KivoraApp({ role }: { role: string }) {
  const [activeView, setActiveView] = useState<View>("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    publishedChallenges: 0,
    pendingChallenges: 0,
    schoolChallenges: 0,
    teams: 0,
    submissions: 0,
    peopleHelped: 0,
    materialsReused: 0,
    problemsAddressed: 0,
  });
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [toast, setToast] = useState("");
  const navigateTo = useCallback((view: View) => {
    setActiveView(view);
    const url = new URL(window.location.href);
    url.pathname = "/dashboard";
    if (view === "Home") url.searchParams.delete("view");
    else url.searchParams.set("view", view);
    window.history.pushState({ view }, "", `${url.pathname}${url.search}`);
  }, []);
  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3800);
  }, []);

  useEffect(() => {
    setActiveView(viewFromUrl());
    const handlePopState = () => setActiveView(viewFromUrl());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([fetch("/api/challenges"), fetch("/api/dashboard/summary")])
      .then(async ([challengeResponse, summaryResponse]) => {
        const [challengeResult, summaryResult] = await Promise.all([challengeResponse.json(), summaryResponse.json()]);
        if (!challengeResponse.ok) throw new Error(challengeResult.error || "Could not load challenges.");
        if (!summaryResponse.ok) throw new Error(summaryResult.error || "Could not load current KIVORA activity.");
        if (active) {
          setChallenges(challengeResult.challenges);
          setSummary(summaryResult);
        }
      })
      .catch((error: unknown) => { if (active) notify(error instanceof Error ? error.message : "Could not load current KIVORA activity."); });
    return () => { active = false; };
  }, [activeView, notify]);
  const pageTitle = activeView;
  const currentView = useMemo(() => {
    switch (activeView) {
      case "Problem discovery":
      case "Discover challenges":
        return <ChallengeBrowser challenges={challenges.filter((challenge) => challenge.status !== "pending")} onOpen={setSelectedChallenge} search={search} kind="community" />;
      case "School challenges":
        return <ChallengeBrowser challenges={challenges.filter((challenge) => challenge.status !== "pending")} onOpen={setSelectedChallenge} search={search} kind="school" />;
      case "AI mentor":
        return <InnovationMentor />;
      case "Resource finder":
        return <ResourceFinder onBuildProject={() => navigateTo("Project builder")} />;
      case "Project builder":
      case "My projects":
        return <ProjectsView />;
      case "Innovation showcase":
      case "Impact stories":
        return <InnovationShowcase />;
      case "Impact tracker":
        return <ImpactTracker summary={summary} />;
      case "Teacher review":
        if (role !== "teacher" && role !== "admin") {
          return <div className="empty-state"><GraduationCap size={23} /><strong>Teacher access only</strong><span>Sign in with a verified teacher account to review work.</span></div>;
        }
        return <TeacherReview challenges={challenges} onApprove={async (challenge) => {
          const response = await fetch(`/api/challenges/${challenge.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "published" }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Could not approve this challenge.");
          setChallenges((current) => current.map((item) => item.id === challenge.id ? result.challenge : item));
          setSummary((current) => ({
            ...current,
            publishedChallenges: current.publishedChallenges + 1,
            schoolChallenges: challenge.kind === "school" ? current.schoolChallenges + 1 : current.schoolChallenges,
            pendingChallenges: Math.max(0, current.pendingChallenges - 1),
          }));
          notify(`“${challenge.title}” approved for learning`);
        }} />;
      case "Manage learners":
        if (role !== "teacher" && role !== "admin") {
          return <div className="empty-state"><GraduationCap size={23} /><strong>Teacher access only</strong><span>Only verified teachers can create supervised learner accounts.</span></div>;
        }
        return <StudentAccess />;
      case "Mobile access":
        return <MobileAccess />;
      case "Submit a challenge":
        return         <SubmitChallenge role={role} onCancel={() => navigateTo("Home")} onSubmit={async (challenge) => {
          const response = await fetch("/api/challenges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(challenge),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Could not submit this challenge.");
          setChallenges((current) => [result.challenge, ...current]);
          setSummary((current) => ({ ...current, pendingChallenges: current.pendingChallenges + 1 }));
          navigateTo("Home");
          notify("Your challenge has been sent for teacher review");
        }} />;
      default:
        if (role === "student") return <StudentHome summary={summary} onNavigate={(view) => navigateTo(view as View)} />;
        return <Dashboard challenges={challenges.filter((challenge) => challenge.status !== "pending")} summary={summary} onNavigate={navigateTo} onOpenChallenge={setSelectedChallenge} search={search} />;
    }
  }, [activeView, challenges, navigateTo, notify, role, search, summary]);

  return <div className="app-shell">
    <Sidebar
      active={activeView}
      role={role}
      onNavigate={navigateTo}
      mobileOpen={mobileOpen}
      onClose={() => setMobileOpen(false)}
      openChallengeCount={summary.publishedChallenges}
      pendingReviewCount={summary.pendingChallenges}
    />
    <main className="main-area">
      <Topbar title={pageTitle} onMenu={() => setMobileOpen(true)} query={search} onQueryChange={setSearch} onNavigate={navigateTo} searchEnabled={activeView === "Home" || activeView === "Problem discovery" || activeView === "Discover challenges" || activeView === "School challenges"} />
      <div className="page-content">{currentView}</div>
      <footer className="app-footer"><span>© 2026 KIVORA</span><span>Ideas into impact, together.</span><span>Uganda-first · Community-led</span></footer>
    </main>
    {selectedChallenge && <ChallengeModal challenge={selectedChallenge} role={role} onClose={() => setSelectedChallenge(null)} onJoin={async (teamName) => {
      if (!selectedChallenge.id) throw new Error("This challenge is not saved yet.");
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: selectedChallenge.id, teamName }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not join this challenge.");
      setSummary((current) => ({ ...current, teams: current.teams + 1 }));
      const name = selectedChallenge.title;
      setSelectedChallenge(null);
      navigateTo("Project builder");
      notify(`You’ve started a project for “${name}”`);
    }} />}
    {toast && <Toast message={toast} onDismiss={() => setToast("")} />}
  </div>;
}

const viewLabels: View[] = [
  "Home",
  "Problem discovery",
  "AI mentor",
  "Resource finder",
  "Project builder",
  "Innovation showcase",
  "Impact tracker",
  "School challenges",
  "Teacher review",
  "Manage learners",
  "Mobile access",
  "Submit a challenge",
  "Discover challenges",
  "My projects",
  "Impact stories",
];

function viewFromUrl(): View {
  if (typeof window === "undefined") return "Home";
  const view = new URLSearchParams(window.location.search).get("view");
  return viewLabels.find((label) => label === view) ?? "Home";
}
