import { products } from '@/lib/products';
import CategoryClient from './CategoryDetailClient';

export async function generateStaticParams() {
  const categories = Array.from(new Set(products.map((product) => product.category)));
  return categories.map((category) => ({ category }));
}

export default function Page({ params }) {
  return <CategoryClient params={params} />;
}
