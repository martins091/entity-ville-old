import NewsDetailClient from './NewsDetailClient';

export const dynamicParams = true;

export async function generateStaticParams() {
  // List ALL your news article slugs here
  return [
    { slug: 'cable-tray-selection-guide' },
    { slug: 'circuit-breaker-types-guide' },
    { slug: 'earthing-systems-safety' },
    { slug: 'cable-lugs-copper-aluminum' },
    { slug: 'conduit-pipes-comparison' },
    { slug: 'busbars-power-distribution' },
    { slug: 'lightning-arrestors-guide' },
    { slug: 'wiring-devices-guide' },
    { slug: 'inspection-chambers-guide' },
    { slug: 'electrical-upgrade-signs' },
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // IMPORTANT: await the params Promise (Next.js 15 requirement)
  const { slug } = await params;
  
  return <NewsDetailClient slug={slug} />;
}
