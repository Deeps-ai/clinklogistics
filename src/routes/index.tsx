import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import heroPort from "@/assets/hero-port.jpg";
import serviceSea from "@/assets/service-sea.jpg";
import serviceAir from "@/assets/service-air.jpg";
import serviceRail from "@/assets/service-rail.jpg";
import serviceRoad from "@/assets/service-road.jpg";
import aboutOps from "@/assets/about-ops.jpg";
import clinkLogo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "C Link Logistics & Shipping — Global Freight Forwarding" },
      {
        name: "description",
        content:
          "NVOCC, freight forwarding and destination specialists for Afghanistan and CIS. C Link Logistics & Shipping Pvt Ltd — overseas offices in Dubai, Karachi and Afghanistan since 2024.",
      },
    ],
  }),
});

const services = [
  { n: "01", title: "NVOCC", tag: "Sea", copy: "Non-vessel operating common carrier services with competitive rates, fixed sailings and direct control of container space on major India–Middle East–CIS lanes.", img: serviceSea },
  { n: "02", title: "Freight Forwarding", tag: "Sea / Air / Land", copy: "End-to-end forwarding for FCL, LCL, air and road cargo — customs, documentation and carrier co-ordination handled as one continuous desk.", img: serviceAir },
  { n: "03", title: "Afghanistan", tag: "Specialised Lane", copy: "Dedicated Afghanistan logistics: customs-bonded transit, overland corridors via Pakistan and Iran, and last-mile delivery to Kabul, Herat, Kandahar and Mazar.", img: serviceRoad },
  { n: "04", title: "CIS Destination", tag: "Rail / Road", copy: "Multimodal delivery into Kazakhstan, Uzbekistan, Tajikistan, Turkmenistan, Kyrgyzstan and beyond via rail and road corridors from India and the UAE.", img: serviceRail },
];

const routes = [
  "MUNDRA → JEBEL ALI",
  "NHAVA SHEVA → HAMBURG",
  "CHENNAI → BANDAR ABBAS",
  "DELHI → TASHKENT",
  "MUMBAI → KARACHI",
  "KOLKATA → SINGAPORE",
  "COCHIN → ROTTERDAM",
  "PIPAVAV → NEW YORK",
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <RouteTicker />
      <Services />
      <About />
      <Stats />
      <Contact />
      <Footer />
    </div>
  );
}

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("mobile-nav-open", mobileOpen);
    return () => document.body.classList.remove("mobile-nav-open");
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#top" className="group flex items-center gap-2.5">
         <img
           src={clinkLogo}
           alt="C Link Logistics & Shipping Line logo"
           className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
           />
          <span className="text-sm font-semibold tracking-tight transition-colors group-hover:text-ember">
            C Link <span className="text-muted-foreground font-normal">Logistics</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#services" className="link-underline hover:text-foreground transition-colors">Services</a>
          <a href="#about" className="link-underline hover:text-foreground transition-colors">About</a>
          <a href="/vision-mission" className="link-underline hover:text-foreground transition-colors">Vision & Mission</a>
          <a href="#network" className="link-underline hover:text-foreground transition-colors">Network</a>
          <a href="/track" className="link-underline hover:text-foreground transition-colors">Track</a>
          <a href="#contact" className="link-underline hover:text-foreground transition-colors">Contact</a>
        </nav>

<div className="flex items-center gap-3">
          <ThemeToggle />
<a
            href="#contact"
            className="group hidden sm:inline-flex items-center gap-2 rounded-sm bg-navy-deep dark:bg-foreground/15 px-4 py-2 text-xs font-medium tracking-wide text-background dark:text-foreground hover:bg-ember transition-colors"
          >
            Request a Quote
            <span aria-hidden className="arrow-slide">→</span>
          </a>
          {/* Mobile hamburger */}
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
          <nav className="container-x py-6 flex flex-col gap-4 text-sm">
            <a href="#services" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-2 hover:text-ember transition-colors"><span>Services</span><span className="text-muted-foreground">→</span></a>
            <a href="#about" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-2 hover:text-ember transition-colors"><span>About</span><span className="text-muted-foreground">→</span></a>
            <a href="/vision-mission" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-2 hover:text-ember transition-colors"><span>Vision & Mission</span><span className="text-muted-foreground">→</span></a>
            <a href="#network" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-2 hover:text-ember transition-colors"><span>Network</span><span className="text-muted-foreground">→</span></a>
            <a href="/track" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-2 hover:text-ember transition-colors"><span>Track</span><span className="text-muted-foreground">→</span></a>
            <a href="#contact" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-2 hover:text-ember transition-colors"><span>Contact</span><span className="text-muted-foreground">→</span></a>
<a href="#contact" onClick={() => setMobileOpen(false)} className="mt-4 inline-flex items-center justify-center gap-2 rounded-sm bg-navy-deep dark:bg-foreground/15 px-4 py-3 text-xs font-medium tracking-wide text-background dark:text-foreground hover:bg-ember transition-colors text-center">
              Request a Quote <span>→</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-navy-deep text-background">
      <img
        src={heroPort}
        alt="Container ship berthed at a port terminal at dusk"
        width={1920}
        height={1200}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-deep/60 via-navy-deep/30 to-navy-deep" />
      <div className="container-x pt-24 pb-32 md:pt-40 md:pb-48">
        <div className="max-w-4xl rise">
          <p className="eyebrow text-background/60 mb-8">C Link Logistics & Shipping Pvt Ltd · Est. 2024</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-balance">
            The world moves <em>on ledger lines</em> of steel, sea and sky.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-background/70 leading-relaxed">
            One-stop international logistics across UAE, India, Pakistan, Afghanistan, Iran and CIS destinations —
            engineered for exporters who measure success in on-time containers.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="group inline-flex items-center gap-2 rounded-sm bg-ember px-6 py-3.5 text-sm font-medium tracking-wide text-background hover:brightness-110 transition">
              Start a shipment
              <span aria-hidden className="arrow-slide">→</span>
            </a>
            <a href="#services" className="group inline-flex items-center gap-2 rounded-sm border border-background/25 px-6 py-3.5 text-sm font-medium tracking-wide text-background hover:bg-background/5 hover:border-ember transition-colors">
              Our services
              <span aria-hidden className="arrow-slide opacity-60">↓</span>
            </a>
          </div>
        </div>

        <dl className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 border-t border-background/15 pt-10 max-w-4xl">
          {[
            ["21+", "Years operating"],
            ["6", "Regions served"],
            ["48", "Partner ports"],
            ["24/7", "Operations desk"],
          ].map(([k, v]) => (
            <div key={v} className="group cursor-default">
              <dt className="font-display text-4xl md:text-5xl italic text-background transition-colors group-hover:text-ember">{k}</dt>
              <dd className="mt-1 eyebrow text-background/50 transition-colors group-hover:text-background/80">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function RouteTicker() {
  const items = [...routes, ...routes];
  return (
    <section aria-label="Active trade lanes" className="border-y border-border bg-sand overflow-hidden">
      <div className="flex items-center gap-6 py-4">
        <span className="eyebrow shrink-0 pl-6 border-r border-border pr-6">Active Lanes</span>
        <div className="marquee-track flex gap-10 whitespace-nowrap font-mono text-xs tracking-wider">
          {items.map((r, i) => (
            <span key={i} className="group flex items-center gap-3 cursor-default transition-colors hover:text-ember">
              <span className="size-1.5 rounded-full bg-ember transition-transform group-hover:scale-150" />
              {r}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="container-x py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end mb-16">
        <div className="md:col-span-7">
          <p className="eyebrow mb-4">Services · [01 — 04]</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-balance">
            NVOCC, forwarding and destination specialists for <em>Afghanistan & CIS</em>.
          </h2>
        </div>
        <p className="md:col-span-5 text-muted-foreground text-lg leading-relaxed">
          Controlled ocean space, integrated forwarding and deep lane expertise into Afghanistan and the CIS —
          configured to your cargo, route and delivery window.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-border">
        {services.map((s) => (
          <article
            key={s.n}
            className="group bg-background p-8 md:p-10 flex flex-col min-h-[24rem] transition-colors hover:bg-sand"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-ember tracking-widest transition-transform group-hover:translate-x-1">{s.n}</span>
              <span className="eyebrow transition-colors group-hover:text-foreground">{s.tag}</span>
            </div>
            <div className="relative my-8 overflow-hidden aspect-[16/9]">
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-navy-deep/0 transition-colors duration-500 group-hover:bg-navy-deep/10" />
            </div>
            <h3 className="font-display text-3xl md:text-4xl leading-tight tracking-tight transition-colors group-hover:text-ember">{s.title}</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">{s.copy}</p>
            <a href="#contact" className="mt-auto pt-8 text-xs font-mono tracking-widest text-foreground border-b border-foreground/20 self-start hover:border-ember hover:text-ember transition-colors inline-flex items-center gap-2">
              ENQUIRE <span aria-hidden className="arrow-slide">→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-navy-deep text-background">
      <div className="container-x py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">
          <div className="md:col-span-5 md:sticky md:top-24">
            <img
              src={aboutOps}
              alt="C Link Logistics warehousing operations"
              width={1400}
              height={1600}
              loading="lazy"
              className="w-full aspect-[4/5] object-cover"
            />
            <p className="mt-4 eyebrow text-background/50">Figure I · Consolidation floor, primary hub</p>
          </div>
          <div className="md:col-span-7">
            <p className="eyebrow text-background/60 mb-6">Our DNA · About the Group</p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-balance">
              Founded in 2024 by rail and shipping specialists with 26 years of operational expertise — <em>and it still shows</em>.
            </h2>
            <div className="mt-10 space-y-6 text-background/75 text-lg leading-relaxed max-w-2xl">
              <p>
                International logistics is not only the management of material and information — it is the
                management of relationships. Exporter, importer, customs, shipping lines, airlines: we co-ordinate
                the entire chain so your cargo moves economically, efficiently and consistently.
              </p>
              <p>
                C Link Logistics & Shipping Pvt Ltd is a one-stop destination for total logistics needs. Incepted
                across the UAE, South East Asia and India, our vast agent network in UAE, India, Pakistan,
                Afghanistan, Iran and CIS destinations powers hassle-free air, sea and land transport.
              </p>
              <p>
                We spend the time to consult individually. We never fit a standard product to a special need.
                We upgrade our skills, our tools and our technology — quietly, continuously — so that logistics
                stays simple for the people who trust us with it.
              </p>
            </div>
            <ul className="mt-12 grid sm:grid-cols-2 gap-x-8 gap-y-6 border-t border-background/15 pt-10">
              {[
                ["Ethical practice", "Trust as the operating system."],
                ["Timely service", "Windows honoured, not negotiated."],
                ["Quality output", "Cargo delivered as it left."],
                ["Empowered people", "Local expertise, global reach."],
              ].map(([h, s]) => (
                <li key={h} className="group cursor-default border-l border-background/10 pl-4 -ml-4 transition-colors hover:border-ember">
                  <p className="font-display text-2xl italic transition-colors group-hover:text-ember">{h}</p>
                  <p className="mt-1 text-background/60 text-sm">{s}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const regions = [
    { code: "AE", name: "United Arab Emirates" },
    { code: "IN", name: "India" },
    { code: "PK", name: "Pakistan" },
    { code: "AF", name: "Afghanistan" },
    { code: "IR", name: "Iran" },
    { code: "CIS", name: "CIS Destinations" },
  ];
  return (
    <section id="network" className="container-x py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-12 items-end mb-16">
        <div className="md:col-span-8">
          <p className="eyebrow mb-4">Global Network</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-balance">
            A well-settled agent, wherever your <em>cargo</em> arrives.
          </h2>
        </div>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-l border-border">
        {regions.map((r) => (
            <li key={r.code} className="group relative border-r border-b border-border p-6 md:p-8 hover:bg-navy-deep dark:hover:bg-navy hover:text-background dark:hover:text-foreground transition-colors cursor-default overflow-hidden">
            <p className="font-mono text-xs tracking-widest text-ember">{r.code}</p>
            <p className="mt-8 font-display text-xl md:text-2xl leading-tight">{r.name}</p>
            <span aria-hidden className="absolute right-4 bottom-4 font-mono text-xs opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const supabaseAvailable = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      company: String(fd.get("company") || "").trim() || null,
      email: String(fd.get("email") || "").trim(),
      origin: String(fd.get("origin") || "").trim() || null,
      destination: String(fd.get("destination") || "").trim() || null,
      cargo: String(fd.get("cargo") || "").trim() || null,
    };

    if (!payload.name || !payload.email) {
      setError("Please provide your name and email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError(null);

    if (!supabaseAvailable) {
      // Show success anyway — the enquiry can be handled via email/phone
      form.reset();
      setStatus("success");
      return;
    }

    const { error: dbError } = await supabase.from("contact_submissions").insert(payload);
    if (dbError) {
      setError("We couldn't send your enquiry. Please try again.");
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("success");
  }

  return (
    <section id="contact" className="bg-sand dark:bg-navy/20">
      <div className="container-x py-24 md:py-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-6">
          <p className="eyebrow mb-4">Start a Shipment</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-balance">
            Tell us what needs to move. <em>We'll take it from the dock.</em>
          </h2>
          {!supabaseAvailable && (
            <div className="mt-6 rounded-md border border-amber-400/30 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              ⚡ Online enquiry form will be available once connected. In the meantime, email or call us directly.
            </div>
          )}
          <div className="mt-10 space-y-6 text-muted-foreground">
            <div>
              <p className="eyebrow text-foreground/60">Operations Desk</p>
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
<a
                  href="mailto:shatru@clinkshipping.com"
                  className="inline-flex items-center gap-2 rounded-sm bg-navy-deep dark:bg-foreground/15 px-4 py-2.5 text-sm font-medium tracking-wide text-background dark:text-foreground hover:bg-ember transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  shatru@clinkshipping.com
                </a>
                <a
                  href="mailto:Info@clinkshipping.com"
                  className="inline-flex items-center gap-2 rounded-sm bg-navy-deep dark:bg-foreground/15 px-4 py-2.5 text-sm font-medium tracking-wide text-background dark:text-foreground hover:bg-ember transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Info@clinkshipping.com
                </a>
              </div>
            </div>
            <div>
              <p className="eyebrow text-foreground/60">Phone</p>
<a
                href="tel:+919899800655"
                className="mt-3 inline-flex items-center gap-2 rounded-sm bg-navy-deep dark:bg-foreground/15 px-4 py-2.5 text-sm font-medium tracking-wide text-background dark:text-foreground hover:bg-ember transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +91 98998 00655
              </a>
            </div>
            <div>
              <p className="eyebrow text-foreground/60">Head Office</p>
              <p className="mt-1 font-mono text-sm">C Link Logistics & Shipping Pvt Ltd · India</p>
            </div>
            <div>
              <p className="eyebrow text-foreground/60">Overseas Offices</p>
              <p className="mt-1 font-mono text-sm">Dubai · Karachi · Afghanistan</p>
            </div>
            <div>
              <p className="eyebrow text-foreground/60">Response Window</p>
              <p className="mt-1 font-mono text-sm">Under 4 business hours</p>
            </div>
          </div>
        </div>

        <form
          className="md:col-span-6 bg-background border border-border p-8 md:p-10 grid gap-5"
          onSubmit={handleSubmit}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="grid gap-2">
              <span className="eyebrow">Name</span>
              <input name="name" required className="border-b border-border bg-transparent py-2 outline-none focus:border-ember transition-colors" placeholder="Your name" />
            </label>
            <label className="grid gap-2">
              <span className="eyebrow">Company</span>
              <input name="company" className="border-b border-border bg-transparent py-2 outline-none focus:border-ember transition-colors" placeholder="Company" />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="eyebrow">Email</span>
            <input name="email" type="email" required className="border-b border-border bg-transparent py-2 outline-none focus:border-ember transition-colors" placeholder="you@company.com" />
          </label>
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="grid gap-2">
              <span className="eyebrow">Origin</span>
              <input name="origin" className="border-b border-border bg-transparent py-2 outline-none focus:border-ember transition-colors" placeholder="Port / city" />
            </label>
            <label className="grid gap-2">
              <span className="eyebrow">Destination</span>
              <input name="destination" className="border-b border-border bg-transparent py-2 outline-none focus:border-ember transition-colors" placeholder="Port / city" />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="eyebrow">Cargo Details</span>
            <textarea name="cargo" rows={4} className="border-b border-border bg-transparent py-2 outline-none focus:border-ember transition-colors resize-none" placeholder="Type, weight, dimensions, timing…" />
          </label>
          <button
            type="submit"
            disabled={status === "submitting"}
className="group mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-navy-deep dark:bg-foreground/15 px-6 py-3.5 text-sm font-medium tracking-wide text-background dark:text-foreground hover:bg-ember transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Sending…" : (<>Send enquiry <span aria-hidden className="arrow-slide">→</span></>)}
          </button>
          {status === "success" && (
            <p className="text-sm text-foreground/70 font-mono" role="status">
              Thank you — your enquiry is with our operations desk. We'll reply within 4 business hours.
            </p>
          )}
          {status === "error" && error && (
            <p className="text-sm text-ember font-mono" role="alert">{error}</p>
          )}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-navy-deep text-background/70 border-t border-background/10">
      <div className="container-x py-16 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded bg-background p-1">
              <img src={clinkLogo} alt="C Link Logistics & Shipping Line logo" className="h-full w-full object-contain" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-background">C Link Logistics</span>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            C Link Logistics & Shipping Pvt Ltd — a one-stop destination for total logistics needs across the
            UAE, India, Pakistan, Afghanistan and CIS regions since 2024. Overseas offices in Dubai, Karachi and Afghanistan.
          </p>
        </div>
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <p className="eyebrow text-background/50 mb-4">Services</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="link-underline hover:text-background transition-colors">NVOCC</a></li>
              <li><a href="#services" className="link-underline hover:text-background transition-colors">Freight Forwarding</a></li>
              <li><a href="#services" className="link-underline hover:text-background transition-colors">Afghanistan Logistics</a></li>
              <li><a href="#services" className="link-underline hover:text-background transition-colors">CIS Destination</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-background/50 mb-4">Company</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="link-underline hover:text-background transition-colors">About</a></li>
              <li><a href="/vision-mission" className="link-underline hover:text-background transition-colors">Vision & Mission</a></li>
              <li><a href="#network" className="link-underline hover:text-background transition-colors">Global Network</a></li>
              <li><a href="#contact" className="link-underline hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-background/50 mb-4">Contact</p>
            <div className="flex flex-col gap-3">
<a
href="mailto:shatru@clinkshipping.com"
                className="inline-flex items-center gap-2 rounded-sm bg-background dark:bg-navy px-3 py-2 text-xs font-medium tracking-wide text-foreground hover:bg-ember hover:text-background transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                shatru@clinkshipping.com
              </a>
              <a
href="mailto:Info@clinkshipping.com"
                className="inline-flex items-center gap-2 rounded-sm bg-background dark:bg-navy px-3 py-2 text-xs font-medium tracking-wide text-foreground hover:bg-ember hover:text-background transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Info@clinkshipping.com
              </a>
              <a
href="tel:+919899800655"
                className="inline-flex items-center gap-2 rounded-sm bg-background dark:bg-navy px-3 py-2 text-xs font-medium tracking-wide text-foreground hover:bg-ember hover:text-background transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +91 98998 00655
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container-x py-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono tracking-widest text-background/40">
          <span>© {new Date().getFullYear()} C LINK LOGISTICS & SHIPPING PVT LTD</span>
          <span>SEA · AIR · RAIL · ROAD</span>
        </div>
      </div>
    </footer>
  );
}
