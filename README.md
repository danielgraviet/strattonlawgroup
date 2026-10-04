# Stratton Law Group

Next.js site for https://www.strattonlawgroup.com, adapted from the Gunter Injury Law codebase.

```bash
npm install
npm run dev
```

## Where things live

- `src/lib/site.ts` — firm name, phone, offices, attorneys, practice areas, nav. Edit here first.
- `src/app/globals.css` — brand tokens (logo gold `#d9a441`, ink `#1f2a33`). Fonts: Roboto Slab + Montserrat.
- `content/pages/*.mdx` — practice-area and contact pages (served at `/<slug>`).
- `content/blog/*.mdx` — blog posts (served at `/<slug>`, listed at `/blog`).
- `public/team`, `public/services`, `public/brand` — images pulled from the current Squarespace site.

## Contact form environment variables

- `RESEND_API_KEY` and `CONTACT_FORM_FROM_EMAIL` (a verified Resend sender) — required for the form to send.
- `CONTACT_FORM_TO_EMAIL` — comma-separated recipients; defaults to info@strattonlawgroup.com.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` — optional; enforced only when set.
