-- ============================================================
-- Production-ready enhancements:
--  1. customer_email on shipments (for Resend notifications)
--  2. notifications table (track email delivery)
--  3. admin_users table (admin panel authorization)
--  4. RLS policies for delete/export security
-- ============================================================

-- 1. Customer email on shipments
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS customer_email TEXT;

-- 2. Notifications / email log
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'shipment_created',
  subject TEXT,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | sent | failed
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_message_id TEXT,
  sent_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_shipment_idx
  ON public.notifications(shipment_id, created_at DESC);

GRANT ALL ON public.notifications TO service_role;
GRANT SELECT ON public.notifications TO authenticated;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Admin users (email allow-list for the admin panel)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_users TO service_role;
GRANT SELECT ON public.admin_users TO authenticated;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view admin list"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Seed a default admin (replace with your own email)
-- INSERT INTO public.admin_users (email, display_name) VALUES ('admin@clinkshipping.com', 'Admin');

-- ============================================================
-- 4. Security: Row Level Security for DELETE operations
-- Only the service_role (server-side via supabaseAdmin) can delete
-- ============================================================

-- Contact submissions: only service_role can delete
DROP POLICY IF EXISTS "Anyone can delete contact submissions" ON public.contact_submissions;
CREATE POLICY "Service role only can delete contact submissions"
  ON public.contact_submissions
  FOR DELETE
  TO service_role
  USING (true);

-- Authenticated (admin panel) can VIEW contact submissions
CREATE POLICY "Authenticated can view contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Shipments: only service_role can delete
CREATE POLICY "Service role only can delete shipments"
  ON public.shipments
  FOR DELETE
  TO service_role
  USING (true);

-- Tracking events: only service_role can delete
CREATE POLICY "Service role only can delete tracking events"
  ON public.tracking_events
  FOR DELETE
  TO service_role
  USING (true);

-- Notifications: only service_role can delete
CREATE POLICY "Service role only can delete notifications"
  ON public.notifications
  FOR DELETE
  TO service_role
  USING (true);

