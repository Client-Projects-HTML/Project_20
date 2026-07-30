# Customization Guide

## 1. Colors
All colors are CSS custom properties defined once, at the top of `assets/css/style.css`:

```css
:root {
  --color-primary: #0F4C81;      /* Primary brand color */
  --color-secondary: #F4A261;    /* Secondary / CTA color */
  --color-accent: #2A9D8F;       /* Reserved for indicators/status only — see note below */
  --color-bg: #F8F9FA;
  --color-dark: #212529;
  --color-white: #FFFFFF;
}
```

Per the design guidelines this template follows, the site uses **two main brand
colors** (Primary + Secondary) for all buttons, links, and section styling. The
third color (`--color-accent`, teal) is intentionally limited to status/indicator-style
UI: form focus rings, the "included" checkmarks on the pricing page, the upload
drag-state, and toast notifications — plus the literal paint-swatch content on the
Color Consultation page, where color chips are the subject matter, not decoration.

To rebrand: change `--color-primary` and `--color-secondary` (and their `-dark`
variants a few lines below) — buttons, nav, hero, and all section accents update
automatically. Dark mode colors live separately in `assets/css/dark-mode.css` and
don't need to match 1:1 with the light palette (dark mode intentionally uses near-black
`#14181B` / `#1E2226` surfaces per the guideline's dark-mode rule).

## 2. Typography
Two font families, loaded from Google Fonts in the `<head>` of every page:
- **Poppins** — headings, buttons, nav (`--font-display`)
- **Montserrat** — body copy (`--font-body`)

To swap fonts, change the Google Fonts `<link>` in `documentation` isn't needed per
page — edit `assets/css/style.css`'s `--font-display` / `--font-body` variables and
update the `<link href="https://fonts.googleapis.com/css2?family=...">` tag that
appears near the top of each page's `<head>`.

## 3. Buttons
Exactly two button classes exist, applied consistently everywhere:
- `.btn.btn-primary` — filled, secondary/orange color. Use once per section for the
  single most important action ("Get Free Quote", "Calculate", "Send Message").
- `.btn.btn-secondary` — outline style. Use for every other action ("Learn More",
  "View All Projects", "Back to Home"). It automatically switches to a white outline
  when placed inside `.hero-content` or `.cta-band` (dark backgrounds) — no extra
  class needed.

## 4. Logo / Brand Mark
The brand mark is a small CSS gradient square (`.brand-chip`) next to the wordmark
"ColorCraft" in the header and footer — no image file to manage. To use a real logo,
replace `<span class="brand-chip"></span>ColorCraft` with an `<img>` tag in the
header/footer of each page (or better, re-run the page assembler — see below).

## 5. Content & Images
- Placeholder photography comes from `picsum.photos` (random stock placeholders).
  Search-and-replace the `https://picsum.photos/seed/...` URLs with real project
  photos, organized under `assets/images/` in the subfolders already provided
  (hero, services, projects, gallery, textures, colors, team, testimonials).
- Copy (headlines, service descriptions, testimonials, blog posts) is realistic
  placeholder text — replace directly in each page's HTML.

## 6. Adding/Removing a Page (advanced)
Every page shares one header and footer, hand-copied into each HTML file rather than
using a templating engine (this is a static template, not a framework app). To add a
page:
1. Duplicate the closest existing page in `pages/`.
2. Update `<title>`, the meta description, and the body content.
3. Add a link to it in the footer's "Quick Links" or "Services" columns if relevant.
4. Add it to `sitemap.xml`.

If you're comfortable with Python, the original build used a small template+assembler
script (head/body/foot concatenation) to keep the header and footer in sync across
all 15 pages — ask your developer for that workflow if you're maintaining many pages
by hand.

## 7. Dark Mode & RTL
- Dark mode: toggled via the moon icon in the header, which sets
  `data-theme="dark"` on `<html>` and persists the choice in `localStorage`.
  All dark-mode overrides live in `assets/css/dark-mode.css`.
- RTL: toggled via the text-direction icon next to it, which sets `dir="rtl"` on
  `<html>`. Overrides live in `assets/css/rtl.css`. Both icon buttons share the
  `.icon-toggle` class so they stay the same size per the design guidelines.
