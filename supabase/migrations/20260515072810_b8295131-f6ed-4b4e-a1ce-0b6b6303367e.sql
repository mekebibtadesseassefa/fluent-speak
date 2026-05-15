
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS email_domains text[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_companies_email_domains
  ON public.companies USING GIN (email_domains);

-- Allow public (anonymous) inserts of pending companies via the signup page
DROP POLICY IF EXISTS "Public can submit company signup" ON public.companies;
CREATE POLICY "Public can submit company signup"
  ON public.companies
  FOR INSERT
  WITH CHECK (status = 'pending');
