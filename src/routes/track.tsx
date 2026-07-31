import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import clinkLogo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

function MobileNav({ onClose }: { onClose: () => void }) {
  return (
    <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
      <nav className="container-x py-6 flex flex-col gap-4 text-sm">
        <Link to="/" hash="services" onClick={onClose} className="flex items-center justify-between py-2 hover:text-ember transition-colors"><span>Services</span><span className="text-muted-foreground">→</span></Link>
        <Link to="/vision-mission" onClick={onClose} className="flex items-center justify-between py-2 hover:text-ember transition-colors"><span>Vision & Mission</span><span className="text-muted-foreground">→</span></Link>
        <Link to="/track" onClick={onClose} className="flex items-center justify-between py-2 hover:text-ember transition-colors"><span>Track</span><span className="text-muted-foreground">→</span></Link>
        <Link to="/" hash="contact" onClick={onClose} className="flex items-center justify-between py-2 hover:text-ember transition-colors"><span>Contact</span><span className="text-muted-foreground">→</span></Link>
        <Link to="/" hash="contact" onClick={onClose} className="mt-4 inline-flex items-center justify-center gap-2 rounded-sm bg-navy-deep dark:bg-foreground/15 px-4 py-3 text-xs font-medium tracking-wide text-background dark:text-foreground hover:bg-ember transition-colors text-center">
          Request a Quote <span>→</span>
        </Link>
      </nav>
    </div>
  );
}

export const Route = createFileRoute("/track")({
  component: TrackPage,
  head: () => ({
    meta: [
      { title: "Track a Shipment — C Link Logistics & Shipping" },
      {
        name: "description",
        content:
          "Track your C Link Logistics shipment. Enter a tracking number or reference to see live status, current location and timestamped milestones.",
      },
      { property: "og:title", content: "Track a Shipment — C Link Logistics & Shipping" },
      {
        property: "og:description",
        content:
          "Live shipment tracking across sea, air, rail and road — status updates and timestamps for every milestone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Shipment = {
  id: string;
  tracking_number: string;
  reference: string | null;
  origin: string;
  destination: string;
  mode: string;
  status: string;
  current_location: string | null;
  eta: string | null;
  shipper: string | null;
  consignee: string | null;
  cargo: string | null;
  customer_email: string | null;
  updated_at: string;
};

type TrackingEvent = {
  id: string;
  status: string;
  location: string | null;
  notes: string | null;
  event_at: string;
};

type Result =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "not_found"; query: string }
  | { kind: "error"; message: string }
  | { kind: "found"; shipment: Shipment; events: TrackingEvent[] };

const STATUS_STEPS = [
  "booked",
  "gate_in",
  "loaded",
  "in_transit",
  "transhipment",
  "customs_clearance",
  "out_for_delivery",
  "delivered",
];

function prettyStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function fetchShipment(query: string): Promise<Extract<Result, { kind: "found" }> | Extract<Result, { kind: "not_found" | "error" }>> {
  try {
    const { data: shipment, error } = await supabase
      .from("shipments")
      .select("*")
      .or(`tracking_number.eq.${query},reference.eq.${query}`)
      .maybeSingle();
    if (error) throw error;
    if (!shipment) {
      return { kind: "not_found", query };
    }
    const { data: events, error: evErr } = await supabase
      .from("tracking_events")
      .select("*")
      .eq("shipment_id", shipment.id)
      .order("event_at", { ascending: false });
    if (evErr) throw evErr;
    return { kind: "found", shipment: shipment as Shipment, events: (events ?? []) as TrackingEvent[] };
  } catch (err) {
    return {
      kind: "error",
      message: err instanceof Error ? err.message : "Unable to fetch tracking. Please try again.",
    };
  }
}

function TrackPage() {
  const search = useSearch({ strict: false }) as { trace?: string };
  const [query, setQuery] = useState(search.trace ?? "");
  const [result, setResult] = useState<Result>({ kind: "idle" });
  const supabaseAvailable = isSupabaseConfigured();

  // Auto-load when arriving with a ?trace= query param (from email tracking links)
  useEffect(() => {
    if (!supabaseAvailable) return;
    if (search.trace) {
      setQuery(search.trace);
      setResult({ kind: "loading" });
      fetchShipment(search.trace).then((res) => setResult(res));
    }
  }, [search.trace, supabaseAvailable]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (!supabaseAvailable) {
      setResult({ kind: "error", message: "Tracking database is not connected. This feature will be available once the backend is configured." });
      return;
    }
    setResult({ kind: "loading" });
    const res = await fetchShipment(q);
    setResult(res);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <section className="bg-navy-deep text-background">
        <div className="container-x pt-24 pb-20 md:pt-32 md:pb-28">
          <p className="eyebrow text-background/60 mb-8">Track a Shipment</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance max-w-4xl">
            Where is your cargo, <em>right now</em>?
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-background/70 leading-relaxed">
            Enter your C Link tracking number or booking reference to see the current status, location and every
            timestamped milestone along the way.
          </p>

          <form onSubmit={onSubmit} className="mt-10 max-w-2xl">
            <label htmlFor="tracking" className="sr-only">
              Tracking number or reference
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="tracking"
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="e.g. CLK-2026-0001 or PO-88421"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 rounded-sm bg-background/10 border border-background/20 px-4 py-3 text-background placeholder:text-background/40 focus:outline-none focus:border-ember transition-colors"
              />
              <button
                type="submit"
                disabled={result.kind === "loading" || !query.trim()}
                className="group inline-flex items-center justify-center gap-2 rounded-sm bg-ember px-6 py-3 text-sm font-medium tracking-wide text-background hover:bg-background hover:text-navy-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {result.kind === "loading" ? "Searching…" : "Track"}
                <span aria-hidden className="arrow-slide">→</span>
              </button>
            </div>
            {supabaseAvailable ? (
              <p className="mt-3 text-xs text-background/50">
                Try <button type="button" onClick={() => setQuery("CLK-2026-0001")} className="underline underline-offset-2 hover:text-ember">CLK-2026-0001</button>
                {" "}or{" "}
                <button type="button" onClick={() => setQuery("CLK-2026-0002")} className="underline underline-offset-2 hover:text-ember">CLK-2026-0002</button>
                {" "}as a demo.
              </p>
            ) : (
              <p className="mt-3 text-xs text-amber-300/70">
                ⚡ Backend not configured — tracking will activate once Supabase is connected.
              </p>
            )}
          </form>
        </div>
      </section>

      <section className="container-x py-16 md:py-24">
        {!supabaseAvailable && result.kind === "idle" && (
          <div className="rounded-lg border border-border bg-card p-10 md:p-14 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center justify-center size-16 rounded-full bg-sand text-ember mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            </span>
            <h3 className="font-display text-3xl md:text-4xl leading-tight text-foreground">Shipment tracking — coming soon</h3>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto leading-relaxed">
              We're connecting our live tracking database. Drop us an email at{" "}
              <a href="mailto:shatru@clinkshipping.com" className="text-foreground underline underline-offset-2 hover:text-ember transition-colors">shatru@clinkshipping.com</a>{" "}
              or call <a href="tel:+919899800655" className="text-foreground underline underline-offset-2 hover:text-ember transition-colors">+91 98998 00655</a> and our team will locate your shipment.
            </p>
          </div>
        )}

        {supabaseAvailable && result.kind === "idle" && (
          <p className="text-muted-foreground max-w-xl">
            No search yet. Enter a tracking number above to see your shipment's journey.
          </p>
        )}

        {result.kind === "loading" && (
          <div className="max-w-xl">
            <div className="h-8 w-64 animate-pulse rounded bg-border/60" />
            <div className="mt-6 h-4 w-full max-w-md animate-pulse rounded bg-border/60" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-border/60" />
          </div>
        )}

        {result.kind === "not_found" && (
          <div className="max-w-xl">
            <p className="eyebrow mb-3">No match</p>
            <h2 className="font-display text-3xl md:text-4xl leading-tight text-balance">
              We couldn't find a shipment for <em>{result.query}</em>.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Double-check the tracking number or reference. If it still doesn't appear, email{" "}
              <a href="mailto:shatru@clinkshipping.com" className="link-underline text-foreground">shatru@clinkshipping.com</a>{" "}
              or call <a href="tel:+919899800655" className="link-underline text-foreground">+91 98998 00655</a> and our desk will locate it.
            </p>
          </div>
        )}

        {result.kind === "error" && (
          <div className="max-w-xl">
            <p className="eyebrow text-ember mb-3">Something went wrong</p>
            <p className="text-muted-foreground">{result.message}</p>
          </div>
        )}

        {result.kind === "found" && (
          <ShipmentDetail shipment={result.shipment} events={result.events} />
        )}
      </section>

      <Footer />
    </div>
  );
}

function ShipmentDetail({ shipment, events }: { shipment: Shipment; events: TrackingEvent[] }) {
  const [copied, setCopied] = useState(false);
  const trackingLink = `${typeof window !== "undefined" ? window.location.origin : ""}/track?trace=${encodeURIComponent(shipment.tracking_number)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(trackingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = trackingLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div>
      {/* Status progress stepper */}
      <div className="rounded-sm border border-border bg-card p-6 md:p-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow mb-1">Current Status</p>
            <p className="font-display text-3xl md:text-4xl leading-tight text-ember">
              {prettyStatus(shipment.status)}
            </p>
            {shipment.current_location && (
              <p className="mt-1 text-sm text-muted-foreground">
                Currently at {shipment.current_location}
              </p>
            )}
          </div>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 self-start rounded-sm border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:border-ember hover:text-ember transition-colors"
          >
            {copied ? "Copied!" : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Copy tracking link
              </>
            )}
          </button>
        </div>
        <StatusStepper current={shipment.status} />
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-3">Shipment</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.02] tracking-tight">
            {shipment.tracking_number}
          </h2>
          {shipment.reference && (
            <p className="mt-2 text-sm text-muted-foreground">Ref · {shipment.reference}</p>
          )}

          <dl className="mt-8 divide-y divide-border border-y border-border">
            <Row label="Status" value={prettyStatus(shipment.status)} highlight />
            <Row label="Mode" value={prettyStatus(shipment.mode)} />
            <Row label="Origin" value={shipment.origin} />
            <Row label="Destination" value={shipment.destination} />
            {shipment.current_location && <Row label="Current location" value={shipment.current_location} />}
            {shipment.eta && <Row label="ETA" value={formatDate(shipment.eta)} />}
            {shipment.shipper && <Row label="Shipper" value={shipment.shipper} />}
            {shipment.consignee && <Row label="Consignee" value={shipment.consignee} />}
            {shipment.cargo && <Row label="Cargo" value={shipment.cargo} />}
            <Row label="Last updated" value={formatDate(shipment.updated_at)} />
          </dl>
        </div>

        <div className="lg:col-span-7">
          <p className="eyebrow mb-3">Milestones</p>
          <h3 className="font-display text-3xl md:text-4xl leading-[1.05] tracking-tight mb-8">
            A timestamped record of every hand-off.
          </h3>

          {events.length === 0 ? (
            <p className="text-muted-foreground">No milestones recorded yet.</p>
          ) : (
            <ol className="relative border-l border-border pl-6 space-y-8">
              {events.map((ev, i) => (
                <li key={ev.id} className="group relative">
                  <span
                    aria-hidden
                    className={`absolute -left-[29px] top-1 grid size-4 place-items-center rounded-full border ${
                      i === 0 ? "bg-ember border-ember" : "bg-background border-border"
                    }`}
                  >
                    <span className={`size-1.5 rounded-full ${i === 0 ? "bg-background" : "bg-muted-foreground"}`} />
                  </span>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-display text-xl leading-tight">{prettyStatus(ev.status)}</p>
                    <time className="text-xs uppercase tracking-wider text-muted-foreground">
                      {formatDate(ev.event_at)}
                    </time>
                  </div>
                  {ev.location && <p className="mt-1 text-sm text-foreground/80">{ev.location}</p>}
                  {ev.notes && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{ev.notes}</p>}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusStepper({ current }: { current: string }) {
  const currentIndex = STATUS_STEPS.indexOf(current);
  const activeIndex = currentIndex >= 0 ? currentIndex : STATUS_STEPS.length - 1;

  return (
    <div>
      <div className="flex items-center">
        {STATUS_STEPS.map((step, i) => {
          const isDone = i <= activeIndex;
          const isCurrent = i === activeIndex;
          return (
            <div key={step} className={`flex items-center ${i < STATUS_STEPS.length - 1 ? "flex-1" : ""}`}>
              {/* dot */}
              <div className="flex flex-col items-center shrink-0">
                <span
                  className={`grid size-5 place-items-center rounded-full border transition-colors ${
                    isDone ? "bg-ember border-ember text-background" : "bg-card border-border text-muted-foreground"
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${isDone ? "bg-background" : "bg-muted-foreground"}`} />
                </span>
                <span className={`mt-2 hidden md:block text-[10px] uppercase tracking-wider whitespace-nowrap ${isCurrent ? "text-foreground font-medium" : isDone ? "text-ember" : "text-muted-foreground/70"}`}>
                  {step.replace(/_/g, " ")}
                </span>
              </div>
              {/* connector */}
              {i < STATUS_STEPS.length - 1 && (
                <div className={`mx-1 md:mx-2 h-px flex-1 ${i < activeIndex ? "bg-ember" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile label of current status */}
      <p className="mt-3 text-center text-xs uppercase tracking-wider text-muted-foreground md:hidden">
        {prettyStatus(current)}
      </p>
    </div>
  );
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={`text-right text-sm ${highlight ? "font-semibold text-ember" : "text-foreground"}`}>
        {value}
      </dd>
    </div>
  );
}

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src={clinkLogo}
            alt="C Link Logistics & Shipping Line logo"
            className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-sm font-semibold tracking-tight transition-colors group-hover:text-ember">
            C Link <span className="text-muted-foreground font-normal">Logistics</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" hash="services" className="link-underline hover:text-foreground transition-colors">Services</Link>
          <Link to="/vision-mission" className="link-underline hover:text-foreground transition-colors">Vision & Mission</Link>
          <Link to="/track" className="link-underline hover:text-foreground transition-colors">Track</Link>
          <Link to="/" hash="contact" className="link-underline hover:text-foreground transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/"
            hash="contact"
            className="group hidden sm:inline-flex items-center gap-2 rounded-sm bg-navy-deep dark:bg-foreground/15 px-4 py-2 text-xs font-medium tracking-wide text-background dark:text-foreground hover:bg-ember transition-colors"
          >
            Request a Quote
            <span aria-hidden className="arrow-slide">→</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center size-10 rounded-sm border border-border text-foreground hover:bg-sand transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-x py-10 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} C Link Logistics & Shipping Pvt Ltd · Est. 2024 · Dubai · Karachi · Afghanistan</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
          <a href="mailto:shatru@clinkshipping.com" className="link-underline hover:text-foreground">shatru@clinkshipping.com</a>
          <a href="mailto:Info@clinkshipping.com" className="link-underline hover:text-foreground">Info@clinkshipping.com</a>
          <a href="tel:+919899800655" className="link-underline hover:text-foreground">+91 98998 00655</a>
        </div>
      </div>
    </footer>
  );
}

