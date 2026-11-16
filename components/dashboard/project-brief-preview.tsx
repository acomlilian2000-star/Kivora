import { Sparkles } from "lucide-react";
import type { ProjectBrief } from "@/lib/types";

const briefSections: Array<{ key: keyof Pick<ProjectBrief, "subjects" | "competencies" | "objectives" | "activities" | "assessment">; title: string }> = [
  { key: "subjects", title: "Subjects" },
  { key: "competencies", title: "Competencies" },
  { key: "objectives", title: "Learning objectives" },
  { key: "activities", title: "Community project steps" },
  { key: "assessment", title: "Assessment" },
];

export default function ProjectBriefPreview({ brief }: { brief: ProjectBrief }) {
  return (
    <div className="generated-brief">
      <div className="generated-title"><Sparkles size={15} /><strong>{brief.projectTitle}</strong></div>
      <p className="brief-level">Uganda learner level: {brief.learnerLevel}</p>
      {briefSections.map(({ key, title }) => (
        <div className="brief-section" key={key}>
          <strong>{title}</strong>
          <ul>{brief[key].map((item, index) => <li key={`${key}-${index}`}>{item}</li>)}</ul>
        </div>
      ))}
      <p className="safety-note">{brief.safetyNote}</p>
    </div>
  );
}
