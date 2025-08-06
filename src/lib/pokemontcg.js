const API = '/.netlify/functions/ptcg'; // proxy through Netlify function
function headers() {
  const h = { Accept: "application/json" };
  const k = import.meta.env.VITE_POKEMONTCG_API_KEY;
  if (k) h["X-Api-Key"] = k;
  return h;
}
export async function searchCards({
  name = "",
  setName = "",
  rarity = "",
  type = "",
  page = 1,
  pageSize = 24,
}) {
  const parts = [];
  if (name) parts.push(`name:${encodeURIComponent(name)}`);
  if (setName) parts.push(`set.name:"${String(setName).replace(/"/g, '\\"')}"`);
  if (rarity) parts.push(`rarity:"${String(rarity).replace(/"/g, '\\"')}"`);
  if (type) parts.push(`types:${encodeURIComponent(type)}`);

  const url = new URL(API + "/cards");
  if (parts.length) url.searchParams.set("q", parts.join(" "));
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));

  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error("PokémonTCG.io error");
  return await res.json();
}

export async function listSets() {
  const url = new URL(API + "/sets");
  url.searchParams.set("orderBy", "releaseDate");
  url.searchParams.set("pageSize", "250");

  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error("PokémonTCG.io error");
  return await res.json();
}
export async function getCardById(id) {
  const res = await fetch(API + "/cards/" + id, { headers: headers() });
  if (!res.ok) throw new Error("PokémonTCG.io error");
  return await res.json();
}
export function getMarketPrice(card) {
  const prices = card?.tcgplayer?.prices || {};
  for (const v of Object.values(prices)) {
    if (v?.market) return v.market;
  }
  return null;
}
