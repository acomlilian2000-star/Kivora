import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Heart,
  Leaf,
  Lightbulb,
  MessageSquareText,
  Smartphone,
  Sprout,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="landing">
      <header className="landing-nav">
        <Link className="landing-brand" href="/" aria-label="KIVORA home">
          <span className="landing-brand-mark"><Sprout size={19} /></span>KIVORA<span className="landing-period">.</span>
        </Link>
        <nav className="landing-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#for-everyone">For everyone</a>
          <a href="#our-impact">Our impact</a>
        </nav>
        <Link className="landing-login" href="/dashboard">Log in <ArrowUpRight size={15} /></Link>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-overline"><span /> BUILT WITH RURAL SCHOOLS AND COMMUNITIES</div>
          <h1>Ideas into<br /><em>impact.</em></h1>
          <p className="landing-lede">Great ideas grow everywhere. KIVORA connects rural communities’ real challenges with students, teachers and practical, hands-on learning.</p>
          <div className="landing-hero-actions">
            <Link className="landing-cta" href="/dashboard">Explore the platform <ArrowRight size={16} /></Link>
            <a className="landing-watch" href="#how-it-works"><span><ArrowDown size={14} /></span> See how it works</a>
          </div>
          <div className="landing-proof"><div className="landing-avatars"><span>AM</span><span>JN</span><span>FK</span><span>+</span></div><span><strong>Rooted in local knowledge.</strong><br />Made for every learner.</span></div>
        </div>
        <div className="landing-hero-art" aria-label="Illustration of ideas growing into impact">
          <div className="landing-art-grid" />
          <div className="landing-art-orbit landing-orbit-a" />
          <div className="landing-art-orbit landing-orbit-b" />
          <div className="landing-art-sun" />
          <div className="landing-art-ground" />
          <div className="landing-art-stem" />
          <div className="landing-art-leaf landing-leaf-a"><Leaf size={52} /></div>
          <div className="landing-art-leaf landing-leaf-b"><Leaf size={41} /></div>
          <div className="landing-art-leaf landing-leaf-c"><Leaf size={34} /></div>
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
        <div className="landing-value"><span className="value-icon value-student"><Compass size={19} /></span><strong>Rural students</strong><p>Explore nearby challenges and learn by making.</p></div>
        <div className="landing-value"><span className="value-icon value-teacher"><Heart size={19} /></span><strong>Teachers</strong><p>Guide projects that use local knowledge and resources.</p></div>
      </section>

      <section className="rural-access">
        <div className="rural-access-heading"><span className="landing-overline">DESIGNED FOR REAL-WORLD CONDITIONS</span><h2>Works beyond the signal bars.</h2><p>Learning should not depend on having the newest phone or a strong connection.</p></div>
        <div className="rural-access-item"><span><MessageSquareText size={18} /></span><div><strong>Basic-phone friendly</strong><p>Community members can submit challenges through a USSD menu.</p></div></div>
        <div className="rural-access-item"><span><Smartphone size={18} /></span><div><strong>Lightweight by design</strong><p>Simple screens and text-first flows help make mobile data go further.</p></div></div>
        <div className="rural-access-item"><span><Sprout size={19} /></span><div><strong>Local challenges, local solutions</strong><p>Start with the knowledge, people and materials already in your community.</p></div></div>
      </section>

      <section className="landing-how" id="how-it-works">
        <div className="landing-section-title"><div><span className="landing-overline">FROM LOCAL CHALLENGE TO SHARED PROGRESS</span><h2>Learning rooted in your community.</h2></div><p>Turn nearby challenges—water access, farming, energy or safe routes—into meaningful classroom projects.</p></div>
        <div className="landing-steps">
          <article><span className="step-number">01</span><span className="step-icon"><MessageSquareText size={19} /></span><h3>Start with a challenge</h3><p>A family, farmer or community member shares a local need online or by basic phone.</p><span className="step-link">LISTEN LOCALLY</span></article>
          <article><span className="step-number">02</span><span className="step-icon"><Lightbulb size={19} /></span><h3>Turn it into learning</h3><p>KIVORA’s Impact Engine helps shape a challenge into a practical project brief.</p><span className="step-link">LEARN BY DOING</span></article>
          <article><span className="step-number">03</span><span className="step-icon"><Users size={19} /></span><h3>Build the answer together</h3><p>Students, teachers and local knowledge come together to make change.</p><span className="step-link">MAKE IT MATTER</span></article>
        </div>
      </section>

      <section className="landing-impact" id="our-impact">
        <div className="impact-copy"><span className="landing-overline">A LITTLE CURIOSITY GOES A LONG WAY</span><h2>The next big idea<br />might be <em>yours.</em></h2><p>Find a challenge close to home. Bring your questions. See what you and your community can make possible.</p><Link className="landing-impact-link" href="/dashboard">Step into KIVORA <ArrowRight size={16} /></Link></div>
        <div className="impact-art"><span className="impact-art-ring ring-one" /><span className="impact-art-ring ring-two" /><span className="impact-art-circle"><Sprout size={57} /></span><span className="impact-note"><Heart size={15} /> Ideas grow here.</span><span className="impact-art-spark">✳</span></div>
        <span className="landing-impact-label">LEARN. CREATE. MAKE A DIFFERENCE.</span>
      </section>

      <footer className="landing-footer">
        <Link className="landing-brand" href="/"><span className="landing-brand-mark"><Sprout size={17} /></span>KIVORA<span className="landing-period">.</span></Link>
        <span>Ideas into impact. Together.</span>
        <Link href="/dashboard">Explore the platform <ArrowRight size={14} /></Link>
      </footer>
    </main>
  );
}
