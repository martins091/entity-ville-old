import type { Metadata } from 'next'
import Header from '@/components/header';
import HeroCarousel from '@/components/hero-carousel';
import IndustriesSection from '@/components/industries-section';
import ProductsSection from '@/components/products-section';
import ClientsSection from '@/components/clients-section';
import WhyChooseUs from '@/components/why-choose-us';
import CTASection from '@/components/cta-section';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Header />
      <HeroCarousel />
      <ProductsSection />
      <IndustriesSection />
      <ClientsSection />
      <WhyChooseUs />
      <CTASection />
      <Footer />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Entity Ville Ltd — Premium Electrical Components Supplier in Nigeria',
  description:
    'Entity Ville Ltd supplies premium electrical components across Nigeria and Africa — cable trays, circuit breakers, earthing systems, busbars, lightning protection, conduits, and wiring devices from trusted brands.',
  alternates: { canonical: 'https://entityville.com/' },
}
