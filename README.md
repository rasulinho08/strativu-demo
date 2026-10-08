# Strativu — website

Marketing site for Strativu, a software company in Baku. First product: Strativu GRC 360 (in development).
Built with React 18, Vite, Tailwind v4, motion, react-router.

## Run

```
npm i
npm run dev        # http://localhost:5173
npm run build      # type check + production build in dist/
npm run typecheck  # tsc --noEmit
```

## Where to change things (no code needed)

| What | File |
| --- | --- |
| Logo, status line, company details, social links (null = hidden), Formspree ID | `src/app/data/site.ts` |
| Logo files | `public/brand/logo-full.png` (light), `public/brand/logo-mark.png` (dark: mark + CSS wordmark). Optional `logo.darkSrc` in `site.ts` |
| Social preview image | `public/og.png` (1200×630) |
| Products (Platform list, home "Our work") — add a new product here | `src/app/data/products.ts` |
| GRC 360 modules, figures, status | `src/app/data/grc360.ts` |
| GRC 360 screenshots and logo (gallery on /platform/grc, home "Our work") | `public/projects/grc360/` + list in `src/app/data/grc360.ts` |
| Framework coverage və statuslar | `src/app/data/coverage.ts` |
| Changelog girişləri | `src/app/data/changelog.ts` |
| Rəng / şrift / radius tokenləri | `src/styles/theme.css`, `src/styles/fonts.css` |
| 3D loqonun hərəkəti (açılış, scroll xoreoqrafiyası, şəffaflıq, formalarda solma), işıq, material | `src/app/components/site/LogoScene.tsx` → `CHOREO`, `OP_SCREENS`, `INTRO_SCREENS`, `HIDE_RAMP`, `STUDIO` |

## Routes

`/` · `/platform` · `/platform/grc` · `/platform/architecture` · `/coverage` · `/coverage/:slug` ·
`/company/about` · `/company/contact` · `/trust` · `/changelog` · `/early-access` · `/legal/privacy|terms|dpa` ·
anything else → 404 page

Per-route `<title>` / description / Open Graph tags are set with `usePageMeta()` in `src/app/components/site/Seo.tsx`.
`public/sitemap.xml` lists every route; regenerate it when frameworks are added.

## Deploy (Vercel)

`vercel.json`:
- rewrites every path to `index.html`, so deep links such as `/coverage/iso-27001` work on refresh;
- 308 redirects for old paths (`/pricing` → `/early-access`, `/about`, `/contact`, `/company`, `/work`);
- security headers on every response (nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, COOP)
  and long-lived caching for hashed `/assets/*` (1 week for `/models`, `/projects`, `/brand`, `/og.png`).
  A Content-Security-Policy is not set yet.

`public/.well-known/security.txt` (RFC 9116) must be renewed before its `Expires` date.
Keep `package-lock.json` generated on Linux or macOS (`npm install`), or Vercel's Linux build cannot find
the native rollup/esbuild binaries.

## Instagram (About page → "Behind the scenes")

The About page shows the latest 6 posts from @strativu. They are fetched by the Vercel function `api/instagram.ts`
(cached for 1 hour); the access token stays on the server. Without a valid token the section is simply hidden.

One-time setup:
1. Instagram app → Settings → *Account type and tools* → switch @strativu to a **Professional** (Business or Creator) account.
2. developers.facebook.com → *My Apps* → *Create app* (type Business) → add the **Instagram** product →
   *API setup with Instagram login* → add the @strativu account → **Generate token** (long-lived, valid 60 days).
3. Vercel → project → *Settings* → *Environment Variables* → `INSTAGRAM_TOKEN` = the token (Production) → *Redeploy*.

Every ~50 days, renew the token by opening this URL in a browser (replace TOKEN):
`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=TOKEN`
If the response contains a different `access_token`, paste it into `INSTAGRAM_TOKEN` and redeploy.
If the token expires, the section disappears until it is renewed; nothing else breaks.
