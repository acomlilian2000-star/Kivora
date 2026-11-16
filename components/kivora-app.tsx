"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
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
import { FormEvent, useEffect, useMemo, useState } from "react";
import MobileAccess from "@/components/dashboard/mobile-access";
import ProjectBriefPreview from "@/components/dashboard/project-brief-preview";
import type { ProjectBrief } from "@/lib/types";

type View = "Home" | "Discover challenges" | "My projects" | "Impact stories" | "Teacher review" | "Mobile access" | "Submit a challenge";
type Challenge = {
  id?: string;
  status?: "pending" | "published";
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

const initialChallenges: Challenge[] = [
  {
    title: "Give plastic a second life",
    category: "Environment",
    location: "Nakasongola District, Central Uganda",
    description: "Plastic waste is blocking drainage around our trading centre and making it difficult to keep the shared space clean.",
    difficulty: "Intermediate",
    duration: "3 weeks",
    participants: 24,
    color: "mint",
    icon: "leaf",
  },
  {
    title: "Every drop counts",
    category: "Water & sanitation",
    location: "Kumi District, Eastern Uganda",
    description: "Our school loses water through small leaks. How might we make every drop count?",
    difficulty: "Beginner",
    duration: "2 weeks",
    participants: 18,
    color: "blue",
    icon: "water",
  },
  {
    title: "Light up the learning corner",
    category: "Energy",
    location: "Lamwo District, Northern Uganda",
    description: "Learners need a safe, affordable way to study after sunset when reliable electricity is not available.",
    difficulty: "Intermediate",
    duration: "4 weeks",
    participants: 12,
    color: "yellow",
    icon: "bulb",
  },
];

const navItems: { label: View; icon: typeof Activity; group?: string }[] = [
  { label: "Home", icon: Activity },
  { label: "Discover challenges", icon: Compass, group: "LEARN & CREATE" },
  { label: "My projects", icon: FileText },
  { label: "Impact stories", icon: Globe2, group: "COMMUNITY" },
  { label: "Teacher review", icon: GraduationCap, group: "FOR EDUCATORS" },
  { label: "Mobile access", icon: Smartphone, group: "COMMUNITY" },
];

function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark"><Sprout size={19} strokeWidth={2.2} /></div>
      <span>KIVORA</span>
      <span className="brand-period">.</span>
    </div>
  );
}

function Sidebar({
  active,
  onNavigate,
  mobileOpen,
  onClose,
}: {
  active: View;
  onNavigate: (view: View) => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {mobileOpen && <button className="mobile-scrim" onClick={onClose} aria-label="Close menu" />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-head">
          <Logo />
          <button className="icon-button mobile-close" onClick={onClose} aria-label="Close menu"><X size={19} /></button>
        </div>
        <button className="workspace-switch">
          <div className="workspace-avatar"><Leaf size={17} /></div>
          <span><strong>Learning space</strong><small>Nakasongola Community School</small></span>
          <ChevronDown size={15} />
        </button>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon, group }) => (
            <div key={label}>
              {group && <div className="nav-group-label">{group}</div>}
              <button
                className={`nav-link ${active === label ? "nav-link-active" : ""}`}
                onClick={() => { onNavigate(label); onClose(); }}
              >
                <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
                {label === "Teacher review" && <span className="nav-count">4</span>}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="impact-mini">
            <div className="impact-mini-icon"><Heart size={16} /></div>
            <div><strong>You’re making a difference</strong><span>3 projects in your community</span></div>
            <ArrowUpRight size={15} />
          </div>
          <button className="nav-link help-link"><CircleHelp size={18} /><span>Help & support</span></button>
          <div className="profile">
            <div className="profile-photo">AM</div>
            <div className="profile-info"><strong>Amina M.</strong><span>Learner · Senior 2</span></div>
            <button className="icon-button profile-menu" aria-label="Profile menu"><ChevronDown size={16} /></button>
          </div>
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
}: {
  title: View;
  onMenu: () => void;
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
        <span>Workspace</span><ChevronRight size={14} /><strong>{title}</strong>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={16} />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search anything..." aria-label="Search anything" />
          <kbd>⌘ K</kbd>
        </label>
        <div className="notification-wrap">
          <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}>
            <Bell size={18} /><span className="notification-dot" />
          </button>
          {notificationsOpen && <div className="notification-popover">
            <div className="popover-heading"><strong>Notifications</strong><span>2 new</span></div>
            <div className="notification-item"><span className="notification-icon green"><Check size={15} /></span><div><strong>Your idea got noticed!</strong><p>Ms. Neema left feedback on your project.</p><small>12 min ago</small></div></div>
            <div className="notification-item"><span className="notification-icon orange"><Sparkles size={15} /></span><div><strong>New challenge near you</strong><p>A water conservation challenge in a nearby village.</p><small>1 hour ago</small></div></div>
            <button className="popover-link" onClick={() => setNotificationsOpen(false)}>View all notifications <ArrowRight size={14} /></button>
          </div>}
        </div>
        <div className="topbar-divider" />
        <button className="topbar-avatar" aria-label="Amina M. profile">AM</button>
      </div>
    </header>
  );
}

function Dashboard({
  challenges,
  onNavigate,
  onOpenChallenge,
  search,
}: {
  challenges: Challenge[];
  onNavigate: (view: View) => void;
  onOpenChallenge: (challenge: Challenge) => void;
  search: string;
}) {
  const visibleChallenges = challenges.filter((challenge) => `${challenge.title} ${challenge.category} ${challenge.location}`.toLowerCase().includes(search.toLowerCase())).slice(0, 3);
  return (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow"><span className="eyebrow-dot" /> YOUR COMMUNITY LEARNING SPACE</p><h1>Good morning, Amina <span>✦</span></h1><p className="welcome-subtitle">Start with what your community knows. See what your school can make possible.</p></div>
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
        <StatCard icon={<Lightbulb size={18} />} label="Ideas in motion" value="02" caption="+1 this month" tone="lime" trend="up" />
        <StatCard icon={<Users size={18} />} label="Team collaborators" value="08" caption="Across 2 projects" tone="peach" />
        <StatCard icon={<Target size={18} />} label="Community reach" value="124" caption="People reached" tone="lavender" trend="up" />
        <StatCard icon={<Activity size={18} />} label="Learning streak" value="06 days" caption="You’re on a roll!" tone="blue" />
      </section>
      <div className="content-grid">
        <section className="panel challenges-panel">
          <div className="section-heading">
            <div><p className="section-kicker">MAKE A DIFFERENCE</p><h2>Challenges near you <span className="heading-count">03</span></h2></div>
            <button className="text-button" onClick={() => onNavigate("Discover challenges")}>See all <ArrowRight size={15} /></button>
          </div>
          <div className="challenge-list">
            {visibleChallenges.length ? visibleChallenges.map((challenge) => <ChallengeRow key={challenge.title} challenge={challenge} onClick={() => onOpenChallenge(challenge)} />) : <div className="empty-search">No challenges match “{search}”. Try another search.</div>}
          </div>
        </section>
        <section className="panel progress-panel">
          <div className="section-heading">
            <div><p className="section-kicker">YOUR LEARNING JOURNEY</p><h2>Keep it growing</h2></div>
            <button className="icon-button subtle-icon" aria-label="More journey options"><ArrowUpRight size={16} /></button>
          </div>
          <div className="progress-project">
            <div className="project-icon project-icon-green"><Sprout size={18} /></div>
            <div className="project-meta"><strong>Plastic, reimagined</strong><span>Environmental science · Team of 4</span></div>
            <span className="project-status">IN PROGRESS</span>
          </div>
          <div className="progress-label"><span>Project progress</span><strong>68%</strong></div>
          <div className="progress-track"><span style={{ width: "68%" }} /></div>
          <div className="next-step"><span className="next-step-icon"><Clock3 size={15} /></span><span><strong>Up next</strong><small>Share your prototype with your teacher</small></span><ChevronRight size={16} /></div>
          <button className="button button-dark full-button" onClick={() => onNavigate("My projects")}>Continue your project <ArrowRight size={15} /></button>
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

function StatCard({ icon, label, value, caption, tone, trend }: { icon: React.ReactNode; label: string; value: string; caption: string; tone: string; trend?: "up" }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className={`stat-caption ${trend ? "positive" : ""}`}>{trend && <ArrowUpRight size={13} />}{caption}</span></article>;
}

function ChallengeRow({ challenge, onClick }: { challenge: Challenge; onClick: () => void }) {
  const Icon = challenge.icon === "leaf" ? Leaf : challenge.icon === "water" ? Sprout : Lightbulb;
  return <button className="challenge-row" onClick={onClick}>
    <div className={`challenge-thumb ${challenge.color}`}><Icon size={22} strokeWidth={1.7} /></div>
    <div className="challenge-copy"><div className="challenge-title-line"><strong>{challenge.title}</strong><span className="category-chip">{challenge.category}</span></div><span className="challenge-location"><MapPin size={13} />{challenge.location}</span></div>
    <div className="challenge-facts"><span><Clock3 size={13} />{challenge.duration}</span><span><Users size={13} />{challenge.participants} curious minds</span></div>
    <ChevronRight className="row-chevron" size={17} />
  </button>;
}

function ChallengeBrowser({ challenges, onOpen, search }: { challenges: Challenge[]; onOpen: (challenge: Challenge) => void; search: string }) {
  const [category, setCategory] = useState("All challenges");
  const categories = ["All challenges", "Environment", "Water & sanitation", "Energy"];
  const filtered = challenges.filter((challenge) =>
    (category === "All challenges" || challenge.category === category) &&
    `${challenge.title} ${challenge.description} ${challenge.location} ${challenge.category}`.toLowerCase().includes(search.toLowerCase()),
  );
  return <div className="inner-view">
    <div className="page-intro"><div><p className="section-kicker">LEARN BY DOING</p><h1>Find your next challenge</h1><p>Real problems. Curious minds. Solutions that start right here.</p></div><div className="intro-art"><Compass size={29} /></div></div>
    <div className="filter-bar"><div className="filter-label"><Filter size={16} /> Explore by topic</div><div className="filter-chips">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? "filter-chip-active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
    <div className="browse-count"><span>{filtered.length} open challenges</span><span>Sorted by <strong>closest to you <ChevronDown size={13} /></strong></span></div>
    <div className="browser-list">{filtered.map((challenge) => <button className="browser-card" key={challenge.title} onClick={() => onOpen(challenge)}><div className={`browser-illustration ${challenge.color}`}><span className="illustration-orbit" /><span className="illustration-symbol">{challenge.icon === "leaf" ? <Leaf size={34} /> : challenge.icon === "water" ? <Sprout size={34} /> : <Lightbulb size={34} />}</span></div><div className="browser-card-body"><div className="browser-card-top"><span className="category-chip">{challenge.category}</span><span className="challenge-open">OPEN TO JOIN</span></div><h3>{challenge.title}</h3><p>{challenge.description}</p><div className="browser-meta"><span><MapPin size={14} />{challenge.location}</span><span><Clock3 size={14} />{challenge.duration}</span><span><Users size={14} />{challenge.participants} students</span></div><div className="browser-card-footer"><span className="difficulty"><span className={`difficulty-dot ${challenge.difficulty.toLowerCase()}`} />{challenge.difficulty}</span><span className="text-button">Explore challenge <ArrowRight size={14} /></span></div></div></button>)}</div>
    {!filtered.length && <div className="empty-state"><Search size={22} /><strong>No challenges found</strong><span>Try a different search or topic.</span></div>}
  </div>;
}

type StudentTeam = {
  id: string;
  name: string;
  challenge: { id: string; title: string; category: string; description: string };
  members: Array<{ user: { name: string } }>;
  submissions: Array<{ id: string; title: string; description: string; status: string; assessment: { score: number | null; feedback: string; badge: string | null } | null }>;
};

function ProjectTeamCard({ team }: { team: StudentTeam }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
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
        body: JSON.stringify({ teamId: team.id, title, description, evidence: links }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit the project.");
      setTitle("");
      setDescription("");
      setEvidence("");
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not submit the project.");
    } finally {
      setSending(false);
    }
  }
  return <article className="project-card"><div className="project-card-top"><div className="project-icon project-icon-green"><Sprout size={20} /></div><span className="project-status">IN PROGRESS</span></div><h3>{team.challenge.title}</h3><p>{team.challenge.description}</p><div className="project-tags"><span>{team.challenge.category}</span><span>{team.members.length} team member{team.members.length === 1 ? "" : "s"}</span></div>
    <div className="team-submissions">{team.submissions.map((submission) => <div className="student-submission" key={submission.id}><strong>{submission.title}</strong><span>{submission.status === "reviewed" ? `Teacher score: ${submission.assessment?.score ?? "—"}/5` : "Awaiting teacher feedback"}</span>{submission.assessment && <p>{submission.assessment.feedback}{submission.assessment.badge ? ` · Badge: ${submission.assessment.badge}` : ""}</p>}</div>)}</div>
    <form className="project-submit-form" onSubmit={(event) => void submit(event)}><strong>Share your team’s progress</strong><input required minLength={3} maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your idea a title" /><textarea required minLength={20} maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe your proposed solution or progress" rows={3} /><input value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Evidence links (optional, space-separated)" aria-label="Evidence links" />{error && <span className="form-error" role="alert">{error}</span>}{sent && <span className="form-success">Your work was sent to your teacher for review.</span>}<button className="button button-dark" disabled={sending}>{sending ? "Submitting…" : "Submit project update"} <Send size={14} /></button></form></article>;
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
  return <div className="inner-view"><div className="page-intro"><div><p className="section-kicker">YOUR IDEAS, IN ACTION</p><h1>My projects</h1><p>Join a challenge, bring your team together and share your solution with a teacher.</p></div><div className="intro-art"><Lightbulb size={29} /></div></div>{error && <p className="form-error" role="alert">{error}</p>}{teams.length ? <div className="project-cards">{teams.map((team) => <ProjectTeamCard key={team.id} team={team} />)}</div> : <div className="empty-projects"><span className="project-icon project-icon-green"><Sprout size={20} /></span><h2>Your next idea starts with a challenge</h2><p>Explore a published community challenge, then choose “I’m interested” to start a team project here.</p></div>}</div>;
}

function ImpactView() {
  return (
    <div className="inner-view">
      <div className="page-intro">
        <div><p className="section-kicker">LOCAL IDEAS, SHARED PROGRESS</p><h1>Impact stories</h1><p>Examples of how rural schools can learn from the challenges around them.</p></div>
        <div className="intro-art"><Heart size={29} /></div>
      </div>
      <div className="impact-stats-row">
        <div><span>CHALLENGES SOLVED</span><strong>42</strong><small>Across 6 communities</small></div>
        <div><span>STUDENTS CREATING</span><strong>316</strong><small>Curiosity in action</small></div>
        <div><span>LOCAL PARTNERS</span><strong>18</strong><small>Growing together</small></div>
      </div>
      <div className="story-grid">
        <article className="story-card">
          <div className="story-art story-art-green"><div className="story-sun" /><div className="story-leaf"><Leaf size={60} /></div><span className="story-number">01</span></div>
          <div className="story-body"><span className="story-category">WATER · KUMI</span><h3>A school garden that grows with less</h3><p>Learners map how water is used at school and explore safe ways to conserve water during dry periods.</p><div className="story-author"><span className="author-avatar">JN</span><span><strong>Juma & the Green Crew</strong><small>Kumi District · Example project</small></span><ArrowUpRight size={16} /></div></div>
        </article>
        <article className="story-card">
          <div className="story-art story-art-blue"><div className="story-wave wave-a" /><div className="story-wave wave-b" /><div className="story-drop">✳</div><span className="story-number">02</span></div>
          <div className="story-body"><span className="story-category">ENERGY · LAMWO</span><h3>More light for an after-school study group</h3><p>A learner team compares safe, low-cost lighting options and shares a plan with families and teachers.</p><div className="story-author"><span className="author-avatar author-blue">AM</span><span><strong>Amina’s team</strong><small>Lamwo District · Example project</small></span><ArrowUpRight size={16} /></div></div>
        </article>
      </div>
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
  assessment: string;
  challenge: { title: string };
};

type TeacherSubmission = {
  id: string;
  title: string;
  description: string;
  evidence: string;
  team: { name: string };
  challenge: { title: string };
};

function SubmissionReviewCard({ submission, onReviewed }: { submission: TeacherSubmission; onReviewed: () => void }) {
  const [score, setScore] = useState("4");
  const [feedback, setFeedback] = useState("");
  const [badge, setBadge] = useState("");
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
        body: JSON.stringify({ score: Number(score), feedback, badge }),
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
  const evidence = JSON.parse(submission.evidence) as string[];
  return <article className="review-card submission-review-card"><div className="review-avatar"><FileText size={15} /></div><div className="review-card-main"><div className="review-meta"><span>STUDENT SOLUTION</span><span>·</span><span>{submission.team.name}</span></div><h3>{submission.title}</h3><p>For {submission.challenge.title}</p><div className="review-description">{submission.description}</div>{evidence.length > 0 && <div className="evidence-links">{evidence.map((url) => <a href={url} target="_blank" rel="noreferrer" key={url}>{url}</a>)}</div>}<form className="assessment-form" onSubmit={(event) => void assess(event)}><label>Score<select value={score} onChange={(event) => setScore(event.target.value)}>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label><label>Badge (optional)<input value={badge} onChange={(event) => setBadge(event.target.value)} placeholder="e.g. Community champion" /></label><label className="assessment-feedback">Feedback<textarea required minLength={5} value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Share specific, encouraging feedback" rows={2} /></label>{error && <span className="form-error" role="alert">{error}</span>}<button className="button button-outline small-button" disabled={saving}>{saving ? "Saving…" : "Send feedback"} <Send size={14} /></button></form></div></article>;
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
    ? <div className="review-list">{pending.map((item) => <article className="review-card" key={item.id}><div className="review-avatar">KI</div><div className="review-card-main"><div className="review-meta"><span>{item.category.toUpperCase()}</span><span>·</span><span>Community submission</span></div><h3>{item.title}</h3><p>{item.location}</p><div className="review-description">“{item.description}”</div></div><div className="review-actions"><button className="button button-outline small-button" disabled={approving === item.id} onClick={() => void handleApprove(item)}>{approving === item.id ? "Approving…" : "Approve challenge"} <Check size={15} /></button><span className="review-text-button">Teacher approval required</span></div></article>)}{pending.length === 0 && <div className="empty-state"><Check size={23} /><strong>You’re all caught up</strong><span>New community challenges will show up here.</span></div>}</div>
    : tab === "briefs"
      ? <div className="review-list">{briefs.map((brief) => <article className="review-card" key={brief.id}><div className="review-avatar"><Sparkles size={15} /></div><div className="review-card-main"><div className="review-meta"><span>AI PROJECT BRIEF</span><span>·</span><span>For {brief.challenge.title}</span></div><h3>{brief.projectTitle}</h3><p>Subjects: {JSON.parse(brief.subjects).join(", ")}</p><div className="review-description">Objectives: {JSON.parse(brief.objectives).join(" · ")}</div></div><div className="review-actions"><button className="button button-outline small-button" disabled={approving === brief.id} onClick={() => void approveBrief(brief.id)}>{approving === brief.id ? "Approving…" : "Approve project"} <Check size={15} /></button><span className="review-text-button">Teacher review required</span></div></article>)}{briefs.length === 0 && <div className="empty-state"><Check size={23} /><strong>No project briefs to review</strong><span>Generate a brief from a published challenge to begin.</span></div>}</div>
      : <div className="review-list">{submissions.map((submission) => <SubmissionReviewCard key={submission.id} submission={submission} onReviewed={() => setSubmissions((current) => current.filter((item) => item.id !== submission.id))} />)}{submissions.length === 0 && <div className="empty-state"><Check size={23} /><strong>No student work to review</strong><span>Student project submissions will appear here.</span></div>}</div>;
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

function SubmitChallenge({ onSubmit, onCancel }: { onSubmit: (challenge: Challenge) => Promise<void>; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [category, setCategory] = useState("Environment");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ title, description, location, contactPhone, category, difficulty: "Beginner", duration: "2–3 weeks", participants: 0, color: "mint", icon: "leaf", status: "pending" });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not submit this challenge.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="inner-view">
      <div className="page-intro"><div><p className="section-kicker">YOUR COMMUNITY, YOUR IDEAS</p><h1>Share a challenge</h1><p>Tell us about a local problem. It could become someone’s next big idea.</p></div><div className="intro-art"><MessageSquareText size={28} /></div></div>
      <div className="submit-layout">
        <form className="submit-form panel" onSubmit={submit}>
          <div className="form-heading"><span className="form-step">01</span><div><h2>What needs solving?</h2><p>A few details help us connect this challenge with curious minds.</p></div></div>
          <label className="form-label">Give your challenge a short title<input required maxLength={70} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Our school needs a greener lunch break" /></label>
          <label className="form-label">Tell us a little more<textarea required minLength={15} maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What’s happening? Who does it affect? What have you noticed?" rows={5} /><small>{description.length}/500</small></label>
          <div className="form-two-col">
            <label className="form-label">Where is this happening?<div className="input-with-icon"><MapPin size={16} /><input required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Community, town or school" /></div></label>
            <label className="form-label">Choose a topic<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Environment</option><option>Water & sanitation</option><option>Energy</option><option>Health & wellbeing</option><option>Community safety</option><option>Other</option></select></label>
          </div>
          <label className="form-label">Phone for SMS updates (optional)<input type="tel" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="+255 7XX XXX XXX" /></label>
          <div className="form-footnote"><span><Heart size={15} /> Your contact details are never shown publicly.</span><span>Submissions are reviewed by a teacher.</span></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions"><button type="button" className="text-button" onClick={onCancel}>Cancel</button><button className="button button-dark" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send for review"} {!submitting && <Send size={15} />}</button></div>
        </form>
        <aside className="submit-aside"><div className="submit-aside-icon"><Lightbulb size={20} /></div><h3>What makes a great challenge?</h3><ul><li><Check size={14} /> It’s happening in your community</li><li><Check size={14} /> It affects people, places or nature</li><li><Check size={14} /> It leaves room for creative solutions</li></ul><div className="submit-aside-note"><Sparkles size={14} /><span>Once a teacher approves it, KIVORA can help shape it into a learning project.</span></div></aside>
      </div>
    </div>
  );
}

function ChallengeModal({ challenge, onClose, onJoin }: { challenge: Challenge; onClose: () => void; onJoin: () => Promise<void> }) {
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [learnerLevel, setLearnerLevel] = useState("Lower secondary S1–S4");
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
      await onJoin();
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
        <div className={`modal-art ${challenge.color}`}><div className="modal-art-orbit" /><div className="modal-art-plant"><Sprout size={52} /></div><span className="modal-art-spark">✳</span></div>
        <div className="modal-body">
          <span className="category-chip">{challenge.category}</span>
          <h2 id="modal-title">{challenge.title}</h2>
          <div className="modal-location"><MapPin size={14} />{challenge.location}</div>
          <p>{challenge.description}</p>
          <div className="modal-details">
            <span><Clock3 size={15} /><strong>{challenge.duration}</strong><small>project length</small></span>
            <span><Users size={15} /><strong>{challenge.participants} learners</strong><small>already curious</small></span>
            <span><GraduationCap size={15} /><strong>{challenge.difficulty}</strong><small>difficulty</small></span>
          </div>
          <label className="form-label level-select">Uganda learner level
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
          {brief && <ProjectBriefPreview brief={brief} />}
          <div className="modal-steps"><strong>Learn with your community</strong><ol>
            <li>Listen to people affected and observe the challenge respectfully.</li>
            <li>Work with classmates and a teacher on a safe, practical idea.</li>
            <li>Share your findings and solution back with the community.</li>
          </ol></div>
          {joinError && <p className="form-error" role="alert">{joinError}</p>}
          <button className="button button-dark full-button" disabled={joining} onClick={() => void joinProject()}>
            {joining ? "Creating your team…" : "I’m interested"} {!joining && <ArrowRight size={15} />}
          </button>
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
    ["subjects", "competencies", "objectives", "activities", "assessment"].every(
      (key) => Array.isArray(brief[key]) && (brief[key] as unknown[]).every((item) => typeof item === "string"),
    );
}

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return <div className="toast"><span><Check size={16} /></span><strong>{message}</strong><button className="icon-button" onClick={onDismiss} aria-label="Dismiss"><X size={16} /></button></div>;
}

export default function KivoraApp() {
  const [activeView, setActiveView] = useState<View>("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [challenges, setChallenges] = useState(initialChallenges);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [toast, setToast] = useState("");
  useEffect(() => {
    fetch("/api/challenges")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load challenges.");
        setChallenges(result.challenges);
      })
      .catch((error: unknown) => setToast(error instanceof Error ? error.message : "Could not load challenges."));
  }, []);
  const pageTitle = activeView;
  const currentView = useMemo(() => {
    switch (activeView) {
      case "Discover challenges":
        return <ChallengeBrowser challenges={challenges.filter((challenge) => challenge.status !== "pending")} onOpen={setSelectedChallenge} search={search} />;
      case "My projects":
        return <ProjectsView />;
      case "Impact stories":
        return <ImpactView />;
      case "Teacher review":
        return <TeacherReview challenges={challenges} onApprove={async (challenge) => {
          const response = await fetch(`/api/challenges/${challenge.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "published" }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Could not approve this challenge.");
          setChallenges((current) => current.map((item) => item.id === challenge.id ? result.challenge : item));
          notify(`“${challenge.title}” approved for learning`);
        }} />;
      case "Mobile access":
        return <MobileAccess />;
      case "Submit a challenge":
        return <SubmitChallenge onCancel={() => setActiveView("Home")} onSubmit={async (challenge) => {
          const response = await fetch("/api/challenges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(challenge),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Could not submit this challenge.");
          setChallenges((current) => [result.challenge, ...current]);
          setActiveView("Home");
          notify("Your challenge has been sent for teacher review");
        }} />;
      default:
        return <Dashboard challenges={challenges.filter((challenge) => challenge.status !== "pending")} onNavigate={setActiveView} onOpenChallenge={setSelectedChallenge} search={search} />;
    }
  }, [activeView, challenges, search]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3800);
  }

  return <div className="app-shell">
    <Sidebar active={activeView} onNavigate={setActiveView} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    <main className="main-area">
      <Topbar title={pageTitle} onMenu={() => setMobileOpen(true)} query={search} onQueryChange={setSearch} />
      <div className="page-content">{currentView}</div>
      <footer className="app-footer"><span>© 2026 KIVORA</span><span>Ideas into impact, together.</span><span><span className="footer-status" /> All systems growing</span></footer>
    </main>
    {selectedChallenge && <ChallengeModal challenge={selectedChallenge} onClose={() => setSelectedChallenge(null)} onJoin={async () => {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: selectedChallenge.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not join this challenge.");
      const name = selectedChallenge.title;
      setSelectedChallenge(null);
      setActiveView("My projects");
      notify(`You’ve started a project for “${name}”`);
    }} />}
    {toast && <Toast message={toast} onDismiss={() => setToast("")} />}
  </div>;
}
