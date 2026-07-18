// Minimal Cloudflare Workers runtime types we depend on.
// Avoids pulling in @cloudflare/workers-types which conflicts with Astro's DOM lib.

declare interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

declare interface Fetcher {
  fetch(request: Request): Promise<Response>;
  fetch(input: string | URL, init?: RequestInit): Promise<Response>;
}
