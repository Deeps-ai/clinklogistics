import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createShipment } from "@/server/functions";

export const Route = createFileRoute("/admin/create")({
  component: AdminCreateShipment,
});

const MODES = ["sea", "air", "rail", "road"];
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

function AdminCreateShipment() {
  const router = useRouter();
  const [form, setForm] = useState({
    tracking_number: "",
    reference: "",
    origin: "",
    destination: "",
    mode: "sea",
    status: "booked",
    current_location: "",
    eta: "",
    shipper: "",
    consignee: "",
    cargo: "",
    customer_email: "",
    notify: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ trackingLink?: string; notificationStatus?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
    setResult(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await createShipment({
        data: {
          tracking_number: form.tracking_number.trim(),
          reference: form.reference.trim() || null,
          origin: form.origin.trim(),
          destination: form.destination.trim(),
          mode: form.mode,
          status: form.status,
          current_location: form.current_location.trim() || null,
          eta: form.eta ? new Date(form.eta).toISOString() : null,
          shipper: form.shipper.trim() || null,
          consignee: form.consignee.trim() || null,
          cargo: form.cargo.trim() || null,
          customer_email: form.customer_email.trim() || null,
          notify: form.notify,
          baseUrl: typeof window !== "undefined" ? window.location.origin : "",
        },
      });
      setResult({
        trackingLink: res?.trackingLink ?? undefined,
        notificationStatus: res?.notificationStatus ?? undefined,
      });
      router.invalidate();
      setForm((f) => ({
        tracking_number: "",
        reference: "",
        origin: "",
        destination: "",
        mode: "sea",
        status: "booked",
        current_location: "",
        eta: "",
        shipper: "",
        consignee: "",
        cargo: "",
        customer_email: "",
        notify: true,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create shipment.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-ember transition-colors placeholder:text-muted-foreground/60";
  const labelCls = "text-xs font-medium text-muted-foreground";
  const wrapCls = "grid gap-1.5";

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Admin</p>
        <h1 className="font-display text-3xl md:text-4xl leading-tight text-foreground mt-1">
          Create a shipment
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the shipment details below. Optionally notify the customer by email with their tracking link.
        </p>
      </div>

      {result && (
        <div className="mb-8 rounded-lg border border-green-400 bg-green-100 dark:bg-green-900/30 px-5 py-4">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">Shipment created successfully.</p>
          {result.notificationStatus === "sent" && (
            <p className="mt-1 text-xs text-green-700 dark:text-green-400">Tracking email sent to customer.</p>
          )}
          {result.notificationStatus === "failed" && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
              Shipment created but the email failed to send. Check your Resend configuration.
            </p>
          )}
          {result.trackingLink && (
            <div className="mt-3">
              <p className="text-xs text-green-700 dark:text-green-400 mb-1">Tracking link:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all rounded bg-background border border-green-400 px-3 py-1.5 text-xs text-green-800 dark:text-green-300">
                  {result.trackingLink}
                </code>
                <button
                  onClick={() => navigator.clipboard?.writeText(result.trackingLink ?? "")}
                  className="rounded border border-green-400 px-2.5 py-1.5 text-xs font-medium text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mb-8 rounded-lg border border-red-400 bg-red-100 dark:bg-red-900/30 px-5 py-4 text-sm text-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 md:p-8 grid gap-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <label className={wrapCls}>
            <span className={labelCls}>Tracking Number *</span>
            <input
              required
              className={inputCls}
              placeholder="e.g. CLK-2026-0003"
              value={form.tracking_number}
              onChange={(e) => update("tracking_number", e.target.value)}
            />
          </label>
          <label className={wrapCls}>
            <span className={labelCls}>Reference</span>
            <input
              className={inputCls}
              placeholder="e.g. PO-90000"
              value={form.reference}
              onChange={(e) => update("reference", e.target.value)}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <label className={wrapCls}>
            <span className={labelCls}>Origin *</span>
            <input
              required
              className={inputCls}
              placeholder="e.g. Mundra, IN"
              value={form.origin}
              onChange={(e) => update("origin", e.target.value)}
            />
          </label>
          <label className={wrapCls}>
            <span className={labelCls}>Destination *</span>
            <input
              required
              className={inputCls}
              placeholder="e.g. Jebel Ali, AE"
              value={form.destination}
              onChange={(e) => update("destination", e.target.value)}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <label className={wrapCls}>
            <span className={labelCls}>Mode</span>
            <select className={inputCls} value={form.mode} onChange={(e) => update("mode", e.target.value)}>
              {MODES.map((m) => (
                <option key={m} value={m}>{m.toUpperCase()}</option>
              ))}
            </select>
          </label>
          <label className={wrapCls}>
            <span className={labelCls}>Status</span>
            <select className={inputCls} value={form.status} onChange={(e) => update("status", e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <label className={wrapCls}>
            <span className={labelCls}>Current Location</span>
            <input
              className={inputCls}
              placeholder="e.g. Arabian Sea"
              value={form.current_location}
              onChange={(e) => update("current_location", e.target.value)}
            />
          </label>
          <label className={wrapCls}>
            <span className={labelCls}>ETA</span>
            <input
              type="datetime-local"
              className={inputCls}
              value={form.eta}
              onChange={(e) => update("eta", e.target.value)}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <label className={wrapCls}>
            <span className={labelCls}>Shipper</span>
            <input
              className={inputCls}
              placeholder="Shipper company"
              value={form.shipper}
              onChange={(e) => update("shipper", e.target.value)}
            />
          </label>
          <label className={wrapCls}>
            <span className={labelCls}>Consignee</span>
            <input
              className={inputCls}
              placeholder="Consignee company"
              value={form.consignee}
              onChange={(e) => update("consignee", e.target.value)}
            />
          </label>
        </div>

        <label className={wrapCls}>
          <span className={labelCls}>Cargo Details</span>
          <textarea
            rows={2}
            className={inputCls}
            placeholder="Type, weight, dimensions, container no…"
            value={form.cargo}
            onChange={(e) => update("cargo", e.target.value)}
          />
        </label>

        <div className="grid sm:grid-cols-2 gap-6 items-end">
          <label className={wrapCls}>
            <span className={labelCls}>Customer Email</span>
            <input
              type="email"
              className={inputCls}
              placeholder="customer@company.com"
              value={form.customer_email}
              onChange={(e) => update("customer_email", e.target.value)}
            />
          </label>
          <label className="flex items-center gap-3 pb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={form.notify}
              onChange={(e) => update("notify", e.target.checked)}
              className="size-4 accent-ember"
            />
            <span className="text-sm text-foreground/80">Send tracking email via Resend</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-navy-deep px-6 py-3 text-sm font-medium text-background hover:bg-ember disabled:opacity-60 transition-colors"
          >
            {submitting ? "Creating…" : "Create shipment"}
          </button>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
