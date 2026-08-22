-- ============================================================
-- MIHAN — مخطط قاعدة البيانات (Supabase / PostgreSQL) — نسخة الإنتاج
-- شغّلي هذا الملف كاملاً في SQL Editor داخل لوحة تحكم Supabase.
-- يتطلب تفعيل Supabase Auth (Email/Password).
--
-- السياسات أدناه تعتمد على auth.uid():
-- - الجداول الخاصة بالمستخدمة (user_skills, assessments, projects,
--   learning_path_items): كل مستخدمة ترى وتعدّل بياناتها فقط.
-- - الجداول المرجعية (skills, opportunities): قراءة للمستخدمات
--   المسجلات فقط، والكتابة عبر مفتاح الخدمة (service_role) من الخادم.
-- ============================================================

-- ---------- 0) ترقية من النسخة التجريبية ----------
-- تحويل عمود user_id من نص 'demo-user' إلى uuid مرتبط بـ auth.users.
-- القسم آمن للتشغيل على قاعدة جديدة (لن يفعل شيئاً إذا كانت الأعمدة uuid).
do $$
declare t text;
begin
  foreach t in array array['user_skills', 'assessments', 'projects', 'learning_path_items'] loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public'
        and table_name = t
        and column_name = 'user_id'
        and data_type = 'text'
    ) then
      -- حذف بيانات الوضع التجريبي قبل التحويل
      execute format('delete from public.%I where user_id = %L', t, 'demo-user');
      execute format('alter table public.%I alter column user_id drop default', t);
      execute format('alter table public.%I alter column user_id type uuid using nullif(user_id, '''')::uuid', t);
      execute format('alter table public.%I alter column user_id set not null', t);
      execute format(
        'alter table public.%I add constraint %I foreign key (user_id) references auth.users(id) on delete cascade',
        t, t || '_user_fk'
      );
    end if;
  end loop;
end $$;

-- ---------- 1) المهارات (مرجعية) ----------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null unique,
  category text not null default 'general',
  created_at timestamptz not null default now()
);

-- ---------- 2) مهارات المستخدم ----------
create table if not exists public.user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete cascade,
  level int not null default 1 check (level between 0 and 5),
  created_at timestamptz not null default now(),
  unique (user_id, skill_id)
);

-- ---------- 3) الفرص الوظيفية (مرجعية) ----------
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  company text,
  description text,
  location text,
  employment_type text,
  -- الصيغة: [{"skill_id": "...", "level": 3, "is_required": true}]
  required_skills jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (title_ar)
);

-- ---------- 4) نتائج التقييم ----------
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  results jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------- 5) المشاريع ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  skills_used text[] not null default '{}',
  link text,
  created_at timestamptz not null default now()
);

-- ---------- 6) عناصر مسار التعلم ----------
create table if not exists public.learning_path_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  skill_id uuid references public.skills (id) on delete set null,
  opportunity_id uuid references public.opportunities (id) on delete set null,
  title text not null,
  resource_url text,
  resource_type text not null default 'article', -- article | video | course | practice
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- فهارس لتحسين الأداء ----------
create index if not exists idx_user_skills_user on public.user_skills (user_id);
create index if not exists idx_projects_user on public.projects (user_id);
create index if not exists idx_learning_user on public.learning_path_items (user_id);
create index if not exists idx_assessments_user on public.assessments (user_id);

-- ============================================================
-- Row Level Security — نسخة الإنتاج
-- ============================================================
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.opportunities enable row level security;
alter table public.assessments enable row level security;
alter table public.projects enable row level security;
alter table public.learning_path_items enable row level security;

-- ---------- إزالة سياسات النسخة التجريبية المفتوحة ----------
drop policy if exists "skills_public" on public.skills;
drop policy if exists "user_skills_public" on public.user_skills;
drop policy if exists "opportunities_public" on public.opportunities;
drop policy if exists "assessments_public" on public.assessments;
drop policy if exists "projects_public" on public.projects;
drop policy if exists "learning_public" on public.learning_path_items;

-- ---------- الجداول المرجعية: قراءة للمستخدمات المسجلات فقط ----------
drop policy if exists "skills_select_authenticated" on public.skills;
create policy "skills_select_authenticated"
  on public.skills for select
  to authenticated
  using (auth.role() = 'authenticated');

drop policy if exists "opportunities_select_authenticated" on public.opportunities;
create policy "opportunities_select_authenticated"
  on public.opportunities for select
  to authenticated
  using (auth.role() = 'authenticated');

-- ---------- مهارات المستخدمة: كل مستخدمة ملفها فقط ----------
-- حذف سياسات النسخة المفتوحة/التجريبية ثم إنشاء سياسة موحّدة
drop policy if exists "user_skills_public" on public.user_skills;
drop policy if exists "user_skills_select_own" on public.user_skills;
drop policy if exists "user_skills_insert_own" on public.user_skills;
drop policy if exists "user_skills_update_own" on public.user_skills;
drop policy if exists "user_skills_delete_own" on public.user_skills;
drop policy if exists "Users can manage own data" on public.user_skills;
create policy "Users can manage own data"
  on public.user_skills for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- نتائج التقييم ----------
drop policy if exists "assessments_select_own" on public.assessments;
create policy "assessments_select_own"
  on public.assessments for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "assessments_insert_own" on public.assessments;
create policy "assessments_insert_own"
  on public.assessments for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "assessments_update_own" on public.assessments;
create policy "assessments_update_own"
  on public.assessments for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "assessments_delete_own" on public.assessments;
create policy "assessments_delete_own"
  on public.assessments for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------- المشاريع ----------
drop policy if exists "projects_public" on public.projects;
drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;
drop policy if exists "Users can manage own data" on public.projects;
create policy "Users can manage own data"
  on public.projects for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- عناصر مسار التعلم ----------
drop policy if exists "learning_public" on public.learning_path_items;
drop policy if exists "learning_path_select_own" on public.learning_path_items;
drop policy if exists "learning_path_insert_own" on public.learning_path_items;
drop policy if exists "learning_path_update_own" on public.learning_path_items;
drop policy if exists "learning_path_delete_own" on public.learning_path_items;
drop policy if exists "Users can manage own data" on public.learning_path_items;
create policy "Users can manage own data"
  on public.learning_path_items for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 7) حسابات الجهات العمل والمنظمات — ميزة نشر الفرص
-- ============================================================
-- نوع الحساب يُخزَّن في auth.users (raw_user_meta_data->>'user_type')
-- بقيمتي 'seeker' (افتراضي) أو 'organization'، ويُنشأ صف المنظمة هنا.

create table if not exists public.organizations (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  description text,
  website text,
  logo_url text,
  contact_email text,
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;

drop policy if exists "organizations_select_own" on public.organizations;
create policy "organizations_select_own"
  on public.organizations for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "organizations_insert_own" on public.organizations;
create policy "organizations_insert_own"
  on public.organizations for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "organizations_update_own" on public.organizations;
create policy "organizations_update_own"
  on public.organizations for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------- أعمدة جديدة على الفرص الوظيفية ----------
alter table public.opportunities add column if not exists organization_id uuid references public.organizations (id) on delete set null;
alter table public.opportunities add column if not exists posted_by uuid references auth.users (id) on delete set null;
alter table public.opportunities add column if not exists url text;
alter table public.opportunities add column if not exists status text not null default 'active';

create index if not exists idx_opportunities_posted_by on public.opportunities (posted_by);
create index if not exists idx_opportunities_organization on public.opportunities (organization_id);

-- ---------- سياسات الكتابة على الفرص لصاحبة الجهة ----------
-- القراءة تبقى للمستخدمات المسجلات كما هي (opportunities_select_authenticated).
drop policy if exists "opportunities_insert_own_org" on public.opportunities;
create policy "opportunities_insert_own_org"
  on public.opportunities for insert
  to authenticated
  with check (
    posted_by = auth.uid()
    and organization_id = auth.uid()
    and exists (
      select 1 from public.organizations o where o.id = auth.uid()
    )
  );

drop policy if exists "opportunities_update_own_org" on public.opportunities;
create policy "opportunities_update_own_org"
  on public.opportunities for update
  to authenticated
  using (posted_by = auth.uid())
  with check (posted_by = auth.uid());

drop policy if exists "opportunities_delete_own_org" on public.opportunities;
create policy "opportunities_delete_own_org"
  on public.opportunities for delete
  to authenticated
  using (posted_by = auth.uid());
