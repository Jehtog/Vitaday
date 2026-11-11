CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  collection text NOT NULL CHECK (collection IN ('glow','balance','active','focus','cycle','junior')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.waitlist_signups TO anon, authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join a waitlist" ON public.waitlist_signups FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  source text NOT NULL DEFAULT 'site' CHECK (char_length(source) <= 50),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_signups TO anon, authenticated;
GRANT ALL ON public.newsletter_signups TO service_role;
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can sign up for the newsletter" ON public.newsletter_signups FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.collection_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection text NOT NULL CHECK (collection IN ('glow','balance','active','focus','cycle','junior')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.collection_votes TO anon, authenticated;
GRANT ALL ON public.collection_votes TO service_role;
ALTER TABLE public.collection_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can vote for a collection" ON public.collection_votes FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.get_collection_vote_counts()
RETURNS TABLE (collection text, votes bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT collection, count(*)::bigint FROM public.collection_votes GROUP BY collection
$$;
GRANT EXECUTE ON FUNCTION public.get_collection_vote_counts() TO anon, authenticated;