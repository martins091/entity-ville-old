import { products } from '@/lib/products';
import CategoryClient from './CategoryDetailClient';

export async function generateStaticParams() {
  const categories = Array.from(new Set(products.map((product) => product.category)));
  return categories.map((category) => ({ category }));
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;

  return <CategoryClient params={resolvedParams} />;
}
