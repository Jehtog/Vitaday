DROP POLICY IF EXISTS "Anyone can save a quiz result" ON public.quiz_email_results;
CREATE POLICY "Anyone can save a valid quiz result" ON public.quiz_email_results
FOR INSERT TO anon, authenticated
WITH CHECK (
  consent = true
  AND char_length(email) BETWEEN 3 AND 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND primary_preset IN ('essential','glow','balance','active','focus','cycle','junior')
  AND (secondary_preset IS NULL OR secondary_preset IN ('essential','glow','balance','active','focus','cycle','junior'))
);
DROP POLICY IF EXISTS "Anyone can sign up for the newsletter" ON public.newsletter_signups;
CREATE POLICY "Anyone can sign up with a valid email" ON public.newsletter_signups
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(email) BETWEEN 3 AND 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(source) BETWEEN 1 AND 50
);
DROP POLICY IF EXISTS "Anyone can join a waitlist" ON public.waitlist_signups;
CREATE POLICY "Anyone can join a known waitlist" ON public.waitlist_signups
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(email) BETWEEN 3 AND 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND collection IN ('glow','balance','active','focus','cycle','junior')
);