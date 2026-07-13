import CaseStudyDetailClient from './CaseStudyDetailClient';

export async function generateStaticParams() {
  // List ALL your case study slugs here
  return [
    { slug: 'telecom-upgrade' },
    { slug: 'industrial-automation' },
    { slug: 'renewable-energy' },
    { slug: 'commercial-building' },
    { slug: 'utility-substation' },
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // IMPORTANT: await the params Promise (Next.js 15 requirement)
  const { slug } = await params;
  
  return <CaseStudyDetailClient slug={slug} />;
}
