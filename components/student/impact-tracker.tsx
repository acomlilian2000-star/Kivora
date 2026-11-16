import { Heart, Recycle, Users } from "lucide-react";

type ImpactSummary = {
  peopleHelped: number;
  materialsReused: number;
  problemsAddressed: number;
};

export default function ImpactTracker({ summary }: { summary: ImpactSummary }) {
  const metrics = [
    { label: "People learners report helping", value: summary.peopleHelped, icon: Users },
    { label: "Materials learners report reusing", value: summary.materialsReused, icon: Recycle },
    { label: "Problems learners report addressing", value: summary.problemsAddressed, icon: Heart },
  ];
  return (
    <div className="inner-view student-module">
      <div className="page-intro"><div><p className="section-kicker">NOTICE WHAT CHANGED</p><h1>Impact tracker</h1><p>These totals come from learner submissions. They are reports, not independently verified community outcomes.</p></div><div className="intro-art"><Heart size={29} /></div></div>
      <div className="impact-tracker-grid">{metrics.map(({ label, value, icon: Icon }) => <article className="panel impact-tracker-card" key={label}><span><Icon size={20} /></span><strong>{value.toLocaleString()}</strong><p>{label}</p></article>)}</div>
      <p className="student-safety-note">A teacher should review project evidence before KIVORA presents any outcome as verified impact.</p>
    </div>
  );
}
