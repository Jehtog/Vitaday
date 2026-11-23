CREATE TABLE public.bot_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  product_id text,
  quantity integer,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bot_events TO anon, authenticated;
GRANT ALL ON public.bot_events TO service_role;
ALTER TABLE public.bot_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log a valid store event" ON public.bot_events FOR INSERT TO anon, authenticated
WITH CHECK (
  event = ANY (ARRAY['add_to_cart','whatsapp_click'])
  AND (product_id IS NULL OR product_id = ANY (ARRAY['starter-kit','bottle','refill-7','refill-28','subscription-28']))
  AND (quantity IS NULL OR (quantity BETWEEN 1 AND 99))
  AND char_length(source) BETWEEN 1 AND 50
);