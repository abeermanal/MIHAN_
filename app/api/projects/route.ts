import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import { handleApiError } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ projects: data ?? [] });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const body = await req.json();
    const title = String(body.title ?? "").trim();
    if (!title) {
      return NextResponse.json({ error: "عنوان المشروع مطلوب" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        title,
        description: body.description ? String(body.description) : null,
        skills_used: Array.isArray(body.skills_used)
          ? body.skills_used.map(String)
          : [],
        link: body.link ? String(body.link) : null,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ project: data }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
