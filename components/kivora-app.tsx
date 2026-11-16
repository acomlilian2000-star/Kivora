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
  Sparkles,
  Sprout,
  Target,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type View = "Home" | "Discover challenges" | "My projects" | "Impact stories" | "Teacher review" | "Submit a challenge";
type Challenge = {
  id?: string;
  status?: "pending" | "published";
  title: string;
  category: string;
  location: string;
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
    location: "Kariakoo Market, Dar es Salaam",
    description: "Plastic waste is blocking drainage and affecting the cleanliness of our local market.",
    difficulty: "Intermediate",
    duration: "3 weeks",
    participants: 24,
    color: "mint",
    icon: "leaf",
  },
  {
    title: "Every drop counts",
    category: "Water & sanitation",
    location: "Moshi, Kilimanjaro",
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
    location: "Mwanza, Lake Zone",
    description: "Students need a safe, low-cost way to keep reading when the sun goes down.",
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
          <span><strong>Learning space</strong><small>Upanga Secondary</small></span>
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
            <div className="profile-info"><strong>Amina M.</strong><span>Student · Form 3</span></div>
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
            <div className="notification-item"><span className="notification-icon orange"><Sparkles size={15} /></span><div><strong>New challenge near you</strong><p>A water conservation challenge in Upanga.</p><small>1 hour ago</small></div></div>
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
        <div><p className="eyebrow"><span className="eyebrow-dot" /> MONDAY, 16 NOVEMBER 2026</p><h1>Good morning, Amina <span>✦</span></h1><p className="welcome-subtitle">A little curiosity can change a whole community. What will you make happen?</p></div>
        <button className="button button-outline" onClick={() => onNavigate("Submit a challenge")}><Plus size={17} /> Share a challenge</button>
      </section>
      <section className="hero-card">
        <div className="hero-content">
          <div className="hero-pill"><Sparkles size={13} /> YOUR IDEAS HAVE POWER</div>
          <h2>Big change starts<br />with <em>one good question.</em></h2>
          <p>Explore real challenges from your community and turn what you learn into something that matters.</p>
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
        <div><strong>Small steps, real-world impact.</strong><span>Your community has shared 18 challenges this month. Every one is a chance to learn by doing.</span></div>
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

function ProjectsView() {
  return <div className="inner-view"><div className="page-intro"><div><p className="section-kicker">YOUR IDEAS, IN ACTION</p><h1>My projects</h1><p>Every great solution starts somewhere. Here’s where yours are growing.</p></div><div className="intro-art"><Lightbulb size={29} /></div></div><div className="project-cards"><article className="project-card"><div className="project-card-top"><div className="project-icon project-icon-green"><Sprout size={20} /></div><span className="project-status">IN PROGRESS</span></div><h3>Plastic, reimagined</h3><p>A student-led plan to make waste sorting simple and useful at Kariakoo market.</p><div className="project-tags"><span>Environmental science</span><span>Entrepreneurship</span></div><div className="project-card-progress"><div className="progress-label"><span>Project progress</span><strong>68%</strong></div><div className="progress-track"><span style={{ width: "68%" }} /></div></div><div className="project-card-bottom"><div className="avatar-stack"><span>AM</span><span>JN</span><span>+2</span></div><span>Next: prototype feedback</span><ArrowRight size={16} /></div></article><article className="project-card project-card-muted"><div className="project-card-top"><div className="project-icon project-icon-blue"><BookOpen size={20} /></div><span className="project-status status-review">TEACHER REVIEW</span></div><h3>Water-wise classroom</h3><p>Measuring water use and finding small fixes with a big impact at school.</p><div className="project-tags"><span>Mathematics</span><span>Science</span></div><div className="project-card-progress"><div className="progress-label"><span>Project progress</span><strong>92%</strong></div><div className="progress-track blue-track"><span style={{ width: "92%" }} /></div></div><div className="project-card-bottom"><div className="avatar-stack"><span>AM</span><span>+3</span></div><span>Submitted 2 days ago</span><ArrowRight size={16} /></div></article><button className="new-project-card"><span><Plus size={20} /></span><strong>Start something new</strong><small>Choose a community challenge and bring your team together.</small><span className="new-project-link">Browse challenges <ArrowRight size={14} /></span></button></div></div>;
}

function ImpactView() {
  return <div className="inner-view"><div className="page-intro"><div><p className="section-kicker">CHANGE, TOGETHER</p><h1>Impact stories</h1><p>See what happens when young people take on the challenges around them.</p></div><div className="intro-art"><Heart size={29} /></div></div><div className="impact-stats-row"><div><span>CHALLENGES SOLVED</span><strong>42</strong><small>Across 6 communities</small></div><div><span>STUDENTS CREATING</span><strong>316</strong><small>Curiosity in action</small></div><div><span>LOCAL PARTNERS</span><strong>18</strong><small>Growing together</small></div></div><div className="story-grid"><article className="story-card"><div className="story-art story-art-green"><div className="story-sun" /><div className="story-leaf"><Leaf size={60} /></div><span className="story-number">01</span></div><div className="story-body"><span className="story-category">ENVIRONMENT · DAR ES SALAAM</span><h3>From discarded plastic to market planters</h3><p>Students teamed up with market vendors to turn everyday plastic waste into a cleaner, greener space.</p><div className="story-author"><span className="author-avatar">FK</span><span><strong>Fatma’s team</strong><small>Upanga Secondary · 3 weeks ago</small></span><ArrowUpRight size={16} /></div></div></article><article className="story-card"><div className="story-art story-art-blue"><div className="story-wave wave-a" /><div className="story-wave wave-b" /><div className="story-drop">✳</div><span className="story-number">02</span></div><div className="story-body"><span className="story-category">WATER · MOSHI</span><h3>A school garden that grows with less</h3><p>A simple rainwater collection model helped one school care for its garden through the dry season.</p><div className="story-author"><span className="author-avatar author-blue">JN</span><span><strong>Juma & the Green Crew</strong><small>Moshi Secondary · 1 month ago</small></span><ArrowUpRight size={16} /></div></div></article></div></div>;
}

function TeacherReview({ challenges, onApprove }: { challenges: Challenge[]; onApprove: (challenge: Challenge) => Promise<void> }) {
  const [approving, setApproving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const pending = challenges.filter((challenge) => challenge.status === "pending");
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
  return <div className="inner-view"><div className="page-intro"><div><p className="section-kicker">GUIDE THE NEXT GENERATION</p><h1>Teacher review</h1><p>Review community challenges before they become learning opportunities.</p></div><div className="review-count-card"><span>AWAITING YOUR REVIEW</span><strong>{pending.length}<small> submissions</small></strong></div></div><div className="review-tabs"><button className="review-tab active">Needs review <span>{pending.length}</span></button><button className="review-tab">Project briefs <span>0</span></button><button className="review-tab">Recently approved</button></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="review-list">{pending.map((item) => <article className="review-card" key={item.id}><div className="review-avatar">KI</div><div className="review-card-main"><div className="review-meta"><span>{item.category.toUpperCase()}</span><span>·</span><span>Community submission</span></div><h3>{item.title}</h3><p>{item.location}</p><div className="review-description">“{item.description}”</div></div><div className="review-actions"><button className="button button-outline small-button" disabled={approving === item.id} onClick={() => void handleApprove(item)}>{approving === item.id ? "Approving…" : "Approve challenge"} <Check size={15} /></button><span className="review-text-button">Teacher approval required</span></div></article>)}{pending.length === 0 && <div className="empty-state"><Check size={23} /><strong>You’re all caught up</strong><span>New community challenges will show up here.</span></div>}</div><div className="ai-note"><Sparkles size={17} /><span><strong>AI-assisted, teacher-approved.</strong> KIVORA can suggest learning objectives and activities, but you stay in control of what students see.</span></div></div>;
}

function SubmitChallenge({ onSubmit, onCancel }: { onSubmit: (challenge: Challenge) => Promise<void>; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Environment");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ title, description, location, category, difficulty: "Beginner", duration: "2–3 weeks", participants: 0, color: "mint", icon: "leaf", status: "pending" });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not submit this challenge.");
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="inner-view"><div className="page-intro"><div><p className="section-kicker">YOUR COMMUNITY, YOUR IDEAS</p><h1>Share a challenge</h1><p>Tell us about a local problem. It could become someone’s next big idea.</p></div><div className="intro-art"><MessageSquareText size={28} /></div></div><div className="submit-layout"><form className="submit-form panel" onSubmit={submit}><div className="form-heading"><span className="form-step">01</span><div><h2>What needs solving?</h2><p>A few details help us connect this challenge with curious minds.</p></div></div><label className="form-label">Give your challenge a short title<input required maxLength={70} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Our school needs a greener lunch break" /></label><label className="form-label">Tell us a little more<textarea required minLength={15} maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What’s happening? Who does it affect? What have you noticed?" rows={5} /><small>{description.length}/500</small></label><div className="form-two-col"><label className="form-label">Where is this happening?<div className="input-with-icon"><MapPin size={16} /><input required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Community, town or school" /></div></label><label className="form-label">Choose a topic<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Environment</option><option>Water & sanitation</option><option>Energy</option><option>Health & wellbeing</option><option>Community safety</option><option>Other</option></select></label></div><div className="form-footnote"><span><Heart size={15} /> Your contact details are never shown publicly.</span><span>Submissions are reviewed by a teacher.</span></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions"><button type="button" className="text-button" onClick={onCancel}>Cancel</button><button className="button button-dark" type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send for review"} {!submitting && <Send size={15} />}</button></div></form><aside className="submit-aside"><div className="submit-aside-icon"><Lightbulb size={20} /></div><h3>What makes a great challenge?</h3><ul><li><Check size={14} /> It’s happening in your community</li><li><Check size={14} /> It affects people, places or nature</li><li><Check size={14} /> It leaves room for creative solutions</li></ul><div className="submit-aside-note"><Sparkles size={14} /><span>Once a teacher approves it, KIVORA can help shape it into a learning project.</span></div></aside></div></div>;
}

function ChallengeModal({ challenge, onClose, onJoin }: { challenge: Challenge; onClose: () => void; onJoin: () => void }) {
  const [brief, setBrief] = useState<Record<string, unknown> | null>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [briefError, setBriefError] = useState("");

  async function generateBrief() {
    setLoadingBrief(true);
    setBriefError("");
    setBrief(null);
    try {
      const response = await fetch("/api/impact-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(challenge),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not generate the project brief.");
      setBrief(result.brief);
    } catch (error) {
      setBriefError(error instanceof Error ? error.message : "Could not generate the project brief.");
    } finally {
      setLoadingBrief(false);
    }
  }

  return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="challenge-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close icon-button" onClick={onClose} aria-label="Close challenge"><X size={19} /></button><div className={`modal-art ${challenge.color}`}><div className="modal-art-orbit" /><div className="modal-art-plant"><Sprout size={52} /></div><span className="modal-art-spark">✳</span></div><div className="modal-body"><span className="category-chip">{challenge.category}</span><h2 id="modal-title">{challenge.title}</h2><div className="modal-location"><MapPin size={14} />{challenge.location}</div><p>{challenge.description}</p><div className="modal-details"><span><Clock3 size={15} /><strong>{challenge.duration}</strong><small>project length</small></span><span><Users size={15} /><strong>{challenge.participants} students</strong><small>already curious</small></span><span><GraduationCap size={15} /><strong>{challenge.difficulty}</strong><small>difficulty</small></span></div><button className="button button-outline full-button ai-generate-button" disabled={loadingBrief} onClick={() => void generateBrief()}><Sparkles size={15} />{loadingBrief ? "Designing a learning project…" : "Generate learning project"}</button>{briefError && <p className="form-error" role="alert">{briefError}</p>}{brief && <div className="generated-brief"><div className="generated-title"><Sparkles size={15} /><strong>{String(brief.projectTitle || "Learning project")}</strong></div>{(["subjects", "objectives", "activities", "assessment"] as const).map((key) => { const items = brief[key]; return Array.isArray(items) && items.length ? <div className="brief-section" key={key}><strong>{key[0].toUpperCase() + key.slice(1)}</strong><ul>{items.map((item, index) => <li key={`${key}-${index}`}>{String(item)}</li>)}</ul></div> : null; })}{typeof brief.safetyNote === "string" && <p className="safety-note">{brief.safetyNote}</p>}</div>}<div className="modal-steps"><strong>Your first steps</strong><ol><li>Learn more about the challenge in your community.</li><li>Find a few teammates who are curious too.</li><li>Work with a teacher to shape your project plan.</li></ol></div><button className="button button-dark full-button" onClick={onJoin}>I’m interested <ArrowRight size={15} /></button></div></section></div>;
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
    {selectedChallenge && <ChallengeModal challenge={selectedChallenge} onClose={() => setSelectedChallenge(null)} onJoin={() => { const name = selectedChallenge.title; setSelectedChallenge(null); setActiveView("My projects"); notify(`You’re on your way to joining “${name}”`); }} />}
    {toast && <Toast message={toast} onDismiss={() => setToast("")} />}
  </div>;
}
