import { createClient } from '@supabase/supabase-js';

const FALLBACK_PRODUCT_IMAGE = '/images/earthing-systems.jpg';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface ProductVariant {
  id: string;
  part_number: string;
  size: string;
  weight: string;
  price: number;
  stock_quantity: number;
}

export interface ProductFamily {
  id: string;
  slug: string;
  name: string;
  description: string;
  material: string;
  standard: string;
  image_url: string;
  category: {
    id: string;
    name: string;
    slug: string;
    main_category: string;
  };
  variants: ProductVariant[];
}

export interface StorefrontProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  features: string[];
  specs: string[];
  applications: string[];
  active: boolean;
}

function getStartingPrice(variants: ProductVariant[] = []) {
  const prices = variants.map((variant) => Number(variant.price || 0)).filter((price) => price > 0);
  return prices.length ? Math.min(...prices) : 0;
}

function familyToStorefrontProduct(family: ProductFamily): StorefrontProduct {
  const image = family.image_url || FALLBACK_PRODUCT_IMAGE;
  const variants = family.variants || [];

  return {
    id: family.id,
    slug: family.slug,
    name: family.name,
    description: family.description,
    category: family.category?.name || family.material || 'Catalogue Product',
    price: getStartingPrice(variants),
    image,
    images: [image],
    features: [
      family.material ? `${family.material} material` : 'Catalogue product family',
      family.standard || 'IEC EN 62305',
      `${variants.length} available variant${variants.length === 1 ? '' : 's'}`,
    ],
    specs: [
      family.standard ? `Standard: ${family.standard}` : '',
      family.material ? `Material: ${family.material}` : '',
      ...variants.slice(0, 8).map((variant) => {
        const details = [variant.size, variant.weight].filter(Boolean).join(' / ');
        return `${variant.part_number}${details ? ` - ${details}` : ''}`;
      }),
    ].filter(Boolean),
    applications: [
      family.category?.main_category || 'Electrical infrastructure',
      family.category?.name || 'Grounding and lightning protection systems',
    ],
    active: true,
  };
}

// Fetch all product families with their variants
export async function fetchProductFamilies(): Promise<ProductFamily[]> {
  const { data, error } = await supabase
    .from('product_families')
    .select(`
      *,
      variants:product_variants(*),
      category:categories(*)
    `);
  
  if (error) {
    console.error('Error fetching product families:', error);
    return [];
  }
  
  return data || [];
}

// Fetch single product family by slug
export async function fetchProductFamilyBySlug(slug: string): Promise<ProductFamily | null> {
  const { data, error } = await supabase
    .from('product_families')
    .select(`
      *,
      variants:product_variants(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching product family by slug:', error);
    return null;
  }
  return data;
}

// Fetch families by category slug - FIXED VERSION
export async function fetchProductFamiliesByCategory(categorySlug: string): Promise<ProductFamily[]> {
  // First, get the category ID from the slug
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, name, slug, main_category')
    .eq('slug', categorySlug)
    .single();
  
  if (categoryError) {
    console.error('Category not found:', categorySlug, categoryError);
    return [];
  }
  
  if (!category) {
    console.error('No category found for slug:', categorySlug);
    return [];
  }
  
  console.log('Found category:', category);
  
  // Then fetch families that belong to this category ID
  const { data: families, error: familiesError } = await supabase
    .from('product_families')
    .select(`
      *,
      variants:product_variants(*),
      category:categories(*)
    `)
    .eq('category_id', category.id);
  
  if (familiesError) {
    console.error('Error fetching families:', familiesError);
    return [];
  }
  
  console.log(`Found ${families?.length || 0} families for category: ${category.name}`);
  
  return families || [];
}

export async function fetchStorefrontProductBySlug(slug: string): Promise<StorefrontProduct | null> {
  const family = await fetchProductFamilyBySlug(slug);
  return family ? familyToStorefrontProduct(family) : null;
}
