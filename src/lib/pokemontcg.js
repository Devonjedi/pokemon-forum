const DEV = import.meta.env.DEV
const BASE = DEV ? '/ptcg' : '/.netlify/functions/ptcg'

function buildUrl(endpoint, params = {}) {
  const url = new URL(DEV ? `${BASE}/${endpoint}` : BASE, window.location.origin)
  if (!DEV) url.searchParams.set('endpoint', endpoint)
  for (const [k,v] of Object.entries(params)) if (v!=='' && v!=null) url.searchParams.set(k, String(v))
  return url
}

function headers() {
  // Not required for the function, but harmless
  const h = { Accept: 'application/json' };
  const k = import.meta.env.VITE_POKEMONTCG_API_KEY;
  if (k) h['X-Api-Key'] = k;
  return h;
}

export async function searchCards({
  name = '',
  setName = '',
  rarity = '',
  type = '',
  page = 1,
  pageSize = 24,
}) {
  const parts = [];
  if (name) parts.push(`name:${encodeURIComponent(name)}`);
  if (setName) parts.push(`set.name:"${String(setName).replace(/"/g, '\\"')}"`);
  if (rarity) parts.push(`rarity:"${String(rarity).replace(/"/g, '\\"')}"`);
  if (type) parts.push(`types:${encodeURIComponent(type)}`);

  const params = { page, pageSize };
  if (parts.length) params.q = parts.join(' ');

  const res = await fetch(buildUrl('cards', params), { headers: headers() });
  if (!res.ok) throw new Error('PokémonTCG proxy error');
  return await res.json();
}

export async function listSets() {
  const res = await fetch(
    buildUrl('sets', { orderBy: 'releaseDate', pageSize: 250 }),
    { headers: headers() }
  );
  if (!res.ok) throw new Error('PokémonTCG proxy error');
  return await res.json();
}

export async function getCardById(id) {
  const res = await fetch(buildUrl('cards', { q: `id:${id}` }), { headers: headers() });
  if (!res.ok) throw new Error('PokémonTCG proxy error');
  return await res.json();
}

export function getMarketPrice(card) {
  const prices = card?.tcgplayer?.prices || {};
  for (const v of Object.values(prices)) if (v?.market) return v.market;
  return null;
}
