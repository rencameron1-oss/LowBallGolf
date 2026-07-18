/**
 * Contact form handler.
 *
 * Reads a JSON POST from the contact form, validates it, and forwards it as
 * an email to the address configured in `MAIL_TO`. Uses Resend
 * (https://resend.com) as the email provider — sign up for a free key, add
 * your sending domain, then run `wrangler secret put RESEND_API_KEY`.
 *
 * Why no database here:
 *   The simplest dynamic page possible. No D1, no schema, no migrations —
 *   the message goes straight to your inbox. Once you are comfortable with
 *   this, the natural next step is to also persist messages in D1 so you can
 *   build an admin page that lists them.
 */

export interface Env {
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  MAIL_TO?: string;
}

function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...(init.headers || {}),
    },
  });
}

function badRequest(msg: string) {
  return json({ error: msg }, { status: 400 });
}

function isEmail(s: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
  );
}

interface Submission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

async function sendEmail(env: Env, s: Submission): Promise<void> {
  // The Worker exits cleanly even if email is not configured yet — that way
  // the form still "works" during local development before secrets are set.
  if (!env.RESEND_API_KEY || !env.MAIL_FROM || !env.MAIL_TO) {
    console.warn('contact: email not configured; skipping send');
    return;
  }

  const subjectLine = s.subject
    ? `Website enquiry — ${s.subject}`
    : `Website enquiry from ${s.name}`;

  const html = [
    `<p><strong>New enquiry from your website.</strong></p>`,
    `<p><strong>Name:</strong> ${escapeHtml(s.name)}<br>`,
    `<strong>Email:</strong> <a href="mailto:${escapeHtml(s.email)}">${escapeHtml(s.email)}</a>`,
    s.subject ? `<br><strong>Subject:</strong> ${escapeHtml(s.subject)}` : '',
    `</p><p><strong>Message:</strong></p>`,
    `<p style="white-space:pre-wrap">${escapeHtml(s.message)}</p>`,
    `<p style="color:#888;font-size:12px">Reply directly to this email to respond to ${escapeHtml(s.name)}.</p>`,
  ].join('');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: env.MAIL_TO,
      reply_to: s.email,
      subject: subjectLine,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('resend send failed', res.status, text);
    throw new Error(`resend send failed: ${res.status}`);
  }
}

export async function handleContact(
  request: Request,
  env: Env,
  pathname: string,
  ctx: ExecutionContext
): Promise<Response | null> {
  if (pathname !== '/api/contact' || request.method !== 'POST') return null;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('invalid JSON');

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subject = String(body.subject ?? '').trim();
  const message = String(body.message ?? '').trim();
  // Honeypot field. Bots fill in every input they see; the form keeps this
  // one hidden from humans, so any value at all is treated as spam.
  const honeypot = String(body.website ?? '').trim();

  if (honeypot) return json({ ok: true });
  if (!name) return badRequest('name required');
  if (!email || !isEmail(email)) return badRequest('valid email required');
  if (!message) return badRequest('message required');
  if (name.length > 200 || email.length > 200 || subject.length > 200 || message.length > 5000) {
    return badRequest('field too long');
  }

  ctx.waitUntil(
    sendEmail(env, { name, email, subject, message })
      .catch((err) => console.error('contact send error', err))
  );

  return json({ ok: true });
}
