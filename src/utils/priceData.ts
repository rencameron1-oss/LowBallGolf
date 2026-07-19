// Build-time price data for club pages. Fetches the catalogue, current
// offers, and full price history from Supabase, then shapes it into one
// object per club including a forward-filled daily price series (history
// rows are only written on change, so flat periods are implied).

export interface StoreOffer {
  name: string;
  url: string;
  price: number;
  rrp: number | null;
  inStock: boolean;
}

export interface DayPoint {
  date: string; // YYYY-MM-DD (UTC day)
  best: number | null;
  perStore: Record<string, number | null>;
}

export interface ClubData {
  slug: string;
  title: string;
  brand: string;
  model: string;
  category: string; // 'driver' | 'putter' | 'wedge' | ...
  image: string | null;
  isLadies: boolean;
  hands: ('right' | 'left')[]; // detected from listing titles; right assumed when unstated
  offers: StoreOffer[]; // cheapest first
  minEver: number;
  maxEver: number;
  trackedSince: string; // YYYY-MM-DD
  days: DayPoint[];
  storeNames: string[]; // stores appearing in the series
}

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY;

const dayOf = (iso: string) => iso.slice(0, 10);

async function get(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

let cache: ClubData[] | null = null;

export async function fetchClubs(): Promise<ClubData[]> {
  if (cache) return cache;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return (cache = []);

  try {
    const [products, listings, history] = await Promise.all([
      get('products?select=id,brand,model,slug,category,is_ladies'),
      get(
        'listings?select=id,product_id,url,image_url,in_stock,title,retailers(name),prices(price,rrp)' +
          '&active=is.true&match_status=in.(auto,confirmed)&product_id=not.is.null'
      ),
      get('price_history?select=listing_id,price,changed_at&order=changed_at.asc&limit=100000'),
    ]);

    const historyByListing = new Map<number, { day: string; price: number }[]>();
    for (const h of history) {
      let rows = historyByListing.get(h.listing_id);
      if (!rows) historyByListing.set(h.listing_id, (rows = []));
      rows.push({ day: dayOf(h.changed_at), price: Number(h.price) });
    }

    const listingsByProduct = new Map<number, typeof listings>();
    for (const l of listings) {
      let rows = listingsByProduct.get(l.product_id);
      if (!rows) listingsByProduct.set(l.product_id, (rows = []));
      rows.push(l);
    }

    const today = dayOf(new Date().toISOString());
    const clubs: ClubData[] = [];

    for (const p of products) {
      const pls = listingsByProduct.get(p.id) ?? [];
      if (!pls.length) continue;

      // Current offers: cheapest listing per store, in-stock offers with
      // a price only.
      const offerByStore = new Map<string, StoreOffer>();
      for (const l of pls) {
        if (!l.prices) continue;
        const name = l.retailers.name;
        const offer: StoreOffer = {
          name,
          url: l.url,
          price: Number(l.prices.price),
          rrp: l.prices.rrp != null ? Number(l.prices.rrp) : null,
          inStock: l.in_stock !== false,
        };
        const cur = offerByStore.get(name);
        if (!cur || offer.price < cur.price) offerByStore.set(name, offer);
      }
      const offers = [...offerByStore.values()].sort((a, b) => a.price - b.price);
      if (!offers.length) continue;

      // Daily series: forward-fill each listing's history, then take the
      // per-store minimum and overall best for each tracked day.
      const listingHist = pls
        .map((l) => ({
          store: l.retailers.name,
          rows: historyByListing.get(l.id) ?? [],
        }))
        .filter((x) => x.rows.length);

      const firstDay = listingHist.length
        ? listingHist.map((x) => x.rows[0].day).sort()[0]
        : today;

      const days: DayPoint[] = [];
      const storeSet = new Set<string>();
      const cursor = new Date(`${firstDay}T00:00:00Z`);
      const end = new Date(`${today}T00:00:00Z`);
      let minEver = Infinity;
      let maxEver = -Infinity;
      while (cursor <= end) {
        const day = dayOf(cursor.toISOString());
        const perStore: Record<string, number | null> = {};
        for (const lh of listingHist) {
          let price: number | null = null;
          for (const row of lh.rows) {
            if (row.day <= day) price = row.price;
            else break;
          }
          if (price == null) continue;
          storeSet.add(lh.store);
          if (perStore[lh.store] == null || price < perStore[lh.store]!) {
            perStore[lh.store] = price;
          }
        }
        const vals = Object.values(perStore).filter((v): v is number => v != null);
        const best = vals.length ? Math.min(...vals) : null;
        if (best != null) {
          minEver = Math.min(minEver, best);
          maxEver = Math.max(maxEver, ...vals);
        }
        days.push({ date: day, best, perStore });
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      }

      if (!Number.isFinite(minEver)) {
        minEver = offers[0].price;
        maxEver = offers[offers.length - 1].price;
      }

      // Handedness from listing titles; drivers default to right-handed
      // when no title says otherwise.
      const hands = new Set<'right' | 'left'>();
      for (const l of pls) {
        const t = String(l.title || '');
        if (/\b(left[- ]?hand(ed)?|lh)\b/i.test(t)) hands.add('left');
        if (/\b(right[- ]?hand(ed)?|rh)\b/i.test(t)) hands.add('right');
      }
      if (hands.size === 0) hands.add('right');

      const suffix =
        { driver: 'DRIVER', putter: 'PUTTER', wedge: 'WEDGE', iron_set: 'IRONS' }[
          p.category as string
        ] ?? '';
      clubs.push({
        slug: p.slug,
        title: `${p.brand} ${p.model} ${suffix}`.trim().toUpperCase(),
        brand: p.brand,
        model: p.model,
        category: p.category,
        image: pls.find((l) => l.image_url)?.image_url ?? null,
        isLadies: p.is_ladies === true,
        hands: [...hands],
        offers,
        minEver,
        maxEver,
        trackedSince: firstDay,
        days,
        storeNames: [...storeSet],
      });
    }

    return (cache = clubs);
  } catch {
    return (cache = []);
  }
}

export const dollars = (n: number) =>
  '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const auDate = (isoDay: string) =>
  new Date(`${isoDay}T00:00:00Z`).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
