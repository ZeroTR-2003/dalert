# Dalert

Minimal landing page for `dalert.app`, with a Vercel serverless waitlist endpoint backed by Postgres.

## Local Setup

```bash
npm install
npm run dev
```

The visual landing page runs at `http://127.0.0.1:5173` or the port Vite prints. The waitlist API is meant for Vercel, so local Vite preview will show a calm backend-not-available message until the project is deployed or run through Vercel tooling with `DATABASE_URL`.

## Database

Use Neon Postgres or Vercel Postgres. The app expects:

```txt
DATABASE_URL
IP_HASH_SALT
```

`/api/waitlist` creates the `waitlist_signups` table automatically on the first successful signup.

To see signups in the database:

```sql
select email, source, created_at
from waitlist_signups
order by created_at desc;
```

Security included:

- Database credentials stay server-side in Vercel environment variables.
- Email is validated and normalized.
- Duplicate emails are ignored safely with a unique constraint.
- Inserts use parameterized SQL.
- A hidden honeypot field catches simple bots.
- IP addresses are hashed before storage.
- Basic per-IP rate limiting is applied.
- Security headers are configured in `vercel.json`.

## GitHub

From `C:\Users\THURSTON S\Documents\saas\dalert`:

```bash
git init
git add .
git commit -m "Build Dalert landing page with waitlist"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dalert.git
git push -u origin main
```

Create the empty GitHub repo first, then replace `YOUR_USERNAME`.

## Vercel

1. Import the GitHub repo into Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add environment variables:
   - `DATABASE_URL`
   - `IP_HASH_SALT`
6. Deploy.

## Domain

Add both domains in Vercel project settings:

```txt
dalert.app
www.dalert.app
```

Then configure DNS at name.com using the exact values Vercel shows. Vercel’s general-purpose values are commonly:

```txt
A      @      76.76.21.21
CNAME  www    cname.vercel-dns.com
```

Use Vercel’s domain inspector as the source of truth if it gives project-specific records. Vercel will provision HTTPS after DNS verifies.

## References

- Vercel custom domains: https://vercel.com/docs/domains/set-up-custom-domain
- Vercel Functions API: https://vercel.com/docs/functions/functions-api-reference?framework=other
- Neon + Vercel: https://neon.com/docs/guides/vercel/
