
import type { Metadata } from 'next'

import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';

const brands = [
  { name: '3M', image: '/images/brands/3m.jpg' },
  { name: 'ABB', image: '/images/brands/abb.png' },
  { name: 'British General', image: '/images/brands/bg.svg' },
  { name: 'CHINT', image: '/images/brands/chint.png' },
  { name: 'Coleman Cables', image: '/images/brands/coleman.svg' },
  { name: 'Cometstar', image: '/images/brands/cometstar.svg' },
  { name: 'Delta', image: '/images/brands/delta.svg' },
  { name: 'Eaton', image: '/images/brands/eaton.svg' },
  { name: 'ERICO', image: '/images/brands/erico.jpg' },
  { name: 'GE', image: '/images/brands/GE.gif' },
  { name: 'Hager', image: '/images/brands/hager.png' },
  { name: 'Havells', image: '/images/brands/havells.png' },
  { name: 'Kabelmetal Nigeria', image: '/images/brands/kabelmetal.svg' },
  { name: 'Ledvance', image: '/images/brands/ledvance.svg' },
  { name: 'Legrand', image: '/images/brands/legrand.png' }, // fixed
  { name: 'Luceco', image: '/images/brands/luceco.svg' },
  { name: 'Nigerchin', image: '/images/brands/nigerchin.svg' },
  { name: 'OBO', image: '/images/brands/obo.png' },
  { name: 'Omron', image: '/images/brands/omron.jpg' },
  { name: 'OSRAM', image: '/images/brands/osram.png' },
  { name: 'Philips', image: '/images/brands/philips.png' },
  { name: 'Schneider Electric', image: '/images/brands/schneider.png' },
  { name: 'Siemens', image: '/images/brands/siemens.png' },
  { name: 'Weidmüller', image: '/images/brands/weid.png' },
];

export default function BrandsPage() {
  return (
    <main className="bg-white text-foreground">
      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-r from-primary to-blue-600 py-20 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Our Trusted Brands
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-white/90">
          We partner with leading global manufacturers to deliver high-quality electrical and solar solutions.
        </p>
      </section>

      {/* BRANDS GRID */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {brands.map((brand, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-xl transition text-center"
            >
              {/* LOGO (BIGGER NOW) */}
              <div className="relative w-full h-24 mb-6">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-contain"
                //   onError={(e) => {
                //     e.currentTarget.src = '/images/brands/placeholder.png';
                //   }}
                />
              </div>

              {/* BRAND NAME */}
              <p className="text-sm font-semibold text-gray-800">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Brands — Entity Ville Ltd',
  description: 'Trusted brands partnered with Entity Ville Ltd including ABB, Schneider Electric, Siemens, Chint, and more — premium electrical components and solar solutions.',
  alternates: { canonical: 'https://entityville.com/brand' },
}