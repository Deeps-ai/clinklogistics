# C Link Logistics & Shipping

**Global Freight Forwarding** — NVOCC, forwarding and destination specialists for Afghanistan and CIS.

Live site: https://clinkshipping.com

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Metaframework**: TanStack Start (SSR)
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build**: Vite v8
- **Package Manager**: Bun

## Features

- Multi-page logistics company website (Home, Tracking, Vision & Mission)
- Real-time shipment tracking with milestone timeline and visual progress stepper
- Email tracking links with auto-load via `?trace=` query parameter
- Contact/enquiry form with Supabase persistence
- Copy-to-clipboard shareable tracking links
- Day/night theme toggle with localStorage persistence
- Full responsive design (mobile hamburger menu on all pages)
- Admin dashboard for managing shipments, tracking events, and contact submissions
- Rate-limited API endpoints
- JSON export for shipment data

## Development

```sh
bun install
bun run dev
```

## Build

```sh
bun run build
```

## Environment Variables

Create a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## License

© C Link Logistics & Shipping Pvt Ltd

