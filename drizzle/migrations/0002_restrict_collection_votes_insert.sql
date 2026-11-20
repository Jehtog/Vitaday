DROP POLICY IF EXISTS "Anyone can vote for a collection" ON public.collection_votes;
CREATE POLICY "Anyone can vote for a known collection" ON public.collection_votes
FOR INSERT TO anon, authenticated
WITH CHECK (collection IN ('glow','balance','active','focus','cycle','junior'));