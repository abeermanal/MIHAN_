# MIHAN — منصة التوجيه المهني للنساء 💜

منصة عربية (Next.js + Supabase + Tailwind CSS) تساعد النساء على:

- **تقييم مهاراتهن** وتخزين النتائج.
- **اكتشاف الفرص الوظيفية** مرتبة حسب نسبة التوافق (المهارة المطلوبة الناقصة تُخصم 20%).
- **مسار تعلم مجاني** لسد الفجوات مع روابط مصادر مجانية وإمكانية تحديد العناصر كمكتملة.
- **مدربة ذكية** (قواعد جاهزة، وترقية تلقائية لـ OpenAI عند إضافة المفتاح).
- **طريق العودة** للنساء العائدات بعد انقطاع — تحويل الخبرات السابقة إلى مهارات.

## 🚀 خطوات التشغيل

### 1) إنشاء مشروع Supabase وتشغيل المخطط
1. أنشئي مشروعاً جديداً على [supabase.com](https://supabase.com).
2. افتحي **SQL Editor** والصقي محتوى ملف `schema.sql` كاملاً ثم شغّليه.

### 2) ضبط متغيرات البيئة
انسخي `.env.local.example` إلى `.env.local` واملأي القيم من
**Project Settings → API** في Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # اختياري لكن مستحسن لمسارات API
OPENAI_API_KEY=...              # اختياري — بدونها تعمل المدربة بالقواعد الجاهزة
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADSENSE_CLIENT_ID=...   # اختياري — معرّف ناشر AdSense (ca-pub-...)
NEXT_PUBLIC_CONTACT_EMAIL=...       # اختياري — بريد التواصل الرسمي
```

### 3) التثبيت والتشغيل

```bash
npm install
npm run dev
```

ثم افتحي <http://localhost:3000>.

### 4) إدخال البيانات الأولية
بعد التشغيل، نفذي مرة واحدة:

```bash
curl -X POST http://localhost:3000/api/seed
```

أو من أي أداة REST. سيتم إدخال 13 مهارة و5 فرص من `seed-data.json`.
(أضيفي `?force=true` لإعادة الإدخال.)

### 5) النشر على Vercel
1. ارفعي المشروع إلى GitHub ثم اربطيه بـ [vercel.com](https://vercel.com).
2. أضيفي نفس متغيرات البيئة في **Project Settings → Environment Variables**.
3. اضبطي `NEXT_PUBLIC_SITE_URL` على رابط الإنتاج (لأجل robots.xml و sitemap.xml).

## 🗂️ بنية المشروع

| المسار | الوصف |
|---|---|
| `schema.sql` | مخطط قاعدة البيانات الكامل |
| `seed-data.json` | البيانات الأولية (مهارات + فرص) |
| `app/page.tsx` | الصفحة الرئيسية |
| `app/assessment/` | صفحة تقييم المهارات |
| `app/opportunities/` | قائمة الفرص + `[id]` تفاصيل الفرصة |
| `app/learning-path/` | مسار التعلم |
| `app/coach/` | المدربة الذكية |
| `app/return-path/` | طريق العودة |
| `app/blog/` | المدونة (قائمة المقالات) + `[slug]` صفحة المقال |
| `app/privacy/` `app/terms/` `app/contact/` | الصفحات القانونية والتواصل |
| `app/api/*` | projects, skills, opportunities, assessment, coach, seed, learning-path |
| `data/blog-posts.ts` | مقالات المدونة (15 مقالاً) + دوال `getPostBySlug` و`getRelatedPosts` |
| `components/BlogArticle.tsx` | عارض المقالات (عناوين، فقرات، قوائم، تمييز غامق) بلا مكتبة خارجية |
| `lib/ads.ts` | معرّفات وحدات AdSense (تُملأ من لوحة AdSense) |
| `lib/matchScore.ts` | حساب نسبة التوافق وعقوبة 20% للمهارة المطلوبة الناقصة |
| `lib/resources.ts` | مصادر التعلم المجانية لكل مهارة |

## 📝 المدونة

المقالات في `data/blog-posts.ts` كـ`BlogPost[]`: `slug`, `title`, `excerpt`, `content`
(نص Markdown مبسّط: `##` و`###` و`-` و`**`), `author`, `date`, `category`, `coverImage`.

لإضافة مقال: أضيفي عنصراً جديداً في `BLOG_POSTS_RAW` داخل نفس الملف، ثم `npm run build`.
الصفحات تُبنى مسبقاً (SSG) عبر `generateStaticParams`، و`app/sitemap.ts` يضيف روابطها تلقائياً.

## 💰 تفعيل إعلانات AdSense

الإعلانات مفعّلة **بشرطين** معاً حتى لا تظهر وحدات فارغة أو غير مصرّح بها:

1. `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX` في `.env.local` (ونفسه في Vercel).
2. ملء معرّفات الوحدات في `lib/ads.ts`:
   - `inArticle` — وحدة داخل المقالات (بعد المقدمة).
   - `blogTop` — أعلى قائمة المدونة.
   - `blogBottom` — أسفل قائمة المدونة.

السكربت يُحمَّل عبر `next/script` بـ`afterInteractive` في `app/layout.tsx`.
الوحدات لها ارتفاع محجوز `min-h` لتفادي اهتزاز التخطيط (Cumulative Layout Shift).

صفحات `privacy` و`terms` و`contact` مضافة كشرط أساسي لاعتماد AdSense، وتشرح
استخدام ملفات ارتباط Google AdSense وبيانات المستخدم وحقوقه.

## 🧮 كيف تُحسب نسبة التوافق؟
- كل متطلب مهارة له وزن: **إلزامية = 2**، **اختيارية = 1**.
- درجة كل مهارة = `min(مستواك ÷ المستوى المطلوب, 1)`.
- النتيجة = المتوسط المرجح × 100 **− 20 نقطة عن كل مهارة إلزامية ناقصة تماماً** (بحد أدنى 0).

## ⚠️ ملاحظات أمنية
سياسات RLS في `schema.sql` مفتوحة لتشغيل النسخة التجريبية بدون تسجيل دخول
(مستخدم تجريبي ثابت `demo-user`). قبل الإنتاج الحقيقي فعّلي Supabase Auth
وقيّدي السياسات على `auth.uid()`.
