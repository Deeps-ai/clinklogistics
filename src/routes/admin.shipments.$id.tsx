import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { addTrackingEvent, updateShipmentStatus, deleteShipment, exportShipment } from "@/server/functions";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/shipments/$id")({
  component: AdminShipmentDetail,
});

type Shipment = Tables<"shipments">;
type TrackingEvent = Tables<"tracking_events">;

const STATUSES = [
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
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function AdminShipmentDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [notifications, setNotifications] = useState<Tables<"notifications">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [evStatus, setEvStatus] = useState("in_transit");
  const [evLocation, setEvLocation] = useState("");
  const [evNotes, setEvNotes] = useState("");
  const [evSaving, setEvSaving] = useState(false);
  const [evMessage, setEvMessage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    setError(null);
    const { data: shipmentData, error: shipErr } = await supabase
      .from("shipments")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (shipErr) {
      setError(shipErr.message);
      setLoading(false);
      return;
    }
    setShipment((shipmentData ?? null) as Shipment | null);

    if (shipmentData) {
      const [{ data: evData }, { data: notifData }] = await Promise.all([
        supabase.from("tracking_events").select("*").eq("shipment_id", shipmentData.id).order("event_at", { ascending: false }),
        supabase.from("notifications").select("*").eq("shipment_id", shipmentData.id).order("created_at", { ascending: false }),
      ]);
      setEvents((evData ?? []) as TrackingEvent[]);
      setNotifications((notifData ?? []) as Tables<"notifications">[]);
    }
    setLoading(false);
  }

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!shipment) return;
    setEvSaving(true);
    setEvMessage(null);
    try {
      await addTrackingEvent({
        data: {
          shipment_id: shipment.id,
          status: evStatus,
          location: evLocation.trim() || null,
          notes: evNotes.trim() || null,
          event_at: new Date().toISOString(),
        },
      });
      setEvLocation("");
      setEvNotes("");
      setEvMessage("Milestone added and shipment status updated.");
      load();
    } catch (err) {
      setEvMessage(err instanceof Error ? err.message : "Failed to add milestone.");
    } finally {
      setEvSaving(false);
    }
  }

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!shipment) return;
    const status = e.target.value;
    setEvMessage(null);
    try {
      await updateShipmentStatus({ data: { shipment_id: shipment.id, status } });
      setEvMessage("Shipment status updated.");
      load();
    } catch (err) {
      setEvMessage(err instanceof Error ? err.message : "Failed to update status.");
    }
  }

  if (loading) {
    return <div className="flex justify-center py-32"><p className="text-sm text-muted-foreground">Loading shipment…</p></div>;
  }

  if (error || !shipment) {
    return (
      <div className="max-w-md mx-auto mt-16 rounded-lg border border-red-400 bg-red-100 dark:bg-red-900/30 p-8 text-center">
        <p className="font-display text-2xl text-red-800 dark:text-red-300">Shipment not found</p>
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error ?? "The shipment may have been deleted."}</p>
        <Link to="/admin" className="mt-4 inline-block text-sm font-medium text-foreground underline">← Back to shipments</Link>
      </div>
    );
  }

  const trackingLink = `${typeof window !== "undefined" ? window.location.origin : ""}/track?trace=${encodeURIComponent(shipment.tracking_number)}`;

  return (
    <div>
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to shipments
      </Link>

      <div className="mt-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Shipment</p>
          <h1 className="font-display text-3xl md:text-4xl leading-tight text-foreground mt-1">
            {shipment.tracking_number}
          </h1>
          {shipment.reference && <p className="mt-1 text-sm text-muted-foreground">Ref · {shipment.reference}</p>}
        </div>
        <div className="flex items-center flex-wrap gap-3">
          <button
            onClick={async () => {
              setExporting(true);
              try {
                const data = await exportShipment({ data: { shipment_id: shipment.id } });
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${shipment.tracking_number}-export.json`;
                a.click();
                URL.revokeObjectURL(url);
                setEvMessage("Shipment data exported successfully.");
              } catch (err) {
                setEvMessage(err instanceof Error ? err.message : "Export failed.");
              } finally {
                setExporting(false);
              }
            }}
            disabled={exporting}
            className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-60 transition-colors"
          >
            {exporting ? "Exporting…" : "Download JSON"}
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(trackingLink)}
            className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            Copy tracking link
          </button>
          <a
            href={trackingLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-navy-deep px-4 py-2 text-xs font-medium text-background hover:bg-ember transition-colors"
          >
            View public page →
          </a>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="rounded-md border border-red-400 bg-red-100 dark:bg-red-900/30 px-3 py-2 text-xs font-medium text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  setDeleting(true);
                  try {
                    await deleteShipment({ data: { shipment_id: shipment.id } });
                    router.navigate({ to: "/admin" });
                  } catch (err) {
                    setEvMessage(err instanceof Error ? err.message : "Delete failed.");
                    setConfirmDelete(false);
                  } finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting}
                className="rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {deleting ? "Deleting…" : "Confirm delete"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {evMessage && (
        <div className="mt-4 rounded-md border border-green-400 bg-green-100 dark:bg-green-900/30 px-4 py-2.5 text-sm text-green-800 dark:text-green-300">
          {evMessage}
        </div>
      )}

      <div className="mt-8 grid lg:grid-cols-12 gap-8">
        {/* Left: shipment details + status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Status</p>
              <select
                value={shipment.status}
                onChange={handleStatusChange}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground outline-none focus:border-ember transition-colors"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{prettyStatus(s)}</option>
                ))}
              </select>
            </div>
            <dl className="mt-5 divide-y divide-border text-sm">
              <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Mode</dt><dd className="font-medium text-foreground">{prettyStatus(shipment.mode)}</dd></div>
              <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Route</dt><dd className="font-medium text-foreground">{shipment.origin} → {shipment.destination}</dd></div>
              <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Current location</dt><dd className="font-medium text-foreground">{shipment.current_location ?? "—"}</dd></div>
              <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">ETA</dt><dd className="font-medium text-foreground">{shipment.eta ? formatDate(shipment.eta) : "—"}</dd></div>
              <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Shipper</dt><dd className="font-medium text-foreground">{shipment.shipper ?? "—"}</dd></div>
              <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Consignee</dt><dd className="font-medium text-foreground">{shipment.consignee ?? "—"}</dd></div>
              <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Cargo</dt><dd className="font-medium text-foreground">{shipment.cargo ?? "—"}</dd></div>
              <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Customer email</dt><dd className="font-medium text-foreground">{shipment.customer_email ?? "—"}</dd></div>
              <div className="flex justify-between py-2.5"><dt className="text-muted-foreground">Created</dt><dd className="font-medium text-foreground">{formatDate(shipment.created_at)}</dd></div>
            </dl>
          </div>

          {/* Add milestone */}
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Add Milestone</p>
            <form onSubmit={handleAddEvent} className="mt-4 grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Status</span>
                <select
                  value={evStatus}
                  onChange={(e) => setEvStatus(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ember transition-colors"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{prettyStatus(s)}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Location</span>
                <input
                  value={evLocation}
                  onChange={(e) => setEvLocation(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ember transition-colors placeholder:text-muted-foreground/60"
                  placeholder="e.g. Mundra Port, IN"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Notes</span>
                <textarea
                  rows={2}
                  value={evNotes}
                  onChange={(e) => setEvNotes(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ember transition-colors resize-none placeholder:text-muted-foreground/60"
                  placeholder="e.g. Vessel departed on schedule."
                />
              </label>
              <button
                type="submit"
                disabled={evSaving}
                className="rounded-md bg-navy-deep px-4 py-2.5 text-sm font-medium text-background hover:bg-ember disabled:opacity-60 transition-colors"
              >
                {evSaving ? "Saving…" : "Add milestone"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: events + notifications */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Milestones ({events.length})</p>
            {events.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No milestones recorded yet.</p>
            ) : (
              <ol className="mt-4 space-y-0">
                {events.map((ev, i) => (
                  <li key={ev.id} className="relative pl-8 pb-6 last:pb-0">
                    {i !== events.length - 1 && (
                      <span className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
                    )}
                    <span className={`absolute left-0 top-1 size-[23px] rounded-full border grid place-items-center ${i === 0 ? "border-ember bg-ember" : "border-border bg-card"}`}>
                      <span className={`size-2 rounded-full ${i === 0 ? "bg-background" : "bg-muted-foreground"}`} />
                    </span>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold text-sm text-foreground">{prettyStatus(ev.status)}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(ev.event_at)}</span>
                    </div>
                    {ev.location && <p className="mt-0.5 text-sm text-foreground/80">{ev.location}</p>}
                    {ev.notes && <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{ev.notes}</p>}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Email Notifications ({notifications.length})</p>
              <ul className="mt-4 space-y-3">
                {notifications.map((n) => (
                  <li key={n.id} className="flex items-center justify-between gap-4 rounded-md border border-border bg-muted px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.subject ?? "Tracking update"}</p>
                      <p className="text-xs text-muted-foreground">to {n.email} · {new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      n.status === "sent" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" : n.status === "failed" ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {n.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
