import { useState } from 'react'
import { searchCards, getMarketPrice } from '../lib/pokemontcg'

export default function CardPicker({ onPick, onClose }){
  const [name, setName] = useState('')
  const [rarity, setRarity] = useState('')
  const [type, setType] = useState('')
  const [setNameQ, setSetNameQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  async function runSearch(e){
    e?.preventDefault()
    setLoading(true)
    try{
      const res = await searchCards({ name, setName: setNameQ, rarity, type, pageSize: 24 })
      setResults(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Find a Card</h3>
        <form onSubmit={runSearch} className="grid2">
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Set (e.g., Evolutions)" value={setNameQ} onChange={e=>setSetNameQ(e.target.value)} />
          <input placeholder="Rarity (e.g., Rare)" value={rarity} onChange={e=>setRarity(e.target.value)} />
          <input placeholder="Type (e.g., Fire)" value={type} onChange={e=>setType(e.target.value)} />
          <button className="primary" type="submit">Search</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
        {loading ? <div className="muted">Loading…</div> : null}
        <div className="grid-cards">
          {results.map(card => (
            <div key={card.id} className="card cardmini" onClick={() => onPick(card)}>
              <img src={card.images?.small} alt={card.name} />
              <div className="muted">{card.name}</div>
              <div className="muted">{card.set?.name}</div>
              <div className="muted">💰 {getMarketPrice(card) ?? '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
