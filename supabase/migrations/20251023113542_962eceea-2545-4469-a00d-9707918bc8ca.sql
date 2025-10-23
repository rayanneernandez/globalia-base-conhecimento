-- Create storage bucket for knowledge base media
insert into storage.buckets (id, name, public)
values ('knowledge-media', 'knowledge-media', true);

-- Allow public read access to knowledge-media bucket
create policy "Public read access for knowledge media"
on storage.objects for select
using (bucket_id = 'knowledge-media');

-- Allow authenticated users to upload to knowledge-media bucket
create policy "Authenticated users can upload knowledge media"
on storage.objects for insert
with check (bucket_id = 'knowledge-media');

-- Allow authenticated users to update their own uploads
create policy "Authenticated users can update knowledge media"
on storage.objects for update
using (bucket_id = 'knowledge-media');

-- Allow authenticated users to delete their own uploads
create policy "Authenticated users can delete knowledge media"
on storage.objects for delete
using (bucket_id = 'knowledge-media');