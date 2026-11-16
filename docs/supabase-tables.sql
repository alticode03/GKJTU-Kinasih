-- Jalankan di Supabase Dashboard > SQL Editor untuk memperbaiki RLS Galeri.
-- Tabel public.galeri sudah ada; script ini tidak membuat tabel pelayanan,
-- persembahan, atau kontak karena fitur-fitur tersebut memang dihapus.

alter table public.galeri enable row level security;

drop policy if exists "galeri_public_read" on public.galeri;
create policy "galeri_public_read" on public.galeri
  for select to anon, authenticated using (true);

drop policy if exists "galeri_auth_insert" on public.galeri;
create policy "galeri_auth_insert" on public.galeri
  for insert to authenticated with check (true);

drop policy if exists "galeri_auth_update" on public.galeri;
create policy "galeri_auth_update" on public.galeri
  for update to authenticated using (true) with check (true);

drop policy if exists "galeri_auth_delete" on public.galeri;
create policy "galeri_auth_delete" on public.galeri
  for delete to authenticated using (true);
