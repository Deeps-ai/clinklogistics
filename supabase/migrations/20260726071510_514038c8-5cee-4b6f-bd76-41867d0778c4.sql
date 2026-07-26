
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT NOT NULL UNIQUE,
  reference TEXT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'sea',
  status TEXT NOT NULL DEFAULT 'booked',
  current_location TEXT,
  eta TIMESTAMPTZ,
  shipper TEXT,
  consignee TEXT,
  cargo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shipments TO anon, authenticated;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can look up shipments" ON public.shipments FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  event_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX tracking_events_shipment_idx ON public.tracking_events(shipment_id, event_at DESC);
GRANT SELECT ON public.tracking_events TO anon, authenticated;
GRANT ALL ON public.tracking_events TO service_role;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view tracking events" ON public.tracking_events FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER shipments_set_updated_at BEFORE UPDATE ON public.shipments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sample data
INSERT INTO public.shipments (tracking_number, reference, origin, destination, mode, status, current_location, eta, shipper, consignee, cargo)
VALUES
  ('CLK-2026-0001', 'PO-88421', 'Mundra, IN', 'Jebel Ali, AE', 'sea', 'in_transit', 'Arabian Sea', now() + interval '4 days', 'Indus Exporters Pvt Ltd', 'Gulf Traders LLC', '1 x 40HC — Textiles'),
  ('CLK-2026-0002', 'PO-88515', 'New Delhi, IN', 'Tashkent, UZ', 'rail', 'customs_clearance', 'Bandar Abbas, IR', now() + interval '9 days', 'North Star Agro', 'Silk Route Distribution', '18 pallets — Agri produce');

INSERT INTO public.tracking_events (shipment_id, status, location, notes, event_at)
SELECT id, 'booked', 'Mundra, IN', 'Booking confirmed. Container assigned.', now() - interval '6 days' FROM public.shipments WHERE tracking_number = 'CLK-2026-0001';
INSERT INTO public.tracking_events (shipment_id, status, location, notes, event_at)
SELECT id, 'gate_in', 'Mundra Port, IN', 'Container gated-in at terminal.', now() - interval '4 days' FROM public.shipments WHERE tracking_number = 'CLK-2026-0001';
INSERT INTO public.tracking_events (shipment_id, status, location, notes, event_at)
SELECT id, 'loaded', 'Mundra Port, IN', 'Loaded on vessel MV Al Nasr.', now() - interval '3 days' FROM public.shipments WHERE tracking_number = 'CLK-2026-0001';
INSERT INTO public.tracking_events (shipment_id, status, location, notes, event_at)
SELECT id, 'in_transit', 'Arabian Sea', 'Vessel underway. On schedule.', now() - interval '1 days' FROM public.shipments WHERE tracking_number = 'CLK-2026-0001';

INSERT INTO public.tracking_events (shipment_id, status, location, notes, event_at)
SELECT id, 'booked', 'New Delhi, IN', 'Rail booking confirmed via ICD Tughlakabad.', now() - interval '12 days' FROM public.shipments WHERE tracking_number = 'CLK-2026-0002';
INSERT INTO public.tracking_events (shipment_id, status, location, notes, event_at)
SELECT id, 'departed', 'ICD Tughlakabad, IN', 'Consignment dispatched by rail to Mundra.', now() - interval '10 days' FROM public.shipments WHERE tracking_number = 'CLK-2026-0002';
INSERT INTO public.tracking_events (shipment_id, status, location, notes, event_at)
SELECT id, 'transhipment', 'Bandar Abbas, IR', 'Discharged and staged for onward rail to CIS.', now() - interval '2 days' FROM public.shipments WHERE tracking_number = 'CLK-2026-0002';
INSERT INTO public.tracking_events (shipment_id, status, location, notes, event_at)
SELECT id, 'customs_clearance', 'Bandar Abbas, IR', 'Customs documentation under review.', now() - interval '12 hours' FROM public.shipments WHERE tracking_number = 'CLK-2026-0002';
