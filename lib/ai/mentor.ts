export type MentorGuide = {
  reflectionQuestion: string;
  nextSteps: string[];
  thingsToNotice: string[];
  safetyReminder: string;
};

const mentorStages = [
  "understand the problem",
  "who is affected",
  "explore possible causes",
  "student-generated ideas",
  "compare ideas",
  "local resources",
  "plan and test",
] as const;

export type MentorStage = (typeof mentorStages)[number];

export function isMentorStage(value: unknown): value is MentorStage {
  return typeof value === "string" && mentorStages.includes(value as MentorStage);
}

export async function guideLearner(input: {
  learnerLevel: string;
  stage: MentorStage;
  problem: string;
  studentIdea?: string;
  materials?: string;
}): Promise<MentorGuide> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI is not configured. Add OPENAI_API_KEY to .env and restart the app.");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are KIVORA's age-appropriate Ugandan student innovation mentor. Help learners think; never give a finished solution. Ask one thoughtful reflection question, give exactly two small next steps, suggest up to three things to notice using ordinary local observations, and include one concise safety reminder. Use simple supportive language for the supplied learner level. Do not ask for names, phone numbers, exact home locations, or other sensitive personal information. Do not assume internet, electricity, money, tools, or that listed resources are actually available. Require a teacher or trusted adult for community interviews, tools, experiments, travel, or testing. Avoid medical, electrical, chemical, structural, or other dangerous instructions. Return JSON with keys reflectionQuestion, nextSteps, thingsToNotice, safetyReminder.",
        },
        { role: "user", content: JSON.stringify(input) },
      ],
    }),
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("OpenAI mentor request failed:", response.status, details);
    throw new Error("The KIVORA mentor could not respond. Check the OpenAI account and try again.");
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("The KIVORA mentor returned an empty response.");

  try {
    const guide: unknown = JSON.parse(content);
    if (!isMentorGuide(guide)) throw new Error("Mentor response has an invalid shape.");
    return guide;
  } catch (error) {
    console.error("OpenAI returned an invalid mentor response:", error);
    throw new Error("The KIVORA mentor returned an invalid response. Please try again.");
  }
}

function isMentorGuide(value: unknown): value is MentorGuide {
  if (!value || typeof value !== "object") return false;
  const guide = value as Record<string, unknown>;
  return typeof guide.reflectionQuestion === "string" &&
    typeof guide.safetyReminder === "string" &&
    Array.isArray(guide.nextSteps) &&
    guide.nextSteps.length === 2 &&
    guide.nextSteps.every((item) => typeof item === "string") &&
    Array.isArray(guide.thingsToNotice) &&
    guide.thingsToNotice.length <= 3 &&
    guide.thingsToNotice.every((item) => typeof item === "string");
}
