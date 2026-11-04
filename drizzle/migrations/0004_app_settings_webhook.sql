create table public.app_settings (
    key text primary key,
    value text not null,
    updated_at timestamptz not null default now()
);

grant select on public.app_settings to authenticated;
grant all on public.app_settings to service_role;

alter table public.app_settings enable row level security;

create policy "Authenticated users can read app settings"
    on public.app_settings
    for select
    to authenticated
    using (true);