# Changelog

## v1.1.0 — Guideline Compliance Update
- Restructured project: all pages moved into `pages/`, matching the standard template
  file structure (`assets/`, `pages/`, `documentation/`, `README.md`).
- Added `robots.txt` and `sitemap.xml` for SEO readiness.
- Added a root `index.html` that redirects to `pages/index.html` for convenient
  direct-open browsing.
- Added an RTL toggle button in the header (same size/style as the dark-mode toggle,
  per the design guidelines) — RTL logic already existed in `main.js` but wasn't
  exposed in the UI until this release.
- Consolidated all buttons to exactly two styles — Primary (filled) and Secondary
  (outline) — replacing the previous `.btn-dark` / `.btn-outline` mix.
- Reduced decorative use of the third brand color (teal/accent) so it's reserved for
  indicator/status UI (form focus states, "included" checkmarks, upload drag-state,
  toast borders) rather than general section styling, per the two-main-color
  branding rule.
- Added a skip-to-content link for keyboard accessibility.
- Added full documentation set (installation, customization, page structure, credits,
  changelog, support).

## v1.0.0 — Initial Release
- 15-page Service-Based Template: Home, About, Services, Service Details, Projects,
  Gallery, Pricing, Testimonials, Color Consultation, Quote, Blog, Contact, FAQ,
  Coming Soon, 404.
- Dark/light mode with system-preference detection and persistence.
- Mobile-first responsive layout, hamburger nav, 44px minimum touch targets.
- Quote/Contact form validation, drag-and-drop image upload with preview.
- Gallery filter + lightbox, before/after drag-compare slider, paint cost calculator,
  FAQ accordion, testimonial slider, animated stat counters, scroll-reveal animations.
