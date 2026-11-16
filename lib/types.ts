export type ChallengeStatus = "pending" | "published";

export type ProjectBrief = {
  projectTitle: string;
  learnerLevel: string;
  subjects: string[];
  competencies: string[];
  objectives: string[];
  activities: string[];
  assessment: string[];
  safetyNote: string;
};
