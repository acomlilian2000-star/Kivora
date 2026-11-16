import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Heart,
  Lightbulb,
  MessageSquareText,
  Sparkles,
  Smartphone,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="landing">
      <header className="landing-nav">
        <Link className="landing-brand" href="/" aria-label="KIVORA home">
          <span className="landing-brand-mark"><Sparkles size={18} /></span>KIVORA<span className="landing-period">.</span>
        </Link>
        <nav className="landing-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#for-everyone">For everyone</a>
          <a href="#basic-phone">Basic-phone access</a>
        </nav>
        <div className="landing-nav-actions">
          <Link className="landing-school-link" href="/school/register">Register your school</Link>
          <Link className="landing-login" href="/login">Log in <ArrowUpRight size={15} /></Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-overline"><span /> UGANDA-FIRST. COMMUNITY-LED. OPEN TO ALL.</div>
          <h1>Ideas into<br /><em>impact.</em></h1>
          <p className="landing-lede">Great ideas grow everywhere. KIVORA helps Ugandan learners and teachers work with their communities to turn local challenges into practical, hands-on learning.</p>
          <div className="landing-hero-actions">
            <Link className="landing-cta" href="/register">Join the innovation journey <ArrowRight size={16} /></Link>
            <a className="landing-watch" href="#basic-phone"><span><ArrowDown size={14} /></span> Basic-phone access</a>
          </div>
          <div className="landing-proof"><span className="landing-proof-mark"><Users size={18} /></span><span><strong>Rooted in local knowledge.</strong><br />Designed in Uganda. Adaptable elsewhere.</span></div>
        </div>
        <div className="landing-hero-art" aria-label="Illustration of ideas growing into impact">
          <div className="landing-art-grid" />
          <div className="landing-art-orbit landing-orbit-a" />
          <div className="landing-art-orbit landing-orbit-b" />
          <div className="landing-art-sun" />
          <div className="landing-art-ground" />
          <div className="landing-art-connector" />
          <div className="landing-idea-token landing-token-a"><Lightbulb size={46} /></div>
          <div className="landing-idea-token landing-token-b"><Users size={30} /></div>
          <div className="landing-idea-token landing-token-c"><Sparkles size={25} /></div>
          <div className="landing-art-spark landing-spark-a">✳</div><div className="landing-art-spark landing-spark-b">✦</div>
          <div className="landing-float-card landing-card-idea"><span><Lightbulb size={17} /></span><div><strong>One good question</strong><small>can change everything</small></div></div>
          <div className="landing-float-card landing-card-community"><span><Users size={16} /></span><div><strong>Made together</strong><small>Right in your community</small></div></div>
          <div className="landing-art-caption">GROWING A BETTER TOMORROW, TOGETHER</div>
        </div>
        <span className="landing-hero-index">01 — 04</span>
      </section>

      <section className="landing-values" id="for-everyone">
        <div className="landing-values-intro"><span className="landing-overline">ONE ECOSYSTEM. MANY POSSIBILITIES.</span><h2>Learning should<br />make a difference.</h2></div>
        <div className="landing-value"><span className="value-icon value-community"><MessageSquareText size={19} /></span><strong>Communities</strong><p>Share local needs like water, roads and farming.</p></div>
        <div className="landing-value">        <span className="value-icon value-student"><Compass size={19} /></span><strong>Rural students</strong><p>Explore nearby challenges and learn by making.</p></div>
        <div className="landing-value"><span className="value-icon value-teacher"><Heart size={19} /></span><strong>Teachers</strong><p>Guide projects that use local knowledge and resources.</p></div>
      </section>

      <section className="rural-access" id="basic-phone">
        <div className="rural-access-heading"><span className="landing-overline">DESIGNED FOR REAL-WORLD CONDITIONS</span><h2>No smartphone. No data bundle.</h2><p>USSD can work on a basic phone over a cellular signal. The live KIVORA shortcode must first be provisioned for Uganda’s mobile networks.</p></div>
        <div className="rural-access-item"><span><MessageSquareText size={18} /></span><div><strong>For a community member</strong><p>Once launched, dial the registered shortcode, choose “submit a problem,” and reply to the prompts. No app or internet bundle is needed; network coverage is.</p></div></div>
        <div className="rural-access-item"><span><Smartphone size={18} /></span><div><strong>For KIVORA operators</strong><p>The USSD callback must run at a public HTTPS address. A developer’s local computer or localhost cannot receive calls from a village phone.</p></div></div>
        <div className="rural-access-item"><span><Lightbulb size={19} /></span><div><strong>Local challenges, local solutions</strong><p>Start with the knowledge, people and materials already in your community.</p></div></div>
      </section>

      <section className="landing-how" id="how-it-works">
        <div className="landing-section-title"><div><span className="landing-overline">FROM LOCAL CHALLENGE TO SHARED PROGRESS</span><h2>Learning rooted in your community.</h2></div><p>Turn nearby challenges—water access, farming, energy or safe routes—into meaningful classroom projects.</p></div>
        <div className="landing-steps">
          <article><span className="step-number">01</span><span className="step-icon"><MessageSquareText size={19} /></span><h3>Listen and investigate</h3><p>Learners speak with people affected, observe the issue and connect it to class learning.</p><span className="step-link">START WITH COMMUNITY</span></article>
          <article><span className="step-number">02</span><span className="step-icon"><Lightbulb size={19} /></span><h3>Design a practical response</h3><p>With a teacher, learners make a low-cost plan, try a safe prototype and improve it using feedback.</p><span className="step-link">LEARN BY DOING</span></article>
          <article><span className="step-number">03</span><span className="step-icon"><Users size={19} /></span><h3>Share back and reflect</h3><p>Teams present what worked to their community and reflect on knowledge, skills and next steps.</p><span className="step-link">MAKE IT MATTER</span></article>
        </div>
      </section>

      <section className="landing-impact" id="our-impact">
        <div className="impact-copy"><span className="landing-overline">A LITTLE CURIOSITY GOES A LONG WAY</span><h2>The next big idea<br />might be <em>yours.</em></h2><p>Find a challenge close to home. Bring your questions. See what you and your community can make possible.</p><Link className="landing-impact-link" href="/dashboard">Step into KIVORA <ArrowRight size={16} /></Link></div>
        <div className="impact-art"><span className="impact-art-ring ring-one" /><span className="impact-art-ring ring-two" /><span className="impact-art-circle"><Sparkles size={57} /></span><span className="impact-note"><Heart size={15} /> Ideas move us.</span><span className="impact-art-spark">✳</span></div>
        <span className="landing-impact-label">LEARN. CREATE. MAKE A DIFFERENCE.</span>
      </section>

      <footer className="landing-footer">
        <Link className="landing-brand" href="/"><span className="landing-brand-mark"><Sparkles size={17} /></span>KIVORA<span className="landing-period">.</span></Link>
        <span>Ideas into impact. Together.</span>
        <div className="landing-footer-actions">
          <Link href="/school/register">Register your school</Link>
          <Link href="/register">Join KIVORA <ArrowRight size={14} /></Link>
        </div>
      </footer>
    </main>
  );
}
