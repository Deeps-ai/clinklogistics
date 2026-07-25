import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroPort from "@/assets/hero-port.jpg";
import serviceSea from "@/assets/service-sea.jpg";
import serviceAir from "@/assets/service-air.jpg";
import serviceRail from "@/assets/service-rail.jpg";
import serviceRoad from "@/assets/service-road.jpg";
import aboutOps from "@/assets/about-ops.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "C Link Logistics & Shipping — Global Freight Forwarding" },
      {
        name: "description",
        content:
          "Sea, air, rail and road freight forwarding across UAE, India, Pakistan, Afghanistan, Iran and CIS. C Link Logistics & Shipping Pvt Ltd — one-stop logistics since 2003.",
      },
    ],
  }),
});

const services = [
  { n: "01", title: "Freight Forwarding", tag: "Sea", copy: "FCL & LCL ocean freight to and from every major Indian port, connecting the Middle East, Africa, Europe and the Americas.", img: serviceSea },
  { n: "02", title: "Multimodal Transport", tag: "Combined", copy: "Sea–rail–road corridors engineered as a single moving line, optimised for cost, transit time and cargo integrity.", img: serviceRoad },
  { n: "03", title: "Rail Logistics", tag: "Rail", copy: "Container rail solutions across the Indian subcontinent and onward CIS destinations, led by rail-industry specialists.", img: serviceRail },
  { n: "04", title: "Air Cargo", tag: "Air", copy: "Time-critical air freight for high-value, perishable and project cargo, with worldwide airline partnerships.", img: serviceAir },
  { n: "05", title: "Domestic Logistics", tag: "Road", copy: "Door-to-door road transportation for regular and project cargo of every weight class, backed by tracked fleets.", img: serviceRoad },
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
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="grid size-8 place-items-center bg-navy-deep text-background transition-colors group-hover:bg-ember">
            <span className="font-display text-lg italic leading-none">C</span>
          </span>
          <span className="text-sm font-semibold tracking-tight transition-colors group-hover:text-ember">
            C Link <span className="text-muted-foreground font-normal">Logistics</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#services" className="link-underline hover:text-foreground transition-colors">Services</a>
          <a href="#about" className="link-underline hover:text-foreground transition-colors">About</a>
          <a href="/vision-mission" className="link-underline hover:text-foreground transition-colors">Vision & Mission</a>
          <a href="#network" className="link-underline hover:text-foreground transition-colors">Network</a>
          <a href="#contact" className="link-underline hover:text-foreground transition-colors">Contact</a>
        </nav>

        <a
          href="#contact"
          className="group inline-flex items-center gap-2 rounded-sm bg-navy-deep px-4 py-2 text-xs font-medium tracking-wide text-background hover:bg-ember transition-colors"
        >
          Request a Quote
          <span aria-hidden className="arrow-slide">→</span>
        </a>
      </div>
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
          <p className="eyebrow text-background/60 mb-8">C Link Logistics & Shipping Pvt Ltd · Est. 2003</p>
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
          <p className="eyebrow mb-4">Services · [01 — 05]</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-balance">
            Every modality, coordinated by one <em>desk</em>.
          </h2>
        </div>
        <p className="md:col-span-5 text-muted-foreground text-lg leading-relaxed">
          Sea, air, rail and road as instruments of a single supply chain — configured to your cargo, your route
          and your delivery window.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {services.map((s, i) => (
          <article
            key={s.n}
            className={`group bg-background p-8 md:p-10 flex flex-col min-h-[26rem] transition-colors hover:bg-sand ${i === 0 ? "lg:col-span-2 lg:row-span-2 lg:min-h-[54rem]" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-ember tracking-widest transition-transform group-hover:translate-x-1">{s.n}</span>
              <span className="eyebrow transition-colors group-hover:text-foreground">{s.tag}</span>
            </div>
            <div className={`relative my-8 overflow-hidden ${i === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
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
              Founded in 2003 by rail and shipping specialists — <em>and it still shows</em>.
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
          <li key={r.code} className="group relative border-r border-b border-border p-6 md:p-8 hover:bg-navy-deep hover:text-background transition-colors cursor-default overflow-hidden">
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
    <section id="contact" className="bg-sand">
      <div className="container-x py-24 md:py-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-6">
          <p className="eyebrow mb-4">Start a Shipment</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-balance">
            Tell us what needs to move. <em>We'll take it from the dock.</em>
          </h2>
          <div className="mt-10 space-y-6 text-muted-foreground">
            <div>
              <p className="eyebrow text-foreground/60">Operations Desk</p>
              <p className="mt-1 font-mono text-sm">ops@clinkshipping.com</p>
            </div>
            <div>
              <p className="eyebrow text-foreground/60">Head Office</p>
              <p className="mt-1 font-mono text-sm">C Link Logistics & Shipping Pvt Ltd · India</p>
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
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-navy-deep px-6 py-3.5 text-sm font-medium tracking-wide text-background hover:bg-ember transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Sending…" : (<>Send enquiry <span aria-hidden>→</span></>)}
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
            <span className="grid size-8 place-items-center bg-background text-navy-deep">
              <span className="font-display text-lg italic leading-none">C</span>
            </span>
            <span className="text-sm font-semibold tracking-tight text-background">C Link Logistics</span>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            C Link Logistics & Shipping Pvt Ltd — a one-stop destination for total logistics needs across the
            UAE, India, and CIS regions since 2003.
          </p>
        </div>
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <p className="eyebrow text-background/50 mb-4">Services</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="link-underline hover:text-background transition-colors">Freight Forwarding</a></li>
              <li><a href="#services" className="link-underline hover:text-background transition-colors">Multimodal Transport</a></li>
              <li><a href="#services" className="link-underline hover:text-background transition-colors">Rail Logistics</a></li>
              <li><a href="#services" className="link-underline hover:text-background transition-colors">Air Cargo</a></li>
              <li><a href="#services" className="link-underline hover:text-background transition-colors">Domestic Logistics</a></li>
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
            <ul className="space-y-2 text-sm font-mono">
              <li><a href="mailto:ops@clinkshipping.com" className="link-underline hover:text-background transition-colors">ops@clinkshipping.com</a></li>
              <li><a href="#contact" className="link-underline hover:text-background transition-colors">+91 · 24/7 desk</a></li>
            </ul>
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
