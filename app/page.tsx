import Header from '@/components/header';
import HeroCarousel from '@/components/hero-carousel';
import IndustriesSection from '@/components/industries-section';
import ProductsSection from '@/components/products-section';
import ClientsSection from '@/components/clients-section';
import WhyChooseUs from '@/components/why-choose-us';
import CTASection from '@/components/cta-section';
import Footer from '@/components/footer';
import { fetchStorefrontProductsForServer } from '@/lib/supabase/catalog';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await fetchStorefrontProductsForServer();

  return (
    <main className="bg-background text-foreground">
      <Header />
      <HeroCarousel />
      <ProductsSection initialProducts={products} />
      <IndustriesSection />
      <ClientsSection />
      <WhyChooseUs />
      <CTASection />
      <Footer />
    </main>
  );
}
