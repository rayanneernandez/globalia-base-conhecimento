-- Update storage policies to allow public uploads (for internal knowledge base)
drop policy if exists "Authenticated users can upload knowledge media" on storage.objects;
drop policy if exists "Authenticated users can update knowledge media" on storage.objects;
drop policy if exists "Authenticated users can delete knowledge media" on storage.objects;

-- Allow anyone to upload to knowledge-media bucket
create policy "Anyone can upload knowledge media"
on storage.objects for insert
with check (bucket_id = 'knowledge-media');

-- Allow anyone to update knowledge media
create policy "Anyone can update knowledge media"
on storage.objects for update
using (bucket_id = 'knowledge-media');

-- Allow anyone to delete knowledge media
create policy "Anyone can delete knowledge media"
on storage.objects for delete
using (bucket_id = 'knowledge-media');