import { supabase } from '../lib/supabaseClient'
export async function listPosts({ q = '', orderBy = 'created_at', flag='' } = {}) { let query = supabase.from('posts').select('id,title,created_at,upvotes,flag').order(orderBy, { ascending: false }); if (q) query = query.ilike('title', `%${q}%`); if(flag) query = query.eq('flag', flag); return await query }
export async function getPost(id) { const post = await supabase.from('posts').select('*').eq('id', id).single(); const comments = await supabase.from('comments').select('*').eq('post_id', id).order('created_at', { ascending: true }); return { post, comments } }
export async function createPost(payload) { return await supabase.from('posts').insert([payload]).select().single() }
export async function updatePost(id, patch) { return await supabase.from('posts').update(patch).eq('id', id).select().single() }
export async function deletePost(id) { return await supabase.from('posts').delete().eq('id', id) }
export async function upvotePost(id) { const rpc = await supabase.rpc('increment_upvotes', { post_id_input: id }); if (rpc.error) { const { data, error } = await supabase.from('posts').select('upvotes').eq('id', id).single(); if (error) return { error }; const next = (data?.upvotes ?? 0) + 1; return await supabase.from('posts').update({ upvotes: next }).eq('id', id) } return rpc }
