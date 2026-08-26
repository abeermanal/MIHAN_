export default function SetupNotice({ error }: { error?: string }) {
  return (
    <div className="card border-coral-200 bg-coral-50">
      <h2 className="text-lg font-extrabold text-coral-800">⚠️ إعداد مطلوب</h2>
      <p className="mt-2 leading-relaxed text-coral-900">
        {error ??
          "لم يتم ضبط مفاتيح Supabase بعد. انسخي .env.local.example إلى .env.local واملأي المفاتيح، ثم شغّلي schema.sql في لوحة تحكم Supabase."}
      </p>
      <ol className="mt-3 list-decimal space-y-1 pr-5 text-sm text-coral-900">
        <li>أنشئي مشروعاً على supabase.com وشغّلي ملف schema.sql.</li>
        <li>انسخي المفاتيح إلى .env.local وأعيدي تشغيل الخادم.</li>
        <li>افتحي POST /api/seed لإدخال البيانات الأولية.</li>
      </ol>
    </div>
  );
}
