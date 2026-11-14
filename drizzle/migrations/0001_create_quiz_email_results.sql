CREATE TABLE public.quiz_email_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  primary_preset text NOT NULL CHECK (primary_preset IN ('essential','glow','balance','active','focus','cycle','junior')),
  secondary_preset text CHECK (secondary_preset IN ('essential','glow','balance','active','focus','cycle','junior')),
  consent boolean NOT NULL DEFAULT false CHECK (consent = true),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quiz_email_results TO anon, authenticated;
GRANT ALL ON public.quiz_email_results TO service_role;
ALTER TABLE public.quiz_email_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can save a quiz result" ON public.quiz_email_results FOR INSERT TO anon, authenticated WITH CHECK (true);