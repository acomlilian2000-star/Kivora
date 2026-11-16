import {
  ArrowRight,
  BookOpen,
  Compass,
  Heart,
  Lightbulb,
  MessageCircleQuestion,
  Trophy,
} from "lucide-react";

type Summary = {
  publishedChallenges: number;
  teams: number;
  submissions: number;
};

const pathways = [
  { title: "Find a local problem", text: "Explore challenges shared by schools and communities.", view: "Problem discovery", icon: Compass, tone: "purple" },
  { title: "Think it through", text: "Get guiding questions, not ready-made answers.", view: "AI mentor", icon: MessageCircleQuestion, tone: "teal" },
  { title: "Use what you have", text: "Search the real resource library or plan with materials nearby.", view: "Resource finder", icon: BookOpen, tone: "yellow" },
  { title: "Build with a team", text: "Plan the work, share progress and learn from testing.", view: "Project builder", icon: Lightbulb, tone: "purple" },
  { title: "Show what you made", text: "See projects approved for public sharing.", view: "Innovation showcase", icon: Trophy, tone: "teal" },
  { title: "Notice your impact", text: "Track learner-reported progress without inventing results.", view: "Impact tracker", icon: Heart, tone: "yellow" },
];

export default function StudentHome({
  summary,
  onNavigate,
}: {
  summary: Summary;
  onNavigate: (view: string) => void;
}) {
  return (
    <div className="student-home">
      <section className="student-welcome">
        <div>
          <p className="section-kicker">UGANDA · COMMUNITY-LED LEARNING</p>
          <h1>Notice a problem.<br /><span>Make a difference.</span></h1>
          <p>Start with what you see around you. Ask questions, work with others and test a safe, practical idea.</p>
          <button className="button button-dark" onClick={() => onNavigate("Problem discovery")}>Explore local problems <ArrowRight size={16} /></button>
        </div>
        <div className="student-welcome-art" aria-hidden="true">
          <span className="idea-orbit idea-orbit-one" />
          <span className="idea-orbit idea-orbit-two" />
          <span className="idea-core"><Lightbulb size={54} /></span>
          <span className="idea-dot idea-dot-one" />
          <span className="idea-dot idea-dot-two" />
          <span className="idea-dot idea-dot-three" />
        </div>
      </section>

      <section className="student-journey-stats" aria-label="KIVORA learning activity">
        <div><strong>{summary.publishedChallenges}</strong><span>published problems</span></div>
        <div><strong>{summary.teams}</strong><span>teams started</span></div>
        <div><strong>{summary.submissions}</strong><span>project updates shared</span></div>
      </section>

      <section className="student-pathways">
        <div className="student-section-heading">
          <div><p className="section-kicker">YOUR INNOVATION JOURNEY</p><h2>Where will you begin?</h2></div>
          <p>Learn by noticing, trying, building and reflecting together.</p>
        </div>
        <div className="student-pathway-grid">
          {pathways.map(({ title, text, view, icon: Icon, tone }) => (
            <button className="student-pathway-card" key={view} onClick={() => onNavigate(view)}>
              <span className={`student-pathway-icon ${tone}`}><Icon size={21} /></span>
              <strong>{title}</strong>
              <span>{text}</span>
              <span className="student-pathway-link">Open <ArrowRight size={14} /></span>
            </button>
          ))}
        </div>
      </section>
      <p className="student-safety-note">Work with a teacher or trusted adult when speaking with community members, using tools or testing an idea.</p>
    </div>
  );
}
