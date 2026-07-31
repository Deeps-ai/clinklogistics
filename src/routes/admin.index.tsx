import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type Shipment = Tables<"shipments">;

function prettyStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function AdminDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setShipments((data ?? []) as Shipment[]);
    setLoading(false);
  }

  const filtered = search.trim()
    ? shipments.filter(
        (s) =>
          s.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
          (s.reference ?? "").toLowerCase().includes(search.toLowerCase()) ||
          s.origin.toLowerCase().includes(search.toLowerCase()) ||
          s.destination.toLowerCase().includes(search.toLowerCase())
      )
    : shipments;

  const statusColor: Record<string, string> = {
    booked: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    gate_in: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
    loaded: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    in_transit: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    transhipment: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    customs_clearance: "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
    delivered: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Shipments</p>
          <h1 className="font-display text-3xl md:text-4xl leading-tight text-foreground mt-1">
            Manage your cargo.
          </h1>
        </div>
        <Link
          to="/admin/create"
          className="inline-flex items-center gap-2 rounded-md bg-navy-deep px-4 py-2.5 text-sm font-medium text-background hover:bg-ember transition-colors"
        >
          <span className="text-base leading-none">+</span> New Shipment
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by tracking number, reference, origin or destination…"
          className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-ember transition-colors placeholder:text-muted-foreground/60"
        />
      </div>

      {error && (
        <div className="rounded-md border border-red-400 bg-red-100 dark:bg-red-900/30 px-4 py-3 text-sm text-red-800 dark:text-red-300 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card px-8 py-16 text-center">
          <p className="font-display text-xl text-foreground">No shipments found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {search ? "Try a different search term." : "Create your first shipment to get started."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Tracking #</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Mode</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Customer Email</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    <Link to="/admin/shipments/$id" params={{ id: s.id }} className="hover:text-ember transition-colors">
                      {s.tracking_number}
                    </Link>
                    {s.reference && (
                      <span className="block text-xs font-normal text-muted-foreground">Ref {s.reference}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground/80">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground uppercase text-xs">
                    {prettyStatus(s.mode)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[s.status] ?? "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"}`}>
                      {prettyStatus(s.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                    {s.customer_email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(s.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to="/admin/shipments/$id"
                      params={{ id: s.id }}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

