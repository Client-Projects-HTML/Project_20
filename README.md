# ColorCraft – Painting & Wall Finishing Services

A 15-page **Service-Based Template** built to match the HTML Template Development
Guide and the Website Design & Development Guidelines (branding, header/nav, buttons,
layout, dark/light mode, RTL, accessibility, SEO).

## Open It
Open `index.html` at the project root — it redirects to `pages/index.html`, the home
page. Or open `pages/index.html` directly. No build step required. See
`documentation/installation-guide.md` for local-server and deployment notes.

## Project Structure
```
colorcraft-painting-wall-finishing/
├── index.html              Root redirect → pages/index.html
├── robots.txt
├── sitemap.xml
├── pages/
│   ├── index.html  about.html  services.html  service-details.html
│   ├── projects.html  gallery.html  pricing.html  testimonials.html
│   ├── color-consultation.html  quote.html  blog.html  contact.html
│   └── faq.html  coming-soon.html  404.html
├── assets/
│   ├── css/
│   │   ├── style.css        Design tokens, layout, components
│   │   ├── responsive.css   Breakpoints (mobile-first)
│   │   ├── dark-mode.css    [data-theme="dark"] overrides
│   │   └── rtl.css          [dir="rtl"] overrides
│   ├── js/
│   │   ├── main.js          Nav, dark mode, RTL, scroll reveal, counters, accordion, testimonial slider
│   │   ├── quote.js         Form validation, image upload preview, paint cost calculator
│   │   └── gallery.js       Filter tabs, lightbox, before/after drag-compare
│   ├── images/               (organized by section — see customization-guide.md)
│   ├── icons/
│   └── fonts/
├── documentation/
│   ├── installation-guide.md
│   ├── customization-guide.md
│   ├── page-structure.md
│   ├── credits.md
│   ├── changelog.md
│   └── support.md
└── README.md
```

## Template Category (per HTML Template Development Guide)
**Service-Based Template** — no admin/user dashboard, no login/signup. Mandatory menu
`Home | Services | About | Contact` is present, extended with Projects / Gallery /
Pricing for this visual, package-priced business.

## Branding (per Website Design & Development Guidelines)
- **Two main brand colors**: Primary `#0F4C81` (deep blue) and Secondary `#F4A261`
  (warm orange) — used for all buttons, nav, and section styling.
- A third color, teal `#2A9D8F`, is reserved for indicator/status UI only (form focus
  states, pricing checkmarks, upload drag-state, toast borders) and the literal paint
  swatches shown as content on the Color Consultation page — not used decoratively
  elsewhere.
- **Exactly two button styles**: `.btn-primary` (filled) and `.btn-secondary`
  (outline, auto-adapts to white on dark hero/CTA backgrounds).
- **One primary CTA in the header** ("Get Free Quote") — within the guideline's max
  of two.
- Dark-mode toggle and RTL toggle sit side by side in the header, same size
  (`.icon-toggle`), same behavior pattern.
- Light mode uses white/light backgrounds; dark mode uses near-black surfaces.

## Accessibility & SEO
- Skip-to-content link, semantic HTML5, per-page unique title/meta description,
  Open Graph tags, JSON-LD business schema on the home page.
- `robots.txt` + `sitemap.xml` included (update the placeholder domain before launch).
- 44px minimum touch targets, keyboard-navigable accordion/menu/lightbox.

## Features
- Dark/light mode (persists via `localStorage`, respects OS preference on first visit)
- RTL layout toggle
- Mobile-first responsive layout with hamburger nav
- Quote/contact form validation with inline error states
- Drag-and-drop image upload with thumbnail preview (quote form)
- Paint cost calculator (Color Consultation page)
- Gallery filter + keyboard-accessible lightbox
- Before/after drag-compare slider (Projects & Home)
- FAQ accordion, testimonial slider, animated stat counters, scroll-reveal animations

