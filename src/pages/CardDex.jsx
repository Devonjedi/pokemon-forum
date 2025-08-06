import { useEffect, useState } from "react";
import { searchCards, listSets, getMarketPrice } from "../lib/pokemontcg";
export default function CardDex() {
  const [name, setName] = useState(""),
    [setNameFilter, setSetName] = useState(""),
    [rarity, setRarity] = useState(""),
    [type, setType] = useState("");
  const [sets, setSets] = useState([]),
    [cards, setCards] = useState([]),
    [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = await listSets();
        setSets(res.data || []);
      } catch {}
    })();
  }, []);
  async function run(e) {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await searchCards({
        name,
        setName: setNameFilter,
        rarity,
        type,
        pageSize: 48,
      });
      setCards(res.data || []);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="card">
      <h2>CardDex</h2>
      <form onSubmit={run} className="grid4">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Type (e.g., Fire)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          placeholder="Rarity (e.g., Rare)"
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
        />
        <input
          list="setlist"
          placeholder="Set"
          value={setNameFilter}
          onChange={(e) => setSetName(e.target.value)}
        />
        <datalist id="setlist">
          {sets.map((s) => (
            <option key={s.id} value={s.name} />
          ))}
        </datalist>
        <button className="primary" type="submit">
          Search
        </button>
      </form>
      {loading ? <div className="muted">Loading…</div> : null}
      <div className="grid-cards">
        {cards.map((card) => (
          <div key={card.id} className="card cardmini">
            <img src={card.images?.small} alt={card.name} />
            <div>
              <strong>{card.name}</strong>
            </div>
            <div className="muted">
              {card.set?.name} • {card.rarity || "—"}
            </div>
            <div className="muted">💰 {getMarketPrice(card) ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
