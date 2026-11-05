ALTER TABLE public.sales_leads
  ADD COLUMN rating text,
  ADD COLUMN lead_score text,
  ADD COLUMN lead_tier text;

COMMENT ON COLUMN public.sales_leads.rating IS 'Google rating imported from the leads Data sheet';
COMMENT ON COLUMN public.sales_leads.lead_score IS 'Lead score imported from the leads Data sheet';
COMMENT ON COLUMN public.sales_leads.lead_tier IS 'Lead tier imported from the leads Data sheet';