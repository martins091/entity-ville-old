import { getSupabaseBrowserClient } from './client';

export type Article = {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  active?: boolean;
  published_at?: string;
  date?: string;
};

export const fallbackArticles: Article[] = [
  {
    id: 1,
    title: 'Choosing the Right Cable Trays for Your Industrial Project',
    excerpt: 'Learn about galvanized steel vs HDG cable trays, load capacities, and installation best practices for optimal cable management',
    content: 'Selecting the right cable tray system is crucial for any industrial or commercial electrical installation. With proper cable management, you can ensure safety, reduce maintenance costs, and extend the life of your electrical infrastructure.',
    date: 'April 2, 2026',
    author: 'John Okonkwo',
    category: 'Cable Management',
    image: '/images/cable-tray.png',
    slug: 'cable-tray-selection-guide',
  },
  {
    id: 2,
    title: 'Understanding Circuit Breaker Types: MCB, MCCB, and ACB',
    excerpt: 'A comprehensive guide to selecting the right circuit protection devices from ABB, Schneider, and Siemens for your application',
    content: 'Circuit breakers are essential components in any electrical system, protecting equipment and personnel from overloads and short circuits. Understanding the different types available is crucial for proper selection.',
    date: 'March 28, 2026',
    author: 'Dr. Amara Hassan',
    category: 'Circuit Protection',
    image: '/images/breakers.jpg',
    slug: 'circuit-breaker-types-guide',
  },
  {
    id: 3,
    title: 'The Importance of Proper Earthing Systems for Electrical Safety',
    excerpt: 'Why copper bond rods and complete grounding solutions are critical for protecting equipment and personnel',
    content: 'A properly designed earthing system is the foundation of electrical safety. Without effective grounding, electrical faults can create dangerous voltage gradients, damage equipment, and pose serious risks to personnel.',
    date: 'March 20, 2026',
    author: 'Dr. Emeka Okafor',
    category: 'Earthing & Safety',
    image: '/images/earthing-systems.jpg',
    slug: 'earthing-systems-safety',
  },
];

function normalizeArticle(row: Record<string, any>): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || '',
    author: row.author || 'Entity Ville Team',
    category: row.category || 'News',
    image: row.image || '/images/electric.png',
    active: row.active,
    published_at: row.published_at,
    date: row.published_at,
  };
}

export async function fetchArticles() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return fallbackArticles;

  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('active', true)
    .order('published_at', { ascending: false });

  if (error || !data?.length) {
    if (error) console.warn('Unable to load news articles. Showing fallback articles.', error.message);
    return fallbackArticles;
  }

  return data.map(normalizeArticle);
}

export async function fetchArticleBySlug(slug: string) {
  const supabase = getSupabaseBrowserClient();
  const fallback = fallbackArticles.find((article) => article.slug === slug) || null;
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn('Unable to load news article. Showing fallback article.', error.message);
    return fallback;
  }

  return normalizeArticle(data);
}
