import { getSupabaseBrowserClient } from './client';

export type ImageBucket = 'products' | 'article-images';

function safeFileName(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const base = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return `${base || 'image'}-${Date.now()}.${extension}`;
}

export async function uploadAdminImage({
  file,
  bucket,
  folder,
}: {
  file: File;
  bucket: ImageBucket;
  folder: string;
}) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error('Supabase is not configured.');

  const path = `${folder}/${safeFileName(file)}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
