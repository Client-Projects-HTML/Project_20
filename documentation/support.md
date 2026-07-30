# Support

## Getting Help
This is a static front-end template with no backend, so most "issues" are one of:

1. **A form doesn't submit anywhere.** This is expected out of the box — forms only
   validate client-side. See `installation-guide.md` → "Wiring Up Forms" to connect
   Formspree or Netlify Forms.
2. **Images look like random stock photos.** Expected — they're placeholders from
   picsum.photos. See `customization-guide.md` → "Content & Images" to swap them.
3. **Dark mode / RTL doesn't look right on a page I added.** Make sure the new page
   includes all four stylesheets in this order: `style.css`, `responsive.css`,
   `dark-mode.css`, `rtl.css`, and copies the header/footer markup exactly from an
   existing page (the toggle buttons rely on the `data-theme-toggle` / `data-rtl-toggle`
   attributes being present).
4. **Broken links after moving pages.** All internal links are relative (`about.html`,
   `../assets/...`) — if you rename `pages/` or move a page to a different folder
   depth, update the `../assets/` prefix in that page's `<head>` and footer `<script>`
   tags accordingly.

## Browser Support
Tested against current Chrome, Firefox, Safari, and Edge. No IE11 support (uses CSS
custom properties, `IntersectionObserver`, and ES6+ syntax in places).

## Reporting a Bug
Since this is a delivered template rather than a hosted product, there's no live
issue tracker bundled — keep a note of:
- Which page and browser
- What you expected vs. what happened
- Whether it reproduces in an incognito/private window (rules out a stale
  `localStorage` value for the dark-mode/RTL preference — clear site data to test)

and pass that along to whoever maintains your copy of this template.
