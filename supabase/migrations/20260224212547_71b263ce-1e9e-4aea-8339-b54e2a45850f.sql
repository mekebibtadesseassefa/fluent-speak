
-- ═══════════════════════════════════════════════════════════
-- FEB3 CORE SCHEMA — M1: Auth & Identity + M2: Companies
-- ═══════════════════════════════════════════════════════════

-- Role enum
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'sub_admin_ops',
  'sub_admin_finance',
  'sub_admin_content',
  'pedagogical_lead',
  'content_curator',
  'teacher',
  'student',
  'company_hr',
  'company_finance'
);

-- ─── Profiles ───
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  cpf TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ─── User Roles (separate table per security requirements) ───
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  granted_by UUID REFERENCES public.profiles(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ─── Companies ───
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  join_code TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 6),
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'plus', 'enterprise')),
  employee_limit INT NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'terminated')),
  billing_email TEXT,
  allow_individual_upgrades BOOLEAN NOT NULL DEFAULT true,
  language_restriction TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- ─── Company Employees ───
CREATE TABLE public.company_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT false,
  verified_year INT,
  exit_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, user_id)
);

ALTER TABLE public.company_employees ENABLE ROW LEVEL SECURITY;

-- ─── Teachers ───
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  languages_taught TEXT[] NOT NULL DEFAULT '{}',
  languages_spoken TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  specializations TEXT[] DEFAULT '{}',
  max_weekly_load INT NOT NULL DEFAULT 20,
  hourly_rate_private NUMERIC(10,2) DEFAULT 0,
  hourly_rate_group NUMERIC(10,2) DEFAULT 0,
  mei_cnpj TEXT,
  pix_key TEXT,
  country_of_origin TEXT,
  current_city TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- ─── Subscription Plans ───
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_brl NUMERIC(10,2) NOT NULL,
  hours_per_week INT NOT NULL DEFAULT 0,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('individual', 'corporate')),
  features JSONB DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- ─── Subscriptions ───
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id),
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'paused', 'cancelled', 'expired')),
  hours_per_week INT NOT NULL DEFAULT 0,
  current_period_start DATE,
  current_period_end DATE,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ─── Content Frameworks ───
CREATE TABLE public.content_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  source_type TEXT,
  api_config JSONB DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  color TEXT DEFAULT 'bg-primary',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_frameworks ENABLE ROW LEVEL SECURITY;

-- ─── Content Items ───
CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID REFERENCES public.content_frameworks(id),
  title TEXT NOT NULL,
  subtitle TEXT,
  source_url TEXT,
  embed_url TEXT,
  thumbnail_url TEXT,
  transcript_text TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  level_min TEXT NOT NULL DEFAULT 'B1',
  level_max TEXT NOT NULL DEFAULT 'C1',
  perspective TEXT DEFAULT 'neutral' CHECK (perspective IN ('global_south', 'global_north', 'neutral')),
  topic_tags TEXT[] DEFAULT '{}',
  duration_seconds INT DEFAULT 0,
  published_week INT,
  published_year INT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  curator_id UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- ─── Teacher Availability ───
CREATE TABLE public.teacher_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_students INT NOT NULL DEFAULT 1,
  current_bookings INT NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;

-- ─── Classes ───
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('private', 'group')),
  language TEXT NOT NULL,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id),
  availability_slot_id UUID REFERENCES public.teacher_availability(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  capacity INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  content_item_id UUID REFERENCES public.content_items(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- ─── Class Bookings ───
CREATE TABLE public.class_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  agenda_text TEXT,
  agenda_submitted_at TIMESTAMPTZ,
  attended BOOLEAN,
  teacher_notes TEXT,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  deducted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;

-- ─── Student Preferences ───
CREATE TABLE public.student_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  languages TEXT[] DEFAULT '{}',
  content_streams TEXT[] DEFAULT '{}',
  learning_goal TEXT,
  baseline_confidence INT DEFAULT 3,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.student_preferences ENABLE ROW LEVEL SECURITY;

-- ─── Session Reflections ───
CREATE TABLE public.session_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  reflection_text TEXT,
  confidence_score INT CHECK (confidence_score BETWEEN 1 AND 5),
  expression_saved TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.session_reflections ENABLE ROW LEVEL SECURITY;

-- ─── Vocabulary Saves ───
CREATE TABLE public.vocabulary_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.content_items(id),
  word TEXT NOT NULL,
  context_sentence TEXT,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vocabulary_saves ENABLE ROW LEVEL SECURITY;

-- ─── Teacher Payouts ───
CREATE TABLE public.teacher_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  gross_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  nfe_number TEXT,
  paid_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_payouts ENABLE ROW LEVEL SECURITY;

-- ─── Payments ───
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id),
  amount_brl NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'pix' CHECK (payment_method IN ('pix', 'card', 'invoice')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  pix_qr_code TEXT,
  nfe_number TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ─── Feature Flags ───
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- ─── Methodology Versions ───
CREATE TABLE public.methodology_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.methodology_versions ENABLE ROW LEVEL SECURITY;

-- ─── Methodology Phases ───
CREATE TABLE public.methodology_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID NOT NULL REFERENCES public.methodology_versions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  student_instruction TEXT,
  teacher_prompt TEXT,
  default_duration_minutes INT NOT NULL DEFAULT 10,
  applies_to TEXT NOT NULL DEFAULT 'both' CHECK (applies_to IN ('self_study', 'live_class', 'both')),
  level_adaptations JSONB DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.methodology_phases ENABLE ROW LEVEL SECURITY;

-- ─── Audit Log ───
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  actor_role TEXT,
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- ─── Weekly Class Usage ───
CREATE TABLE public.weekly_class_usage (
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  week_start DATE NOT NULL,
  classes_used INT NOT NULL DEFAULT 0,
  classes_allowed INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, week_start)
);

ALTER TABLE public.weekly_class_usage ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════
-- SECURITY DEFINER HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role AND is_active = true
  )
$$;

CREATE OR REPLACE FUNCTION public.is_any_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'sub_admin_ops', 'sub_admin_finance', 'sub_admin_content')
      AND is_active = true
  )
$$;

CREATE OR REPLACE FUNCTION public.is_company_member(_user_id UUID, _company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_employees
    WHERE user_id = _user_id AND company_id = _company_id AND active = true
  )
$$;

CREATE OR REPLACE FUNCTION public.is_company_hr_of(_user_id UUID, _company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.company_employees ce ON ce.user_id = ur.user_id
    WHERE ur.user_id = _user_id
      AND ur.role = 'company_hr'
      AND ur.is_active = true
      AND ce.company_id = _company_id
      AND ce.active = true
  )
$$;

-- ═══════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_any_admin(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User Roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.is_any_admin(auth.uid()));
CREATE POLICY "Super admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users can insert own initial role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Companies
CREATE POLICY "Anyone can view active companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Admins can manage companies" ON public.companies FOR ALL USING (public.is_any_admin(auth.uid()));

-- Company Employees
CREATE POLICY "Admins can manage employees" ON public.company_employees FOR ALL USING (public.is_any_admin(auth.uid()));
CREATE POLICY "HR can manage own company employees" ON public.company_employees FOR ALL USING (
  public.is_company_hr_of(auth.uid(), company_id)
);
CREATE POLICY "Users can view own employee record" ON public.company_employees FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join company" ON public.company_employees FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Teachers
CREATE POLICY "Anyone can view active teachers" ON public.teachers FOR SELECT USING (active = true);
CREATE POLICY "Teachers can manage own profile" ON public.teachers FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admins can manage all teachers" ON public.teachers FOR ALL USING (public.is_any_admin(auth.uid()));

-- Subscription Plans (public read)
CREATE POLICY "Anyone can view plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans" ON public.subscription_plans FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions FOR ALL USING (public.is_any_admin(auth.uid()));
CREATE POLICY "Users can create own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Content Frameworks (public read)
CREATE POLICY "Anyone can view frameworks" ON public.content_frameworks FOR SELECT USING (true);
CREATE POLICY "Content admins can manage frameworks" ON public.content_frameworks FOR ALL USING (
  public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'sub_admin_content')
);

-- Content Items
CREATE POLICY "Anyone can view published content" ON public.content_items FOR SELECT USING (status = 'published');
CREATE POLICY "Admins and curators can view all content" ON public.content_items FOR SELECT USING (
  public.is_any_admin(auth.uid()) OR public.has_role(auth.uid(), 'content_curator') OR public.has_role(auth.uid(), 'pedagogical_lead')
);
CREATE POLICY "Content roles can manage content" ON public.content_items FOR ALL USING (
  public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'sub_admin_content') OR public.has_role(auth.uid(), 'content_curator')
);

-- Teacher Availability
CREATE POLICY "Teachers can manage own availability" ON public.teacher_availability FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Anyone can view available slots" ON public.teacher_availability FOR SELECT USING (available = true);
CREATE POLICY "Admins can manage availability" ON public.teacher_availability FOR ALL USING (public.is_any_admin(auth.uid()));

-- Classes
CREATE POLICY "Anyone can view classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Teachers can manage own classes" ON public.classes FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Admins can manage all classes" ON public.classes FOR ALL USING (public.is_any_admin(auth.uid()));

-- Class Bookings
CREATE POLICY "Students can view own bookings" ON public.class_bookings FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create bookings" ON public.class_bookings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own bookings" ON public.class_bookings FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Teachers can view class bookings" ON public.class_bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.teacher_id = auth.uid())
);
CREATE POLICY "Admins can manage all bookings" ON public.class_bookings FOR ALL USING (public.is_any_admin(auth.uid()));

-- Student Preferences
CREATE POLICY "Students can manage own preferences" ON public.student_preferences FOR ALL USING (auth.uid() = user_id);

-- Session Reflections
CREATE POLICY "Users can manage own reflections" ON public.session_reflections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all reflections" ON public.session_reflections FOR SELECT USING (public.is_any_admin(auth.uid()));

-- Vocabulary Saves
CREATE POLICY "Users can manage own vocabulary" ON public.vocabulary_saves FOR ALL USING (auth.uid() = user_id);

-- Teacher Payouts
CREATE POLICY "Teachers can view own payouts" ON public.teacher_payouts FOR SELECT USING (auth.uid() = teacher_id);
CREATE POLICY "Finance admins can manage payouts" ON public.teacher_payouts FOR ALL USING (
  public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'sub_admin_finance')
);

-- Payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.id = subscription_id AND s.user_id = auth.uid())
);
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (public.is_any_admin(auth.uid()));

-- Feature Flags (public read)
CREATE POLICY "Anyone can read feature flags" ON public.feature_flags FOR SELECT USING (true);
CREATE POLICY "Super admins can manage flags" ON public.feature_flags FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Methodology
CREATE POLICY "Anyone can read active methodology" ON public.methodology_versions FOR SELECT USING (true);
CREATE POLICY "Admins can manage methodology" ON public.methodology_versions FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Anyone can read phases" ON public.methodology_phases FOR SELECT USING (true);
CREATE POLICY "Admins can manage phases" ON public.methodology_phases FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Audit Log
CREATE POLICY "Admins can view audit log" ON public.audit_log FOR SELECT USING (public.is_any_admin(auth.uid()));
CREATE POLICY "System can insert audit log" ON public.audit_log FOR INSERT WITH CHECK (true);

-- Weekly Class Usage
CREATE POLICY "Users can view own usage" ON public.weekly_class_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all usage" ON public.weekly_class_usage FOR ALL USING (public.is_any_admin(auth.uid()));

-- ═══════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ═══════════════════════════════════════════════════════════
-- SEED: Default subscription plans
-- ═══════════════════════════════════════════════════════════
INSERT INTO public.subscription_plans (name, price_brl, hours_per_week, plan_type, features) VALUES
  ('Free', 0, 0, 'individual', '{"group_class_monthly": 1, "self_study": true}'::jsonb),
  ('Individual Basic', 129, 1, 'individual', '{"private_weekly": 1, "group_class": true, "self_study": true}'::jsonb),
  ('Individual Plus', 229, 2, 'individual', '{"private_weekly": 2, "group_class": true, "self_study": true}'::jsonb),
  ('Corporate Basic', 179, 1, 'corporate', '{"private_weekly": 1, "hr_dashboard": true}'::jsonb),
  ('Corporate Plus', 299, 2, 'corporate', '{"private_weekly": 2, "hr_dashboard": true, "esg_report": true}'::jsonb),
  ('Corporate Enterprise', 0, 0, 'corporate', '{"custom": true, "dedicated_facilitators": true}'::jsonb);

-- Seed: Default feature flags
INSERT INTO public.feature_flags (name, description, enabled) VALUES
  ('AI Chat in Self-Study', 'Allow students to ask AI questions about content during self-study sessions.', true),
  ('Vocabulary Save', 'Enable word highlighting and saving to personal vocabulary list.', true),
  ('Group Class Auto-Create', 'Automatically create group classes when student count exceeds capacity.', false),
  ('ESG Reporting', 'Enable social impact and ESG reporting for Corporate Plus companies.', false),
  ('Maintenance Mode', 'Show maintenance page to all non-admin users.', false);

-- Seed: Default content frameworks
INSERT INTO public.content_frameworks (name, description, source_type, active, sort_order, color) VALUES
  ('Fluent with TED', 'TED Talks curated for language learners across all levels.', 'TED / YouTube', true, 1, 'bg-destructive'),
  ('Fluent with News', 'Current affairs from global outlets for topical discussion.', 'NewsAPI / Guardian', true, 2, 'bg-primary'),
  ('Fluent with Global South', 'Perspectives from Africa, Latin America, and Asia.', 'RSS / Manual', true, 3, 'bg-success'),
  ('Fluent with Business', 'Professional and corporate communication content.', 'HBR / Manual', true, 4, 'bg-accent'),
  ('Fluent with Culture', 'Arts, music, cinema, and cultural identity.', 'Manual', false, 5, 'bg-admin'),
  ('Fluent with Science', 'Science communication and environmental topics.', 'Manual', false, 6, 'bg-navy');

-- Seed: Default methodology
INSERT INTO public.methodology_versions (id, version_number, status, published_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', '2.1', 'active', now());

INSERT INTO public.methodology_phases (version_id, name, student_instruction, teacher_prompt, default_duration_minutes, applies_to, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Phase 1: Full Immersion', 'Watch the full talk without pausing. Focus on the overall message.', 'Let the student watch/listen without interruption. Observe engagement.', 15, 'both', 1),
  ('a0000000-0000-0000-0000-000000000001', 'Phase 2: Key Ideas & Expressions', 'Note 2-3 key ideas and 3-5 useful expressions from the content.', 'Ask: What stood out? Which expressions would you like to use?', 10, 'both', 2),
  ('a0000000-0000-0000-0000-000000000001', 'Phase 3: Fluency Activation', 'Retell the talk aloud for 2-3 minutes in your own words.', 'Listen without correcting. Note emergent language for Phase 5.', 10, 'both', 3),
  ('a0000000-0000-0000-0000-000000000001', 'Phase 4: Facilitated Discussion', 'Discuss the topic with your facilitator. Share your perspective.', 'Guide discussion using student agenda. Expand on their ideas.', 15, 'live_class', 4),
  ('a0000000-0000-0000-0000-000000000001', 'Phase 5: Language Mining', 'Identify 1-2 grammar structures from the transcript to study.', 'Highlight patterns from Phase 3 output. Reformulate together.', 5, 'both', 5),
  ('a0000000-0000-0000-0000-000000000001', 'Phase 6: Re-voicing', 'Express the talk''s idea in your own words using new expressions.', 'Encourage integration of mined language. Provide gentle scaffolding.', 10, 'both', 6),
  ('a0000000-0000-0000-0000-000000000001', 'Phase 7: Expression Takeaway', 'Save 2 expressions you want to reuse this week.', 'Help student select high-utility expressions. Suggest contexts.', 5, 'both', 7);
