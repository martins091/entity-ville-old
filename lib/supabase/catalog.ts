import { createClient } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from './client';
import { products as fallbackProducts } from '@/lib/products';

export type Product = {
  id: string | number;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  features?: string[];
  specs?: string[];
  applications?: string[];
  active?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  created_at?: string; // Add this field
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number | string;
  image: string | null;
  images: string[] | null;
  features: string[] | null;
  specs: string[] | null;
  applications: string[] | null;
  active: boolean;
  created_at?: string; // Add this field
};

export const staticProducts = fallbackProducts as Product[];

export function normalizeProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category,
    price: Number(row.price || 0),
    image: row.image || '/images/product-power.jpg',
    images: row.images?.length ? row.images : row.image ? [row.image] : [],
    features: row.features || [],
    specs: row.specs || [],
    applications: row.applications || [],
    active: row.active,
    created_at: row.created_at,
  };
}

export async function fetchStorefrontProducts() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return staticProducts;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false }); // ← CHANGED: Order by created_at descending (newest first)

  if (error || !data?.length) {
    if (error) console.warn('Unable to load Supabase products. Showing fallback products.', error.message);
    return staticProducts;
  }

  return data.map(normalizeProduct);
}

export async function fetchStorefrontProductsForServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return staticProducts;

  try {
    const supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false }); // ← CHANGED: Order by created_at descending (newest first)

    if (error || !data?.length) {
      if (error) console.warn('Unable to load server products. Showing fallback products.', error.message);
      return staticProducts;
    }

    return data.map(normalizeProduct);
  } catch (error) {
    console.warn(
      'Unable to load server products. Showing fallback products.',
      error instanceof Error ? error.message : error
    );
    return staticProducts;
  }
}

export async function fetchStorefrontProductBySlug(slug: string) {
  const supabase = getSupabaseBrowserClient();
  const fallback = staticProducts.find((product) => product.slug === slug) || null;

  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('Unable to load Supabase product', error);
    return fallback;
  }

  return normalizeProduct(data);
}