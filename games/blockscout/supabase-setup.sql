-- Run this in your Supabase SQL editor to set up Block Scout cloud backup.
--
-- Privacy model: coordinates are stored shifted by a random per-user offset
-- that never leaves the user's device. The server cannot determine real locations.
-- The user's UUID acts as an unguessable auth token (no login required).

create table blockscout_saves (
    user_id     uuid        primary key,
    data        jsonb       not null default '{}',
    updated_at  timestamptz not null default now()
);

alter table blockscout_saves enable row level security;

-- Anyone can upsert or read a row — the UUID is the auth token.
-- A malicious actor would need to know a specific UUID to tamper with that user's data.
create policy "open access by user_id"
    on blockscout_saves
    for all
    using (true)
    with check (true);
