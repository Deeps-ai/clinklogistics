# TODO: Fix "Page not found" on Netlify

## Root Cause
TanStack Start (SSR framework) is deployed as a static site on Netlify:
- `netlify.toml` published `dist` which has no `index.html` at root
- No deployment preset plugin configured in `vite.config.ts`
- Result: Netlify serves 404 for all routes

## Plan Steps
- [x] Install `@netlify/vite-plugin-tanstack-start` as dev dependency (v1.3.17)
- [x] Update `vite.config.ts` to add `netlify()` plugin
- [x] Update `netlify.toml`:
  - `command = "npm run build"`
  - `publish = "dist/client"` (static assets location)
- [x] Rebuild (`npm run build`) and verify:
  - Netlify Function generated at `.netlify/v1/functions/server.mjs` (path: `/*`, preferStatic: true)
  - SSR server bundle at `dist/server/server.js`
  - Static assets at `dist/client/`
- [ ] Deploy to Netlify (push to repo → Netlify auto-builds, or use `netlify deploy`)

## Notes
- The `@netlify/vite-plugin-tanstack-start` plugin auto-generates the SSR handler
  at `.netlify/v1/functions/server.mjs` with `path: "/*"` which catches all routes.
- `preferStatic: true` lets Netlify serve static assets (in `dist/client/`) directly
  and falls back to the SSR function for dynamic routes.
- `bun` was not installed on this machine, so `npm run build` is used in `netlify.toml`.

