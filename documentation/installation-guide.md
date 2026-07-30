# Installation Guide

## Requirements
No build tools, frameworks, or server-side code required. This is a static HTML/CSS/JS template.

## Quick Start
1. Unzip the project.
2. Open `index.html` in your browser — it redirects to `pages/index.html`, the home page.
   (Or open `pages/index.html` directly.)
3. That's it. All pages, styles, and scripts load from CDN + the local `assets/` folder.

## Local Development Server (optional, recommended)
Opening files directly (`file://`) works for browsing, but a local server avoids
occasional browser restrictions on `fetch`/relative-path edge cases:

```bash
# Python
cd colorcraft-painting-wall-finishing
python3 -m http.server 8080
# then visit http://localhost:8080/pages/index.html

# Node (if you have it)
npx serve .
```

## Deploying
Upload the whole project folder to any static host (Netlify, Vercel, GitHub Pages,
cPanel, S3 + CloudFront, etc). No environment variables or backend are required for
the front end to render.

- Point your host's "publish directory" at the project root.
- Set the default/entry document to `index.html` (root redirect) or `pages/index.html`
  directly, depending on what your host allows as the site root.
- Update `robots.txt` and `sitemap.xml` with your real production domain before launch
  (they currently use a placeholder `colorcraft-example.com`).

## Wiring Up Forms
The Quote and Contact forms currently validate client-side only and show a success
toast — no data is sent anywhere. To make them functional:
1. Sign up for a form backend such as [Formspree](https://formspree.io) or
   [Netlify Forms](https://www.netlify.com/products/forms/).
2. Add the provider's `action`/`data-netlify` attributes to the `<form>` tags in
   `pages/quote.html` and `pages/contact.html`.
3. Keep the existing `data-validate` / `needs-validation` client-side checks — they
   improve UX and reduce invalid submissions before the request even leaves the browser.

## Wiring Up the Map
`pages/contact.html` embeds a generic Google Maps iframe. Replace the `src` URL with
your business's exact address, or swap in a Google Maps API key–based embed if you
need custom markers/styling.
