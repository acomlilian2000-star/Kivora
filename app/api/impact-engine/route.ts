import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI is not configured yet. Add OPENROUTER_API_KEY to .env.local and restart the app." },
      { status: 503 },
    );
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || typeof (body as { title?: unknown }).title !== "string" || typeof (body as { description?: unknown }).description !== "string") {
      return NextResponse.json({ error: "A challenge title and description are required." }, { status: 400 });
    }
    const { title, description, category, location } = body as { title: string; description: string; category?: string; location?: string };
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "KIVORA Impact Engine",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are KIVORA's educational project designer. Turn a community challenge into a safe, age-appropriate school learning project. Return only JSON with keys: projectTitle (string), subjects (string[]), objectives (string[]), activities (string[]), assessment (string[]), safetyNote (string). Be practical, locally relevant, and never suggest dangerous experiments.",
          },
          {
            role: "user",
            content: JSON.stringify({ title, description, category, location }),
          },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      console.error("OpenRouter request failed:", response.status, await response.text());
      return NextResponse.json({ error: "The AI provider could not generate a project brief. Check your API key and try again." }, { status: 502 });
    }
    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return NextResponse.json({ error: "The AI provider returned an empty project brief." }, { status: 502 });
    }
    try {
      return NextResponse.json({ brief: JSON.parse(content) });
    } catch (error) {
      console.error("OpenRouter returned invalid project JSON:", error);
      return NextResponse.json({ error: "The AI response was not a valid project brief. Please try again." }, { status: 502 });
    }
  } catch (error) {
    console.error("Impact Engine request failed:", error);
    return NextResponse.json({ error: "Could not generate a project brief. Please try again." }, { status: 500 });
  }
}
