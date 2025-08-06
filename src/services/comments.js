import { supabase } from '../lib/supabaseClient'
export async function addComment({ post_id, body, user_id }) { return await supabase.from('comments').insert([{ post_id, body, user_id }]).select().single() }
