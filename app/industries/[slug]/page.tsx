import IndustryDetailClient from './IndustryDetailClient';

export async function generateStaticParams() {
  // List ALL your industry slugs here
  return [
    { slug: 'oil-gas' },
    { slug: 'telecom' },
    { slug: 'manufacturing' },
    { slug: 'real-estate' },
    { slug: 'utilities' },
    { slug: 'renewable-energy' },
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // IMPORTANT: await the params Promise (Next.js 15 requirement)
  const { slug } = await params;
  
  return <IndustryDetailClient slug={slug} />;
}
