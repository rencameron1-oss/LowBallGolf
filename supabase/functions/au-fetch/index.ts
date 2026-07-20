// Supabase Edge Function: au-fetch
//
// Fetches an allowlisted golf-retailer URL from this project's Sydney
// region, giving the caller an Australian egress IP. Some AU stores
// geo-block requests from overseas data centres (GitHub Actions runs in
// the US), so the nightly ingest routes those stores through here.
//
// Invoke with the `x-region: ap-southeast-2` header so it always runs in
// Sydney regardless of where the caller is. A valid project key (apikey +
// Authorization: Bearer) is required, and the target host must be on the
// allowlist below — so this is not an open proxy.
//
// Deploy: Supabase dashboard → Edge Functions → create "au-fetch" → paste
// this file → Deploy. No extra secrets needed.

const ALLOWED = new Set([
  "www.thegolffactory.com.au",
  "thegolffactory.com.au",
  "www.golfbox.com.au",
  "golfbox.com.au",
]);

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Diagnostic: report egress IP + region so we can confirm AU egress.
  if (url.searchParams.get("ip") === "1") {
    let egressIp: string | null = null;
    try {
      egressIp = (await (await fetch("https://api.ipify.org?format=json")).json()).ip ?? null;
    } catch { /* ignore */ }
    return Response.json({ egressIp, region: Deno.env.get("SB_REGION") ?? "unknown" });
  }

  const target = url.searchParams.get("url");
  if (!target) return new Response("missing url", { status: 400 });

  let host: string;
  try {
    host = new URL(target).hostname;
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (!ALLOWED.has(host)) return new Response("host not allowed", { status: 403 });

  const r = await fetch(target, {
    headers: { "User-Agent": BROWSER_UA, Accept: "text/html,application/json,*/*" },
  });
  const body = await r.text();
  return new Response(body, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "text/plain; charset=utf-8" },
  });
});
