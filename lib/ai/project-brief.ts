import { retrieveResources } from "@/lib/resources";
import type { ProjectBrief } from "@/lib/types";

const projectBriefSchema = {
  name: "kivora_project_brief",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["projectTitle", "learnerLevel", "subjects", "competencies", "objectives", "activities", "materials", "timeline", "expectedOutcomes", "assessment", "safetyNote"],
    properties: {
      projectTitle: { type: "string" },
      learnerLevel: { type: "string" },
      subjects: { type: "array", items: { type: "string" } },
      competencies: { type: "array", items: { type: "string" } },
      objectives: { type: "array", items: { type: "string" } },
      activities: { type: "array", items: { type: "string" } },
      materials: { type: "array", items: { type: "string" } },
      timeline: { type: "array", items: { type: "string" } },
      expectedOutcomes: { type: "array", items: { type: "string" } },
      assessment: { type: "array", items: { type: "string" } },
      safetyNote: { type: "string" },
    },
  },
};

export async function generateProjectBrief(input: {
  title: string;
  description: string;
  category?: string;
  location?: string;
  learnerLevel: string;
}): Promise<ProjectBrief> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI is not configured. Add OPENAI_API_KEY to .env and restart the app.");

  const resources = await retrieveResources(`${input.title} ${input.description} ${input.category ?? ""}`);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_schema", json_schema: projectBriefSchema },
      messages: [
        {
          role: "system",
          content: "You are KIVORA's Uganda-first student innovation coach. The selected learner level is authoritative. Return a teacher-reviewable, age-appropriate project draft aligned broadly with Uganda's competency-based approach, without claiming official syllabus approval or inventing syllabus codes. Guide learners to listen respectfully, investigate a local problem, form their own solution, build and test safely with teacher guidance, share back with the community, and reflect. Include low-cost materials as possibilities only; never claim they are available. Do not assume internet, electricity or specialist tools. Include a short realistic timeline, observable outcomes and a safety note. Do not provide dangerous construction or medical instructions.",
        },
        {
          role: "user",
          content: JSON.stringify({ ...input, curriculumReferences: resources }),
        },
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("OpenAI project generation failed:", response.status, details);
    throw new Error("OpenAI could not generate a project brief. Check the API key, account billing, and model, then try again.");
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("OpenAI returned an empty project brief.");

  try {
    const brief: unknown = JSON.parse(content);
    if (!isProjectBrief(brief)) throw new Error("Missing required project fields.");
    return brief;
  } catch (error) {
    console.error("OpenAI returned an invalid project brief:", error);
    throw new Error("OpenAI returned an invalid project brief. Please try again.");
  }
}

function isProjectBrief(value: unknown): value is ProjectBrief {
  if (!value || typeof value !== "object") return false;
  const brief = value as Record<string, unknown>;
  return typeof brief.projectTitle === "string" &&
    typeof brief.learnerLevel === "string" &&
    typeof brief.safetyNote === "string" &&
    ["subjects", "competencies", "objectives", "activities", "materials", "timeline", "expectedOutcomes", "assessment"].every(
      (key) => Array.isArray(brief[key]) && (brief[key] as unknown[]).every((item) => typeof item === "string"),
    );
}
