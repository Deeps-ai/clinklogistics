import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/vision-mission")({
  component: VisionMission,
  head: () => ({
    meta: [
      { title: "Vision & Mission — C Link Logistics & Shipping" },
      {
        name: "description",
        content:
          "The vision and mission behind C Link Logistics & Shipping Pvt Ltd — building trusted, technology-led logistics across UAE, India and CIS destinations.",
      },
      { property: "og:title", content: "Vision & Mission — C Link Logistics & Shipping" },
      {
        property: "og:description",
        content:
          "Our guiding principles: trusted service, seamless multimodal freight and consistent international trade growth.",
      },
    ],
  }),
});

const pillars = [
  {
    n: "01",
    title: "Trust as infrastructure",
    copy: "Ethical practice, transparent pricing and honoured windows — the operating system every shipment runs on.",
  },
  {
    n: "02",
    title: "One coordinated desk",
    copy: "Sea, air, rail and road treated as instruments of a single supply chain, not as isolated silos.",
  },
  {
    n: "03",
    title: "Locally settled, globally aware",
    copy: "A well-settled agent network across UAE, India, Pakistan, Afghanistan, Iran and CIS — presence, not just partnership.",
  },
  {
    n: "04",
    title: "Quiet technology",
    copy: "We upgrade our tools continuously so that logistics stays simple for the people who trust us with it.",
  },
];

function VisionMission() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <section className="bg-navy-deep text-background">
        <div className="container-x pt-24 pb-24 md:pt-32 md:pb-32">
          <p className="eyebrow text-background/60 mb-8">Vision & Mission</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-balance max-w-5xl">
            To move the world's cargo with the <em>calm precision</em> of a trusted hand.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-background/70 leading-relaxed">
            International logistics is the management of relationships as much as material. Our vision and
            mission are the compass points that keep those relationships honest, and the containers moving.
          </p>
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="eyebrow mb-4">Our Vision</p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.02] tracking-tight text-balance">
              To be the most trusted logistics partner between the Middle East, the subcontinent and the CIS.
            </h2>
          </div>
          <div className="md:col-span-7 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              We envision C Link Logistics & Shipping Pvt Ltd as a benchmark for integrity, technology and
              consistency in international freight. A company clients return to not because they have to,
              but because they cannot find our equal on the trade lanes we serve.
            </p>
            <p>
              We measure the vision in on-time containers, in repeat exporters, in relationships that outlast
              contracts, and in the quiet confidence of a shipper who no longer worries about their cargo.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-sand border-y border-border">
        <div className="container-x py-24 md:py-32 grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="eyebrow mb-4">Our Mission</p>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.02] tracking-tight text-balance">
              To help organisations grow their international trade — economically, efficiently, consistently.
            </h2>
          </div>
          <div className="md:col-span-7 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              We coordinate the entire chain — exporter, importer, customs, shipping lines and airlines —
              so cargo moves as one continuous line rather than a sequence of hand-offs. We consult individually,
              never fitting a standard product to a special need.
            </p>
            <p>
              Our mission is executed daily by professionals with decades of experience in rail, shipping and
              multimodal freight, supported by a global agent network and technology that keeps the operation
              transparent from booking to delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <div className="mb-16">
          <p className="eyebrow mb-4">Guiding Principles</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.02] tracking-tight max-w-3xl text-balance">
            Four commitments we hold against every shipment we accept.
          </h2>
        </div>
        <ul className="grid md:grid-cols-2 border-t border-l border-border">
          {pillars.map((p) => (
            <li key={p.n} className="group border-r border-b border-border p-8 md:p-10 hover:bg-navy-deep hover:text-background transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-ember tracking-widest">{p.n}</span>
                <span className="eyebrow group-hover:text-background/50">Principle</span>
              </div>
              <h3 className="mt-12 font-display text-3xl md:text-4xl leading-tight tracking-tight">{p.title}</h3>
              <p className="mt-4 text-muted-foreground group-hover:text-background/70 leading-relaxed max-w-lg">
                {p.copy}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-navy-deep text-background">
        <div className="container-x py-20 md:py-28 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <h2 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-2xl text-balance">
            Ready to move a shipment along a lane we already know?
          </h2>
          <Link
            to="/"
            hash="contact"
            className="inline-flex items-center gap-2 rounded-sm bg-ember px-6 py-3.5 text-sm font-medium tracking-wide text-background hover:brightness-110 transition"
          >
            Start a shipment <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center bg-navy-deep text-background">
            <span className="font-display text-lg italic leading-none">C</span>
          </span>
          <span className="text-sm font-semibold tracking-tight">
            C Link <span className="text-muted-foreground font-normal">Logistics</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" hash="services" className="hover:text-foreground transition-colors">Services</Link>
          <Link to="/vision-mission" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Vision & Mission</Link>
          <Link to="/" hash="about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/" hash="contact" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>
        <Link
          to="/"
          hash="contact"
          className="inline-flex items-center gap-2 rounded-sm bg-navy-deep px-4 py-2 text-xs font-medium tracking-wide text-background hover:bg-ember transition-colors"
        >
          Request a Quote <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
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
            <p className="eyebrow text-background/50 mb-4">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/vision-mission" className="hover:text-background transition-colors">Vision & Mission</Link></li>
              <li><Link to="/" hash="about" className="hover:text-background transition-colors">About</Link></li>
              <li><Link to="/" hash="network" className="hover:text-background transition-colors">Global Network</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-background/50 mb-4">Contact</p>
            <ul className="space-y-2 text-sm font-mono">
              <li>ops@clinkshipping.com</li>
              <li>+91 · 24/7 desk</li>
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
