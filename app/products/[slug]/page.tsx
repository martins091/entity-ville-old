import ProductDetailClient from './ProductDetailClient';

export async function generateStaticParams() {
  // List ALL your product slugs here
  return [
    { slug: 'cable-trays' },
    { slug: 'cable-lugs' },
    { slug: 'earth-rods' },
    { slug: 'circuit-breakers' },
    { slug: 'conduits' },
    { slug: 'busbars' },
    { slug: 'lightning-arrestors' },
    { slug: 'wiring-devices' },
    { slug: 'inspection-chambers' },
    { slug: 'solar-materials' },
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // IMPORTANT: await the params Promise
  const { slug } = await params;
  
  return <ProductDetailClient slug={slug} />;
}
