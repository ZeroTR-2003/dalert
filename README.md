# Dalert

Landing page for [dalert.app](https://dalert.app) — proof-of-presence for Namibian security firms.

Static single-page site. No build step, no backend, no database. The "Join the pilot" form
submits directly to [Web3Forms](https://web3forms.com); responses are emailed straight to the
configured inbox.

## Files

- `index.html` — the page. Edit this directly in any text editor, no build step needed.
- `support.js` — small runtime that renders `index.html`'s template (loads React from a CDN,
  do not edit by hand; it's generated tooling output).

## Local preview

Any static file server works, e.g.:

```
npx serve .
```

Then open the printed local URL.

## Deploy

Currently deployed on [Vercel](https://vercel.com) as a static site (no framework, no build
command, output directory `.`), connected to this repository's `main` branch. Pushing to `main`
triggers a production redeploy of [dalert.app](https://dalert.app) automatically.

To deploy elsewhere:

- **Netlify** — publish directory `/`, no build command.
- **GitHub Pages** — Settings → Pages → deploy from branch `main` → `/root`.

## Updating the form

The form posts to Web3Forms using the access key embedded in `index.html`. To change where
submissions are delivered, update the key in the [Web3Forms dashboard](https://web3forms.com)
(no code change needed) or swap the `access_key` hidden field for a new key.

## Domain

`dalert.app` and `www.dalert.app` are configured in Vercel's project settings, with DNS managed
at name.com. Use Vercel's domain inspector as the source of truth for DNS records.
