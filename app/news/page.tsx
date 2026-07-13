import type { Metadata } from 'next'
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Choosing the Right Cable Trays for Your Industrial Project',
    excerpt: 'Learn about galvanized steel vs HDG cable trays, load capacities, and installation best practices for optimal cable management',
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
    date: 'March 20, 2026',
    author: 'Dr. Emeka Okafor',
    category: 'Earthing & Safety',
    image: '/images/earthing-systems.jpg',
    slug: 'earthing-systems-safety',
  },
  {
    id: 4,
    title: 'Cable Lugs: Copper vs Aluminum - Which One Should You Choose?',
    excerpt: 'Understanding the differences in conductivity, corrosion resistance, and applications for electrical terminations',
    date: 'March 15, 2026',
    author: 'John Okonkwo',
    category: 'Electrical Accessories',
    image: '/images/cablelugs.jpeg',
    slug: 'cable-lugs-copper-aluminum',
  },
  {
    id: 5,
    title: 'PVC vs Metal Conduits: Pros and Cons for Wiring Installations',
    excerpt: 'Comparing durability, fire resistance, installation ease, and cost factors for conduit pipe selection',
    date: 'March 10, 2026',
    author: 'Dr. Amara Hassan',
    category: 'Wiring Systems',
    image: '/images/conduit-pipe.jpg',
    slug: 'conduit-pipes-comparison',
  },
  {
    id: 6,
    title: 'Tinned Copper Busbars: Benefits for Power Distribution',
    excerpt: 'Why tinned copper busbars are essential for efficient power distribution in switchgear and industrial panels',
    date: 'March 8, 2026',
    author: 'John Okonkwo',
    category: 'Power Distribution',
    image: '/images/plated-copper-busbar.jpg',
    slug: 'busbars-power-distribution',
  },
  {
    id: 7,
    title: 'Lightning Arrestors: Protecting Your Electrical Infrastructure',
    excerpt: 'How surge protection devices and lightning arrestors safeguard industrial and commercial facilities',
    date: 'March 3, 2026',
    author: 'Dr. Amara Hassan',
    category: 'Surge Protection',
    image: '/images/surge-arresters.png',
    slug: 'lightning-arrestors-guide',
  },
  {
    id: 8,
    title: 'A Complete Guide to Wiring Devices for Modern Buildings',
    excerpt: 'Selecting the right switches, sockets, and lighting fixtures for residential and commercial projects',
    date: 'February 25, 2026',
    author: 'Dr. Emeka Okafor',
    category: 'Wiring Accessories',
    image: '/images/wiring-device.png',
    slug: 'wiring-devices-guide',
  },
  {
    id: 9,
    title: 'Inspection Chambers: Essential for Underground Cable Systems',
    excerpt: 'Why proper underground access points are critical for maintenance and inspection of electrical networks',
    date: 'February 20, 2026',
    author: 'John Okonkwo',
    category: 'Underground Infrastructure',
    image: '/images/inspection.png',
    slug: 'inspection-chambers-guide',
  },
  {
    id: 10,
    title: '5 Signs Your Electrical Infrastructure Needs an Upgrade',
    excerpt: 'Warning signs that indicate aging cable trays, breakers, and earthing systems require replacement',
    date: 'February 15, 2026',
    author: 'Dr. Amara Hassan',
    category: 'Industry Insights',
    image: '/images/earthing-systems.jpg',
    slug: 'electrical-upgrade-signs',
  },
];

export default function NewsPage() {
  return (
    <main className="bg-white text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary via-blue-600 to-blue-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 rounded-full -ml-40 -mb-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">News & Insights</h1>
            <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
              Expert guides and updates on cable management, circuit protection, busbars, lightning arrestors, wiring devices, and more
            </p>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link 
                key={article.id} 
                href={`/news/${article.slug}`} 
                className="bg-white border-2 border-primary/20 rounded-xl overflow-hidden hover:border-primary hover:shadow-2xl transition group cursor-pointer block"
              >
                <div className="relative h-48 overflow-hidden bg-secondary">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  {/* Category */}
                  <div className="inline-block mb-3 w-fit">
                    <span className="px-2.5 py-1 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm mb-5 flex-grow line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="space-y-2 pt-4 border-t-2 border-primary/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={14} className="text-accent" />
                      <span className="font-semibold">
                        {new Date(article.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User size={14} className="text-primary" />
                      <span className="font-semibold">{article.author}</span>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="mt-4 flex items-center gap-2 text-primary font-black text-sm group-hover:text-accent transition cursor-pointer">
                    Read Article
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-bold text-base shadow-lg hover:shadow-xl">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'News & Insights — Entity Ville Ltd',
  description: 'Expert guides and updates on cable management, circuit protection, earthing systems, busbars, lightning arrestors, wiring devices, and best practices for electrical infrastructure.',
  alternates: { canonical: 'https://entityville.com/news' },
}