import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import { handleApiError } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

/** PATCH /api/learning-path/[id] — تحديد العنصر كمكتمل/غير مكتمل */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const body = await req.json();
    if (typeof body.is_completed !== "boolean") {
      return NextResponse.json({ error: "is_completed مطلوب (true/false)" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("learning_path_items")
      .update({ is_completed: body.is_completed })
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (err) {
    return handleApiError(err);
  }
}

/** DELETE /api/learning-path/[id] */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { supabase, userId } = auth;

    const { error } = await supabase
      .from("learning_path_items")
      .delete()
      .eq("id", params.id)
      .eq("user_id", userId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
