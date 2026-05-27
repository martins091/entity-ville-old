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
  };
}

export async function fetchStorefrontProducts() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return staticProducts;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error || !data?.length) {
    console.error('Unable to load Supabase products', error);
    return staticProducts;
  }

  return data.map(normalizeProduct);
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
