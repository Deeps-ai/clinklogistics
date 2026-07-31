# TODO: Fix "Page not found" on Netlify

## Root Cause
TanStack Start (SSR framework) is deployed as a static site on Netlify:
- `netlify.toml` publishes `dist` which has no `index.html`
- No deployment preset plugin configured in `vite.config.ts`
- Result: Netlify serves 404 for all routes

## Plan Steps
- [ ] Install `@netlify/vite-plugin-tanstack-start` as dev dependency
- [ ] Update `vite.config.ts` to add `netlify()` plugin
- [ ] Update `netlify.toml` build/publish config for Netlify Functions output
- [ ] Rebuild (`bun run build`) and verify Netlify function + redirects generated
- [ ] Deploy to Netlify

