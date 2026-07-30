# Page Structure

ColorCraft is a **Service-Based Template** (consulting/agency/services category per
the HTML Template Development Guide) — no admin/user dashboard, no login/signup flow.
Mandatory menu structure per that guide (Home | Services | About | Contact) is present
in the header, extended with Projects / Gallery / Pricing since this business shows a
visual portfolio and fixed-rate packages.

| Page | File | Purpose |
|---|---|---|
| Home | `pages/index.html` | Hero, service summary, why-choose-us, process, featured projects, testimonials, stats, quote CTA |
| About | `pages/about.html` | Company story, mission/vision, team, timeline, achievements |
| Services | `pages/services.html` | All 8 services as cards with starting price |
| Service Details | `pages/service-details.html` | Deep dive on one service (Interior Painting) — scope, materials, timeline, FAQ, related services |
| Projects | `pages/projects.html` | Portfolio filterable by category (interior/exterior/commercial/residential/waterproofing) |
| Gallery | `pages/gallery.html` | Photo grid filterable by room type, with lightbox |
| Pricing | `pages/pricing.html` | 3-tier package pricing (Basic / Standard / Premium) |
| Testimonials | `pages/testimonials.html` | Full client review grid |
| Color Consultation | `pages/color-consultation.html` | Trend colors, combinations, room inspiration, paint cost calculator |
| Quote | `pages/quote.html` | Lead-gen form with image upload for project photos |
| Blog | `pages/blog.html` | Article previews (tips, guides) |
| Contact | `pages/contact.html` | Contact form, office info, embedded map |
| FAQ | `pages/faq.html` | Accordion of common questions |
| Coming Soon | `pages/coming-soon.html` | Pre-launch placeholder with countdown + email capture |
| 404 | `pages/404.html` | Custom error page with navigation back to safety |

## Shared Elements (every page)
- **Header**: logo, primary nav, dark-mode toggle, RTL toggle, one Primary CTA
  ("Get Free Quote"), mobile hamburger menu.
- **Footer**: brand blurb + social links, Quick Links, Services, newsletter signup,
  copyright line.
- **Back-to-top button**, **toast notification** (for form success messages).

## Why No Dashboard / Auth Pages
Per the HTML Template Development Guide, a dashboard is only required for templates
with user accounts, transactions, content management, or bookings requiring login
(e-commerce, SaaS, LMS, directories). ColorCraft is a lead-generation marketing site —
visitors request quotes via a form, they don't log in — so no dashboard, login, or
sign-up pages are included, matching the "Service-Based Template" spec.
