
-- Fix audit log INSERT policy to only allow authenticated users
DROP POLICY "System can insert audit log" ON public.audit_log;
CREATE POLICY "Authenticated users can insert audit log" ON public.audit_log 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
