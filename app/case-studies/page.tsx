import type { Metadata } from 'next'
import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const caseStudies = [
  {
    id: 1,
    title: 'Telecommunications Infrastructure Project',
    industry: 'Telecommunications',
    image: '/images/industry-telecom.jpg',
    challenge: 'Telecom provider needed reliable cable management, grounding, and surge protection for 200+ cell tower sites across Nigeria',
    solution: 'Supplied HDG cable trays, copper cable lugs, earth rods, weatherproof conduits, lightning arrestors, and inspection chambers for complete infrastructure protection',
    results: '40% faster installation, zero cable failures, enhanced lightning protection, 99.9% tower uptime',
    slug: 'telecom-upgrade',
    products: ['Cable Trays', 'Cable Lugs', 'Earth Rods', 'Conduits', 'Lightning Arrestors', 'Inspection Chambers'],
  },
  {
    id: 2,
    title: 'Factory Electrical Systems Upgrade',
    industry: 'Manufacturing',
    image: '/images/industry-manufacturing.jpg',
    challenge: 'Manufacturing plant required complete circuit protection, reliable earthing, and efficient power distribution for new automated production line',
    solution: 'Provided ABB and Schneider circuit breakers (MCB/MCCB), complete earthing system with copper bond rods, tinned copper busbars, cable management solutions, and industrial wiring devices',
    results: '100% uptime, improved safety compliance, 35% reduced maintenance costs, 20% better power distribution efficiency',
    slug: 'industrial-automation',
    products: ['Circuit Breakers', 'Earthing Systems', 'Busbars', 'Cable Trays', 'Cable Lugs', 'Wiring Devices'],
  },
  {
    id: 3,
    title: 'Solar Farm Electrical Infrastructure',
    industry: 'Renewable Energy',
    image: '/images/industry-renewable.jpg',
    challenge: 'Large-scale solar installation needed robust cable protection, surge protection, and grounding systems for 50MW capacity',
    solution: 'Supplied Schneider breakers, heavy-duty cable trays, copper lugs, earthing rods, PVC conduits, DC-rated lightning arrestors, busbars for inverter connections, and inspection chambers for underground cable junctions',
    results: 'Seamless installation, reliable operation, reduced project timeline by 25%, zero surge-related failures',
    slug: 'renewable-energy',
    products: ['Cable Trays', 'Circuit Breakers', 'Earthing Systems', 'Conduits', 'Lightning Arrestors', 'Busbars', 'Inspection Chambers'],
  },
  {
    id: 4,
    title: 'Commercial Building Electrical Installation',
    industry: 'Real Estate',
    image: '/images/industry-real-estate.jpg',
    challenge: 'New 20-story commercial building required complete electrical infrastructure including wiring, protection, and power distribution',
    solution: 'Supplied PVC conduits, wiring devices (switches and sockets), circuit breakers, cable lugs, earthing rods, and tinned copper busbars for distribution boards',
    results: 'On-time project completion, building code compliance, reliable electrical system with zero post-installation issues',
    slug: 'commercial-building',
    products: ['Conduits', 'Wiring Devices', 'Circuit Breakers', 'Cable Lugs', 'Earthing Systems', 'Busbars'],
  },
  {
    id: 5,
    title: 'Utility Substation Upgrade',
    industry: 'Utilities',
    image: '/images/industry-utilities.jpg',
    challenge: 'Power utility needed to upgrade aging substation with modern protection and distribution components',
    solution: 'Provided ACB and MCCB circuit breakers, heavy-duty cable ladders, copper bond earth rods, tinned copper busbars, lightning arrestors, and inspection chambers for underground cable access',
    results: 'Improved grid reliability, reduced outage frequency by 60%, enhanced worker safety, extended equipment lifespan',
    slug: 'utility-substation',
    products: ['Circuit Breakers', 'Cable Ladders', 'Earthing Systems', 'Busbars', 'Lightning Arrestors', 'Inspection Chambers'],
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="bg-white text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary via-blue-600 to-blue-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full -ml-40 -mb-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Case Studies</h1>
            <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
              See how we've supplied premium electrical components for leading companies across Africa
            </p>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {caseStudies.map((study) => (
              <div key={study.id} className="grid md:grid-cols-2 gap-10 items-center pb-16 border-b border-blue-100 last:border-b-0">
                <div className="relative h-72 rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-accent font-bold text-sm tracking-widest uppercase mb-3">{study.industry}</p>
                  <h3 className="text-3xl font-black text-foreground mb-5">{study.title}</h3>
                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-muted-foreground font-bold mb-1">Challenge:</p>
                      <p className="text-foreground text-sm">{study.challenge}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-bold mb-1">Solution:</p>
                      <p className="text-foreground text-sm">{study.solution}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-bold mb-1">Results:</p>
                      <p className="text-primary font-bold text-base">{study.results}</p>
                    </div>
                  </div>
                  
                  {/* Show which products were used */}
                  <div className="mb-5">
                    <p className="text-xs text-muted-foreground font-semibold mb-2">Products Supplied:</p>
                    <div className="flex flex-wrap gap-2">
                      {study.products.map((product, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 text-primary px-2 py-1 rounded">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link href={`/case-studies/${study.slug}`} className="px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-red-600 transition font-bold flex items-center gap-2 w-fit text-sm">
                    Read Full Case Study <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA - Updated to mention all products */}
          <div className="mt-20 text-center p-8 bg-gradient-to-r from-blue-50 to-accent/5 rounded-2xl border-2 border-primary/20">
            <h2 className="text-3xl font-black text-foreground mb-4">Need Premium Electrical Components?</h2>
            <p className="text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get high-quality cable trays, circuit breakers, earthing systems, busbars, lightning arrestors, wiring devices, conduits, cable lugs, and inspection chambers for your next project
            </p>
            <Link href="/contact" className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-bold text-base shadow-lg hover:shadow-xl">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Case Studies — Entity Ville Ltd',
  description: 'Case studies showcasing Entity Ville Ltd supply of electrical components for telecoms, manufacturing, renewable energy, commercial buildings, and utilities across Africa.',
  alternates: { canonical: 'https://entityville.com/case-studies' },
}