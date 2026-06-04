import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitWindowMs = 60_000;
const maxRequestsPerWindow = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function getIp(request: Request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT ?? 'dalert-waitlist';

  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

function isAllowedOrigin(origin: string | null) {
  if (!origin) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);

    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === 'dalert.app' ||
      hostname === 'www.dalert.app' ||
      hostname.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);

  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + rateLimitWindowMs });
    return true;
  }

  if (current.count >= maxRequestsPerWindow) {
    return false;
  }

  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get('origin'))) {
    return json({ error: 'Request blocked.' }, 403);
  }

  if (!process.env.DATABASE_URL) {
    return json({ error: 'Waitlist is not configured yet.' }, 503);
  }

  const ip = getIp(request);

  if (!checkRateLimit(ip)) {
    return json({ error: 'Please try again in a minute.' }, 429);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const data = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const email = String(data.email ?? '')
    .trim()
    .toLowerCase();
  const website = String(data.website ?? '').trim();

  if (website) {
    return json({ ok: true, message: "You're on the list." });
  }

  if (!email || email.length > 254 || !emailPattern.test(email)) {
    return json({ error: 'Enter a valid email address.' }, 400);
  }

  const sql = neon(process.env.DATABASE_URL);
  const userAgent = request.headers.get('user-agent')?.slice(0, 500) ?? '';
  const ipHash = hashIp(ip);

  await sql`
    create table if not exists waitlist_signups (
      id bigserial primary key,
      email text not null unique,
      source text not null default 'landing',
      ip_hash text,
      user_agent text,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    insert into waitlist_signups (email, source, ip_hash, user_agent)
    values (${email}, 'landing', ${ipHash}, ${userAgent})
    on conflict (email) do nothing
  `;

  return json({ ok: true, message: "You're on the list." });
}
