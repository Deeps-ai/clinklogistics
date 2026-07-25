
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  email text NOT NULL,
  origin text,
  destination text,
  cargo text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT ALL ON public.contact_submissions TO service_role;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enquiry"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) > 0 AND length(name) <= 200
    AND length(email) > 0 AND length(email) <= 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (company IS NULL OR length(company) <= 200)
    AND (origin IS NULL OR length(origin) <= 200)
    AND (destination IS NULL OR length(destination) <= 200)
    AND (cargo IS NULL OR length(cargo) <= 4000)
  );
