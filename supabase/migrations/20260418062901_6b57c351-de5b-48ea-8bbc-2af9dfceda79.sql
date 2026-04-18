-- Helper trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- TOOLS
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  description TEXT DEFAULT '',
  created_by TEXT DEFAULT '',
  created_method TEXT DEFAULT '',
  github_account TEXT,
  deploy_method TEXT,
  deploy_email TEXT,
  release_date TEXT,
  link TEXT,
  version TEXT,
  categories TEXT[] NOT NULL DEFAULT '{}',
  price TEXT,
  target TEXT,
  done BOOLEAN NOT NULL DEFAULT false,
  goal TEXT,
  plan_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  small_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  plan_status TEXT NOT NULL DEFAULT 'none',
  ai_report TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tools_select_own" ON public.tools FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tools_insert_own" ON public.tools FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tools_update_own" ON public.tools FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tools_delete_own" ON public.tools FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_tools_updated BEFORE UPDATE ON public.tools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_tools_user ON public.tools(user_id);

-- NOTES
CREATE TABLE public.tool_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tool_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes_select_own" ON public.tool_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert_own" ON public.tool_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update_own" ON public.tool_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete_own" ON public.tool_notes FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_notes_updated BEFORE UPDATE ON public.tool_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_notes_tool ON public.tool_notes(tool_id);
CREATE INDEX idx_notes_user ON public.tool_notes(user_id);

-- IDEAS
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ideas_select_own" ON public.ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ideas_insert_own" ON public.ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ideas_update_own" ON public.ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ideas_delete_own" ON public.ideas FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_ideas_updated BEFORE UPDATE ON public.ideas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_ideas_user ON public.ideas(user_id);

-- SAVED OPTIONS (emails, platforms, github accounts, deploy targets)
CREATE TABLE public.saved_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL, -- 'email' | 'platform' | 'github' | 'deploy'
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, kind, value)
);
ALTER TABLE public.saved_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opt_select_own" ON public.saved_options FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "opt_insert_own" ON public.saved_options FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "opt_delete_own" ON public.saved_options FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_opt_user_kind ON public.saved_options(user_id, kind);