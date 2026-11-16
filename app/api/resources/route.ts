import { NextResponse } from "next/server";
import { requireUser } from "@/lib/authorization";
import { retrieveResources } from "@/lib/resources";

export async function GET(request: Request) {
  const { user, response } = await requireUser(["student", "teacher", "community"]);
  if (response || !user) return response;

  try {
    const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
    if (query.length > 160) {
      return NextResponse.json({ error: "Search text must be 160 characters or fewer." }, { status: 400 });
    }
    return NextResponse.json({ resources: await retrieveResources(query) });
  } catch (error) {
    console.error("Could not search learning resources:", error);
    return NextResponse.json({ error: "Could not load learning resources." }, { status: 500 });
  }
}
