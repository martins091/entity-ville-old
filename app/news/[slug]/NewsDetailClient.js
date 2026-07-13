'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { fetchArticleBySlug } from '@/lib/supabase/articles';

const newsArticles = {
  'cable-tray-selection-guide': {
    title: 'Choosing the Right Cable Trays for Your Industrial Project',
    author: 'John Okonkwo',
    date: 'April 2, 2026',
    image: '/images/cable-tray.png',
    category: 'Cable Management',
    excerpt: 'Learn about galvanized steel vs HDG cable trays, load capacities, and installation best practices...',
    content: `Selecting the right cable tray system is crucial for any industrial or commercial electrical installation. With proper cable management, you can ensure safety, reduce maintenance costs, and extend the life of your electrical infrastructure.

Key Factors to Consider When Choosing Cable Trays:

- Material Type: Galvanized Steel vs Hot-Dip Galvanized (HDG)
- Load Capacity Requirements
- Environmental Conditions (indoor vs outdoor, corrosive environments)
- Cable Types and Quantities
- Future Expansion Needs

Galvanized steel cable trays offer excellent value for indoor applications, providing good corrosion resistance at a competitive price point. For outdoor or harsh environments, HDG cable trays provide superior protection with a thicker zinc coating that can last decades.

Load capacity is another critical consideration. Our heavy-duty cable trays can support up to 300kg per meter, making them suitable for high-density cable installations in power plants and industrial facilities.

Proper installation techniques include maintaining adequate support spacing (typically 1.5-2 meters), using proper fittings for bends and junctions, and ensuring proper grounding of the entire cable tray system.`,
  },
  'circuit-breaker-types-guide': {
    title: 'Understanding Circuit Breaker Types: MCB, MCCB, and ACB',
    author: 'Dr. Amara Hassan',
    date: 'March 28, 2026',
    image: '/images/breakers.jpg',
    category: 'Circuit Protection',
    excerpt: 'A comprehensive guide to selecting the right circuit protection devices...',
    content: `Circuit breakers are essential components in any electrical system, protecting equipment and personnel from overloads and short circuits. Understanding the different types available is crucial for proper selection.

MCB (Miniature Circuit Breaker):
- Current ratings up to 125A
- Ideal for residential and light commercial applications
- Available in B, C, and D curves for different load types
- Compact size for distribution boards

MCCB (Molded Case Circuit Breaker):
- Current ratings from 63A to 1600A
- Adjustable trip settings
- Suitable for industrial applications and motor protection
- Higher breaking capacity than MCBs

ACB (Air Circuit Breaker):
- Current ratings from 800A to 6300A
- Electronic trip units with advanced protection functions
- Used as main breakers in large distribution panels
- Remote operation capabilities

When selecting circuit breakers from leading brands like ABB, Schneider Electric, and Siemens, consider the following:
- Short-circuit current rating at the installation point
- Coordination with upstream and downstream devices
- Environmental conditions (temperature, humidity)
- Maintenance requirements and accessibility

We supply genuine circuit breakers from these trusted brands for all your application needs.`,
  },
  'earthing-systems-safety': {
    title: 'The Importance of Proper Earthing Systems for Electrical Safety',
    author: 'Dr. Emeka Okafor',
    date: 'March 20, 2026',
    image: '/images/earthing-systems.jpg',
    category: 'Earthing & Safety',
    excerpt: 'Why copper bond rods and complete grounding solutions are critical...',
    content: `A properly designed earthing system is the foundation of electrical safety. Without effective grounding, electrical faults can create dangerous voltage gradients, damage equipment, and pose serious risks to personnel.

Benefits of a Quality Earthing System:

- Protection against electric shock hazards
- Equipment protection during fault conditions
- Lightning strike dissipation
- Stable reference voltage for sensitive electronics
- Compliance with electrical codes and standards

Our Copper Bonded Earth Rods offer superior performance with:
- 99.9% pure copper coating (250 microns minimum)
- High tensile steel core for strength
- Excellent corrosion resistance
- 40+ year expected service life

Key components of a complete earthing system include:
- Earth rods (various lengths available: 1.5m, 2m, 3m)
- Earth clamps and connectors
- Copper tape and conductors
- Test points for maintenance verification

Proper installation involves measuring soil resistivity, determining rod spacing requirements, and verifying resistance values (typically less than 1 ohm for industrial applications).`,
  },
  'cable-lugs-copper-aluminum': {
    title: 'Cable Lugs: Copper vs Aluminum - Which One Should You Choose?',
    author: 'John Okonkwo',
    date: 'March 15, 2026',
    image: '/images/cablelugs.jpeg',
    category: 'Electrical Accessories',
    excerpt: 'Understanding the differences in conductivity, corrosion resistance, and applications...',
    content: `When selecting cable lugs for your electrical installation, one of the most important decisions is choosing between copper and aluminum. Each material has its own advantages and ideal applications.

Copper Cable Lugs:
- Higher electrical conductivity (100% IACS)
- Excellent corrosion resistance
- Superior mechanical strength
- Ideal for critical connections and high-current applications
- Compatible with copper cables

Aluminum Cable Lugs:
- Lightweight and cost-effective
- Good conductivity (61% IACS)
- Suitable for aluminum cables
- Requires antioxidant compound for connections
- Ideal for large installations where weight is a concern

Key selection factors include:
- Cable material compatibility (never mix copper and aluminum directly)
- Environmental conditions
- Current carrying requirements
- Budget considerations
- Installation location (indoor vs outdoor)

Always ensure proper crimping tools and techniques are used for reliable connections.`,
  },
  'conduit-pipes-comparison': {
    title: 'PVC vs Metal Conduits: Pros and Cons for Wiring Installations',
    author: 'Dr. Amara Hassan',
    date: 'March 10, 2026',
    image: '/images/conduit-pipe.jpg',
    category: 'Wiring Systems',
    excerpt: 'Comparing durability, fire resistance, installation ease, and cost factors...',
    content: `Choosing between PVC and metal conduits is a critical decision for any electrical installation. Each type offers distinct advantages depending on the application.

PVC Conduits:
- Lightweight and easy to install
- Corrosion-resistant and non-conductive
- Lower cost than metal options
- Ideal for residential and light commercial
- Available in rigid and flexible designs

Metal Conduits (Galvanized Steel / HDG):
- Superior mechanical protection
- Excellent fire resistance
- Provides grounding path
- Ideal for industrial and outdoor applications
- Available in pre-galvanized and HDG finishes

Selection Guidelines:
- Indoor dry locations: PVC or pre-galvanized
- Outdoor/wet locations: HDG or PVC
- Industrial with impact risk: Metal conduits
- Corrosive environments: PVC or HDG
- Fire-sensitive areas: Metal conduits

Consider installation environment, budget, and code requirements when making your selection.`,
  },
  'busbars-power-distribution': {
    title: 'Tinned Copper Busbars: Benefits for Power Distribution',
    author: 'John Okonkwo',
    date: 'March 8, 2026',
    image: '/images/plated-copper-busbar.jpg',
    category: 'Power Distribution',
    excerpt: 'Why tinned copper busbars are essential for efficient power distribution in switchgear...',
    content: `Tinned copper busbars are essential components for efficient power distribution in electrical panels, switchgear, and industrial control systems.

Benefits of Tinned Copper Busbars:

- High electrical conductivity for efficient power transfer
- Tin coating prevents oxidation and corrosion
- Maintenance-free operation
- Long service life even in harsh environments
- Easy to connect to switchgear and distribution panels

Key Specifications:
- Width options: 20mm, 30mm, 50mm, 100mm
- Thickness options: 3mm, 5mm, 6mm, 10mm
- Standard lengths: 1m, 2m, 3m
- Custom lengths available on request

Applications include:
- Main distribution boards
- Industrial control panels
- Transformer connections
- Generator and UPS systems
- Power factor correction equipment

Choose tinned copper busbars for reliable, long-lasting power distribution in your electrical systems.`,
  },
  'lightning-arrestors-guide': {
    title: 'Lightning Arrestors: Protecting Your Electrical Infrastructure',
    author: 'Dr. Amara Hassan',
    date: 'March 3, 2026',
    image: '/images/surge-arresters.png',
    category: 'Surge Protection',
    excerpt: 'How surge protection devices and lightning arrestors safeguard industrial and commercial facilities...',
    content: `Lightning strikes and power surges can cause catastrophic damage to electrical equipment. Lightning arrestors provide essential protection for your valuable infrastructure.

How Lightning Arrestors Work:
- Divert lightning currents safely to ground
- Clamp transient overvoltages
- Protect downstream equipment from surges
- Self-reset after surge events

Our Indelec Lightning Arrestors offer:
- IEC compliant design
- Corrosion-resistant construction
- Easy installation on rooftops and towers
- Reliable performance in all weather conditions

Applications include:
- Industrial facilities and factories
- Telecommunication towers
- Commercial buildings
- Solar farms and renewable energy sites
- Substations and power plants

Don't wait for a lightning strike to damage your equipment. Install proper surge protection today.`,
  },
  'wiring-devices-guide': {
    title: 'A Complete Guide to Wiring Devices for Modern Buildings',
    author: 'Dr. Emeka Okafor',
    date: 'February 25, 2026',
    image: '/images/wiring-device.png',
    category: 'Wiring Accessories',
    excerpt: 'Selecting the right switches, sockets, and lighting fixtures for residential and commercial projects...',
    content: `Wiring devices are the interface between your electrical system and its users. Choosing the right switches, sockets, and lighting fixtures is essential for safety, functionality, and aesthetics.

Types of Wiring Devices:

Switches:
- Single pole, double pole, three-way, and four-way
- Push-button and touch switches
- Dimmer switches for lighting control
- Industrial and weatherproof options

Sockets/Outlets:
- Standard universal sockets
- USB-integrated outlets
- Industrial grade for workshops
- Weatherproof for outdoor use

Lighting Solutions:
- LED panels for offices
- Surface lights for general illumination
- Floodlights for outdoor areas
- Tube lights for industrial settings

Consider factors like load rating, IP rating for outdoor use, and aesthetic preferences when selecting wiring devices for your project.`,
  },
  'inspection-chambers-guide': {
    title: 'Inspection Chambers: Essential for Underground Cable Systems',
    author: 'John Okonkwo',
    date: 'February 20, 2026',
    image: '/images/inspection.png',
    category: 'Underground Infrastructure',
    excerpt: 'Why proper underground access points are critical for maintenance and inspection...',
    content: `Inspection chambers are critical components of underground cable systems, providing essential access points for maintenance, inspection, and repairs.

Benefits of Quality Inspection Chambers:

- Easy access for cable pulling and maintenance
- Protection for underground cable joints
- Resistance to soil pressure and corrosion
- Long service life with minimal maintenance
- Available in various materials and sizes

Available Options:
- Galvanized steel for strength and durability
- HDPE for lightweight and corrosion resistance
- Concrete for heavy-duty applications

Standard Sizes:
- Diameter: 300mm, 450mm, 600mm
- Depth: 600mm, 900mm, 1200mm
- Custom sizes available on request

Applications include:
- Underground power cable systems
- Telecommunications networks
- Street lighting installations
- Industrial facility grounds
- Renewable energy projects

Choose the right inspection chambers for reliable underground cable infrastructure.`,
  },
  'electrical-upgrade-signs': {
    title: '5 Signs Your Electrical Infrastructure Needs an Upgrade',
    author: 'Dr. Amara Hassan',
    date: 'February 15, 2026',
    image: '/images/earthing-systems.jpg',
    category: 'Industry Insights',
    excerpt: 'Warning signs that indicate aging cable trays, breakers, and earthing systems require replacement...',
    content: `Aging electrical infrastructure can pose serious safety risks and operational inefficiencies. Here are five signs that indicate it's time for an upgrade.

1. Frequent Circuit Breaker Trips
If breakers trip frequently, they may be undersized or worn out. Replace with properly rated MCB, MCCB, or ACB units.

2. Visible Corrosion on Cable Trays
Rust and corrosion on cable management systems indicate the need for replacement with HDG or stainless steel options.

3. Inadequate Earthing Systems
If you experience equipment damage from surges or lightning, your earthing system may need upgrading with copper bond rods.

4. Overloaded Distribution Panels
Panels with no space for additional circuits need upgrading with larger busbars and distribution boards.

5. Outdated Wiring Devices
Cracked switches, loose sockets, and flickering lights indicate wiring devices need replacement.

Don't wait for failure - proactive upgrades improve safety, reliability, and efficiency. Contact us for quality replacement components from ABB, Schneider, and Siemens.`,
  },
};

function formatArticleDate(value) {
  if (!value) return '';
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function normalizeDetailArticle(article) {
  if (!article) return null;

  return {
    ...article,
    image: article.image || '/images/electric.png',
    date: formatArticleDate(article.date || article.published_at),
  };
}

export default function NewsDetailClient({ slug }) {
  const [article, setArticle] = useState(() => normalizeDetailArticle(newsArticles[slug]));
  const [loading, setLoading] = useState(() => !newsArticles[slug]);

  useEffect(() => {
    let mounted = true;
    setLoading(!newsArticles[slug]);

    fetchArticleBySlug(slug).then((loadedArticle) => {
      if (!mounted || !loadedArticle) return;
      setArticle(normalizeDetailArticle(loadedArticle));
    }).finally(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (!article && loading) {
    return (
      <main className="bg-white text-foreground">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Loading article</p>
            <h1 className="mt-3 text-4xl font-black text-foreground">Please wait...</h1>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!article) {
    return (
      <main className="bg-white text-foreground">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-black text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">Sorry, we couldn't find this article.</p>
            <Link href="/news" className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-700">
              Back to News
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-white text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-80 bg-gradient-to-r from-primary via-blue-600 to-primary overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-blue-600/90 to-primary/90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <Link href="/news" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 font-semibold text-sm">
            <ArrowLeft size={18} />
            Back to News
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">{article.title}</h1>
          <div className="flex flex-wrap gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>By {article.author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Image */}
          <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl mb-8">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b-2 border-blue-50">
            <span className="inline-block px-3 py-1.5 bg-accent/10 border-l-4 border-accent rounded font-bold text-accent text-xs">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <User size={14} />
              <span className="font-semibold">{article.author}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar size={14} />
              <span className="font-semibold">{article.date}</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-base max-w-none">
            {article.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.includes('-')) {
                return (
                  <ul key={idx} className="space-y-2 my-5">
                    {paragraph.split('\n').map((item, itemIdx) => (
                      item.trim() && (
                        <li key={itemIdx} className="flex items-start gap-2 text-muted-foreground text-base">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>{item.replace('-', '').trim()}</span>
                        </li>
                      )
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-base text-muted-foreground leading-relaxed mb-5">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Product CTA within article */}
          <div className="mt-8 p-5 bg-blue-50 rounded-xl border-l-4 border-accent">
            <p className="text-foreground font-bold mb-2">Need these products for your project?</p>
            <p className="text-sm text-muted-foreground mb-3">Contact us for competitive pricing and expert technical support.</p>
            <Link href="/contact" className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-bold text-sm">
              Request a Quote
            </Link>
          </div>

          {/* Share */}
          <div className="mt-10 pt-6 border-t-2 border-blue-50">
            <p className="text-muted-foreground mb-4 font-semibold text-sm">Share this article:</p>
            <div className="flex gap-3">
              {['Twitter', 'LinkedIn', 'Facebook'].map((platform) => (
                <button key={platform} className="px-4 py-1.5 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition font-semibold text-sm">
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-foreground mb-8">Related <span className="text-accent">Articles</span></h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(newsArticles)
              .filter(([key]) => key !== slug)
              .slice(0, 3)
              .map(([key, article]) => (
                <Link key={key} href={`/news/${key}`} className="bg-white p-5 rounded-xl border-2 border-primary/20 hover:border-primary hover:shadow-xl transition">
                  <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover hover:scale-105 transition"
                    />
                  </div>
                  <p className="text-accent font-bold text-xs mb-1.5">{article.category}</p>
                  <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{article.excerpt}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                    <Calendar size={12} />
                    {article.date}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-primary via-blue-600 to-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full -ml-40 -mb-40" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3">Need Premium Electrical Components?</h2>
          <p className="text-base text-white/90 mb-6 font-semibold">
            Get quotes for cable trays, circuit breakers, busbars, lightning arrestors, wiring devices, and more.
          </p>
          <Link href="/contact" className="inline-block px-8 py-3 bg-accent text-white rounded-lg hover:bg-red-600 transition font-bold text-base shadow-lg hover:shadow-xl">
            Contact Our Team
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
