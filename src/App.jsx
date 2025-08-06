import { BrowserRouter, Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom'
import Home from './pages/Home'; import NewPost from './pages/NewPost'; import Post from './pages/Post'; import EditPost from './pages/EditPost'; import CardDex from './pages/CardDex'
import './index.css'
function Header(){const [params]=useSearchParams(); const navigate=useNavigate(); const q=params.get('q')||''; const onChange=e=>navigate(`/?q=${encodeURIComponent(e.target.value)}`)
  return(<header className="topbar poke"><Link to="/" className="brand">PokéCardHub</Link><input className="search" placeholder="Search posts" defaultValue={q} onChange={onChange}/><nav><Link to="/">Home</Link><Link to="/cards">CardDex</Link><Link to="/new">Create</Link></nav></header>)}
export default function App(){ if(!localStorage.getItem('pch_user_id')) localStorage.setItem('pch_user_id', crypto.randomUUID())
  return(<BrowserRouter><Header/><main className="container"><Routes><Route path="/" element={<Home/>}/><Route path="/cards" element={<CardDex/>}/><Route path="/new" element={<NewPost/>}/><Route path="/post/:id" element={<Post/>}/><Route path="/post/:id/edit" element={<EditPost/>}/></Routes></main></BrowserRouter>)}
