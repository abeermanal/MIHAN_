import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import { handleApiError } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const body = await req.json();
    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = String(body.title);
    if (body.description !== undefined)
      updates.description = body.description ? String(body.description) : null;
    if (body.skills_used !== undefined)
      updates.skills_used = Array.isArray(body.skills_used)
        ? body.skills_used.map(String)
        : [];
    if (body.link !== undefined)
      updates.link = body.link ? String(body.link) : null;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "لا توجد حقول للتحديث" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", params.id)
      .eq("user_id", userId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
