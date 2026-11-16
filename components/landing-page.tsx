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
          <div className="landing-overline"><span /> THE LEARNING ECOSYSTEM BUILT AROUND YOU</div>
          <h1>Ideas into<br /><em>impact.</em></h1>
          <p className="landing-lede">Real challenges live in every community. KIVORA helps young people turn the ones around them into ideas, learning and lasting change.</p>
          <div className="landing-hero-actions">
            <Link className="landing-cta" href="/dashboard">Explore the platform <ArrowRight size={16} /></Link>
            <a className="landing-watch" href="#how-it-works"><span><ArrowDown size={14} /></span> See how it works</a>
          </div>
          <div className="landing-proof"><div className="landing-avatars"><span>AM</span><span>JN</span><span>FK</span><span>+</span></div><span><strong>Built with communities.</strong><br />Made for the next generation.</span></div>
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
          <div className="landing-float-card landing-card-community"><span><Users size={16} /></span><div><strong>Made together</strong><small>Right where you are</small></div></div>
          <div className="landing-art-caption">GROWING A BETTER TOMORROW, TOGETHER</div>
        </div>
        <span className="landing-hero-index">01 — 04</span>
      </section>

      <section className="landing-values" id="for-everyone">
        <div className="landing-values-intro"><span className="landing-overline">ONE ECOSYSTEM. MANY POSSIBILITIES.</span><h2>Learning should<br />make a difference.</h2></div>
        <div className="landing-value"><span className="value-icon value-community"><MessageSquareText size={19} /></span><strong>Community</strong><p>Share the local challenges worth solving.</p></div>
        <div className="landing-value"><span className="value-icon value-student"><Compass size={19} /></span><strong>Students</strong><p>Explore ideas, learn new skills and create together.</p></div>
        <div className="landing-value"><span className="value-icon value-teacher"><Heart size={19} /></span><strong>Teachers</strong><p>Guide young innovators from question to impact.</p></div>
      </section>

      <section className="landing-how" id="how-it-works">
        <div className="landing-section-title"><div><span className="landing-overline">FROM REAL-LIFE PROBLEM TO REAL-WORLD PROGRESS</span><h2>A better kind of classroom.</h2></div><p>Where the world around you becomes the starting point for what you learn next.</p></div>
        <div className="landing-steps">
          <article><span className="step-number">01</span><span className="step-icon"><MessageSquareText size={19} /></span><h3>Start with a challenge</h3><p>A community shares something that could be better—right from a phone or online.</p><span className="step-link">LISTEN LOCALLY</span></article>
          <article><span className="step-number">02</span><span className="step-icon"><Lightbulb size={19} /></span><h3>Turn it into learning</h3><p>KIVORA’s Impact Engine helps shape a challenge into a practical project brief.</p><span className="step-link">LEARN BY DOING</span></article>
          <article><span className="step-number">03</span><span className="step-icon"><Users size={19} /></span><h3>Build the answer together</h3><p>Students team up, teachers guide, and good ideas become community action.</p><span className="step-link">MAKE IT MATTER</span></article>
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
