create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  image_url text,
  upvotes integer not null default 0,
  user_id text,
  flag text,
  card_id text,
  card_name text,
  set_name text,
  rarity text,
  types text,
  created_at timestamptz not null default now()
);
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  body text not null,
  user_id text,
  created_at timestamptz not null default now()
);
create or replace function increment_upvotes(post_id_input uuid)
returns void language sql as $$ update posts set upvotes = upvotes + 1 where id = post_id_input; $$;
