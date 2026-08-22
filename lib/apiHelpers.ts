import { NextResponse } from "next/server";

export function handleApiError(err: unknown) {
  if (err instanceof Error && err.message === "SUPABASE_NOT_CONFIGURED") {
    return NextResponse.json(
      {
        error:
          "Supabase غير مُعد. انسخي .env.local.example إلى .env.local واملأي المفاتيح.",
      },
      { status: 503 }
    );
  }
  console.error("[api]", err);
  return NextResponse.json({ error: "حدث خطأ غير متوقع في الخادم" }, { status: 500 });
}
