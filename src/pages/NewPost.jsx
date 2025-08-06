import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../services/posts'
import CardPicker from '../components/CardPicker'
const FLAGS=['','Question','Opinion','Trade']
export default function NewPost(){
  const [title,setTitle]=useState(''),[content,setContent]=useState(''),[image_url,setImageUrl]=useState(''),[flag,setFlag]=useState(''),[card,setCard]=useState(null),[show,setShow]=useState(false)
  const navigate=useNavigate(); const user_id=localStorage.getItem('pch_user_id')
  async function onSubmit(e){ e.preventDefault(); if(!title.trim()) return alert('Title is required')
    const payload={title,content,image_url,user_id,flag, card_id:card?.id||null, card_name:card?.name||null, set_name:card?.set?.name||null, rarity:card?.rarity||null, types:(card?.types||[]).join(', ')||null}
    const {data,error}=await createPost(payload); if(error) return alert(error.message); navigate(`/post/${data.id}`)
  }
  return(<>
    <form className="card form" onSubmit={onSubmit}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Say something about the card (optional)" rows={10} />
      <input value={image_url} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL (optional)" />
      <div className="grid2">
        <select value={flag} onChange={e=>setFlag(e.target.value)}>{FLAGS.map(f=><option key={f} value={f}>{f||'No Flag'}</option>)}</select>
        <button type="button" onClick={()=>setShow(true)}>🔎 Pick a Card</button>
      </div>
      {card?<div className="badges">
        <span className="badge"><strong>Card:</strong> {card.name}</span>
        <span className="badge"><strong>Set:</strong> {card.set?.name}</span>
        <span className="badge"><strong>Rarity:</strong> {card.rarity||'—'}</span>
        <span className="badge"><strong>Types:</strong> {(card.types||[]).join(', ')||'—'}</span>
      </div>:null}
      <button type="submit" className="primary">Create Post</button>
    </form>
    {show?<CardPicker onPick={c=>{setCard(c);setShow(false)}} onClose={()=>setShow(false)} />:null}
  </>)
}
