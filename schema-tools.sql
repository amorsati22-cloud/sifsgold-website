-- Sif's Gold Tools — optional saved calculator presets
-- Run after public.profiles exists.

CREATE TABLE IF NOT EXISTS public.tool_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  preset_name text NOT NULL,
  preset_data jsonb NOT NULL DEFAULT '{}',
  favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tool_presets_user_tool_idx
  ON public.tool_presets (user_id, tool_name);

ALTER TABLE public.tool_presets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own tool presets" ON public.tool_presets;
CREATE POLICY "Users manage own tool presets"
  ON public.tool_presets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
