import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  LogOut,
  MapPin,
  School as SchoolIcon,
  Users,
} from "lucide-react";
import { signOut } from "@/lib/auth";
import { requireSchoolMembership } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function SchoolDashboardPage() {
  const { membership, response } = await requireSchoolMembership(["SCHOOL_ADMIN"]);
  if (response || !membership) {
    if (response?.status === 401) redirect("/login");
    if (response?.status === 409) redirect("/school/select");
    return (
      <main className="school-access-page">
        <section className="school-access-card">
          <h1>School administrator access required</h1>
          <p>This page is only available to an administrator with an active membership at this school.</p>
          <Link className="button button-outline" href="/dashboard">Return to KIVORA</Link>
        </section>
      </main>
    );
  }

  const schoolId = membership.schoolId;
  const [
    teacherCount,
    studentCount,
    classCount,
    projectCount,
    completedProjectCount,
    pendingProblemCount,
    pendingReviewCount,
    recentChallenges,
    membershipCount,
  ] = await Promise.all([
    prisma.schoolMembership.count({ where: { schoolId, role: "TEACHER", status: "active" } }),
    prisma.schoolMembership.count({ where: { schoolId, role: "STUDENT", status: "active" } }),
    prisma.schoolClass.count({ where: { schoolId } }),
    prisma.project.count({ where: { schoolId, status: { notIn: ["completed", "archived"] } } }),
    prisma.project.count({ where: { schoolId, status: "completed" } }),
    prisma.challenge.count({ where: { schoolId, status: "pending" } }),
    prisma.submission.count({ where: { schoolId, status: "submitted" } }),
    prisma.challenge.findMany({
      where: { schoolId },
      select: { id: true, title: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.schoolMembership.count({ where: { userId: membership.userId, status: "active" } }),
  ]);
  const school = membership.school;
  const profileComplete = Boolean(school.schoolType && school.location && school.headteacher);

  return (
    <main className="school-admin-shell">
      <aside className="school-admin-sidebar">
        <Link className="school-admin-brand" href="/"><span><Lightbulb size={17} /></span>KIVORA</Link>
        <div className="school-admin-workspace">
          <span className="school-admin-workspace-icon"><SchoolIcon size={18} /></span>
          <span><strong>{school.name}</strong><small>{school.district} District</small></span>
        </div>
        <p className="school-admin-nav-label">SCHOOL SPACE</p>
        <nav className="school-admin-nav" aria-label="School navigation">
          <a className="school-admin-nav-active" href="#overview"><SchoolIcon size={17} /> Overview</a>
          <a href="#school-profile"><ClipboardList size={17} /> School profile</a>
          <a href="#getting-started"><BookOpen size={17} /> Getting started</a>
        </nav>
        <div className="school-admin-sidebar-bottom">
          {membershipCount > 1 && <Link className="school-admin-switch" href="/school/select">Switch school <ArrowUpRight size={14} /></Link>}
          <form action={signOutAction}>
            <button className="school-admin-signout"><LogOut size={17} /> Sign out</button>
          </form>
          <div className="school-admin-account">
            <span>{membership.user.name.slice(0, 1).toUpperCase()}</span>
            <div><strong>{membership.user.name}</strong><small>School administrator</small></div>
          </div>
        </div>
      </aside>

      <section className="school-admin-main">
        <header className="school-admin-topbar">
          <p><span>School space</span><strong>{school.name}</strong></p>
          <span className="school-code-chip">School code <strong>{school.schoolCode ?? "Not assigned"}</strong></span>
        </header>

        <div className="school-admin-content" id="overview">
          <div className="school-admin-welcome">
            <div>
              <p className="section-kicker">YOUR SCHOOL'S INNOVATION SPACE</p>
              <h1>Welcome, {membership.user.name.split(" ")[0]}.</h1>
              <p>Start by bringing teachers and learners together around real challenges in your community.</p>
            </div>
            <span className="school-admin-welcome-icon"><Lightbulb size={31} /></span>
          </div>

          <section className="school-admin-stat-grid" aria-label="School activity">
            <article><span className="school-admin-stat-icon"><Users size={18} /></span><small>Teachers</small><strong>{teacherCount}</strong></article>
            <article><span className="school-admin-stat-icon"><Users size={18} /></span><small>Students</small><strong>{studentCount}</strong></article>
            <article><span className="school-admin-stat-icon"><BookOpen size={18} /></span><small>Classes</small><strong>{classCount}</strong></article>
            <article><span className="school-admin-stat-icon"><Lightbulb size={18} /></span><small>Active projects</small><strong>{projectCount}</strong></article>
          </section>

          <div className="school-admin-dashboard-grid">
            <section className="school-admin-panel" id="school-profile">
              <div className="school-admin-panel-heading">
                <div><p className="section-kicker">SCHOOL PROFILE</p><h2>{school.name}</h2></div>
                <span className="school-admin-status"><CheckCircle2 size={15} /> Registered</span>
              </div>
              <dl className="school-admin-profile">
                <div><dt>School type</dt><dd>{school.schoolType ? school.schoolType[0].toUpperCase() + school.schoolType.slice(1) : "Not set"}</dd></div>
                <div><dt>Location</dt><dd><MapPin size={14} />{school.location}, {school.district}, {school.country}</dd></div>
                <div><dt>Headteacher / representative</dt><dd>{school.headteacher || "Not set"}</dd></div>
                <div><dt>School contact</dt><dd>{school.contactPhone || "Not provided"}</dd></div>
                <div><dt>Community routing code</dt><dd><code>{school.schoolCode ?? "Not assigned"}</code></dd></div>
              </dl>
            </section>

            <section className="school-admin-panel school-admin-review-panel">
              <div className="school-admin-panel-heading">
                <div><p className="section-kicker">NEEDS ATTENTION</p><h2>School activity</h2></div>
                <ClipboardList size={19} />
              </div>
              <div className="school-admin-activity-row"><span>Community problems to review</span><strong>{pendingProblemCount}</strong></div>
              <div className="school-admin-activity-row"><span>Student submissions to review</span><strong>{pendingReviewCount}</strong></div>
              <div className="school-admin-activity-row"><span>Completed innovations</span><strong>{completedProjectCount}</strong></div>
            </section>
          </div>

          <div className="school-admin-dashboard-grid">
            <section className="school-admin-panel" id="getting-started">
              <div className="school-admin-panel-heading">
                <div><p className="section-kicker">ONBOARDING</p><h2>Getting your school started</h2></div>
              </div>
              <ol className="school-admin-checklist">
                <li className={profileComplete ? "complete" : ""}>
                  <span>{profileComplete ? <CheckCircle2 size={17} /> : "1"}</span>
                  <div><strong>Set up your school profile</strong><small>{profileComplete ? "Your school details are ready." : "Add a location and school representative."}</small></div>
                </li>
                <li className={teacherCount > 0 ? "complete" : ""}>
                  <span>{teacherCount > 0 ? <CheckCircle2 size={17} /> : "2"}</span>
                  <div><strong>Bring in a teacher</strong><small>{teacherCount > 0 ? `${teacherCount} active teacher${teacherCount === 1 ? "" : "s"} in your school.` : "Teacher invitations are the next school setup feature."}</small></div>
                </li>
                <li className={classCount > 0 ? "complete" : ""}>
                  <span>{classCount > 0 ? <CheckCircle2 size={17} /> : "3"}</span>
                  <div><strong>Set up your first class</strong><small>{classCount > 0 ? `${classCount} class${classCount === 1 ? "" : "es"} created.` : "Class setup will follow teacher and learner onboarding."}</small></div>
                </li>
              </ol>
            </section>

            <section className="school-admin-panel">
              <div className="school-admin-panel-heading">
                <div><p className="section-kicker">RECENT ACTIVITY</p><h2>Community challenges</h2></div>
              </div>
              {recentChallenges.length === 0 ? (
                <div className="school-admin-empty">
                  <span><Lightbulb size={19} /></span>
                  <strong>No school challenges yet</strong>
                  <p>Community submissions routed to your school will appear here after they are received.</p>
                </div>
              ) : (
                <ul className="school-admin-recent-list">
                  {recentChallenges.map((challenge) => (
                    <li key={challenge.id}>
                      <span><strong>{challenge.title}</strong><small>{challenge.createdAt.toLocaleDateString("en-UG")} · {challenge.status}</small></span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <footer className="school-admin-footer">
            <span>School data is private to your school's active membership.</span>
            <Link href="/">KIVORA · Ideas into impact <ArrowUpRight size={13} /></Link>
          </footer>
        </div>
      </section>
    </main>
  );
}
