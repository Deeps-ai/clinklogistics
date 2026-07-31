import { createFileRoute, Outlet, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [{ title: "Admin — C Link Logistics & Shipping" }],
  }),
});

function AdminLayout() {
  const router = useRouter();
  const [session, setSession] = useState<{ email?: string } | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      setSession(user ? { email: user.email } : null);
      if (user?.email) {
        supabase
          .from("admin_users")
          .select("id")
          .eq("email", user.email)
          .maybeSingle()
          .then(({ data: adminRow }) => {
            setIsAdmin(Boolean(adminRow));
          });
      } else {
        setIsAdmin(false);
      }
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    router.invalidate();
  }

  return (
    <div className="min-h-screen bg-sand text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link to="/admin" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-sm bg-navy-deep text-sm font-bold text-background">CL</span>
              <span className="text-sm font-semibold tracking-tight">
                C Link <span className="font-normal text-muted-foreground">Admin</span>
              </span>
            </Link>
            {session && (
              <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground font-medium" }} className="hover:text-foreground transition-colors">Shipments</Link>
                <Link to="/admin/create" activeProps={{ className: "text-foreground font-medium" }} className="hover:text-foreground transition-colors">New Shipment</Link>
                <Link to="/track" className="hover:text-foreground transition-colors">View Tracking</Link>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3">
            {session?.email && (
              <span className="hidden sm:block text-xs text-muted-foreground">{session.email}</span>
            )}
            {session && (
              <button
                onClick={handleLogout}
                className="rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-sand hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {session === undefined ? (
          <div className="flex items-center justify-center py-32">
            <p className="text-sm text-muted-foreground">Checking session…</p>
          </div>
        ) : !session ? (
          <div className="max-w-md mx-auto mt-16">
            <div className="rounded-lg border border-border bg-card p-8">
              <p className="font-display text-2xl leading-tight text-foreground">
                Admin sign in
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in with your C Link Supabase account to manage shipments.
              </p>
              <AdminLogin onSuccess={(email) => { setSession({ email }); setIsAdmin(true); }} />
            </div>
          </div>
        ) : isAdmin === null ? (
          <div className="flex items-center justify-center py-32">
            <p className="text-sm text-muted-foreground">Checking permissions…</p>
          </div>
        ) : isAdmin ? (
          <Outlet />
        ) : (
          <div className="max-w-md mx-auto mt-16 rounded-lg border border-border bg-card p-8 text-center">
            <p className="font-display text-2xl leading-tight text-foreground">Access restricted</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account isn't registered as an admin. Contact the site owner to request access.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSuccess(data.user?.email ?? email);
  }

return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      <label className="grid gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ember transition-colors placeholder:text-muted-foreground/60"
          placeholder="admin@clinkshipping.com"
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ember transition-colors placeholder:text-muted-foreground/60"
          placeholder="••••••••"
        />
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-navy-deep px-4 py-2.5 text-sm font-medium text-background hover:bg-ember disabled:opacity-60 transition-colors"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

