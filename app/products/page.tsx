import ProductsClient from './ProductsClient';

export default function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  return <ProductsClient category={searchParams.category ?? null} />;
}
