"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { fetchStorefrontProducts, staticProducts, type Product } from '@/lib/supabase/catalog';

export default function ProductsClient() {
  const { addItem } = useCart();
  const router = useRouter();
  const [category, setCategory] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Product[]>(staticProducts);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategory(params.get('category'));
    fetchStorefrontProducts().then(setCatalog);
  }, []);

  const categories = Array.from(new Set(catalog.map((p) => p.category)));
  const filtered = category ? catalog.filter((p) => p.category === category) : catalog;

  function handleCategory(cat: string | null) {
    setCategory(cat);
    if (cat) router.push(`/products?category=${encodeURIComponent(cat)}`);
    else router.push('/products');
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Header />

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[2rem] bg-white/95 border border-slate-200 p-10 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Discover premium solutions</p>
                <h1 className="text-5xl font-black tracking-tight">Explore our most powerful products.</h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-8">Browse by category, compare features, and choose the right solution for your business.</p>
              </div>
              <Link href="/checkout" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-primary/20 hover:bg-blue-700 transition">Go to checkout</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black mb-4">Categories</h2>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleCategory(null)} className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-slate-100 ${category === null ? 'bg-slate-100' : ''}`}>All Products</button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button onClick={() => handleCategory(cat)} className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-slate-100 ${category === cat ? 'bg-slate-100 font-bold' : ''}`}>{cat}</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">Fast support</p>
            <h3 className="text-2xl font-black">Need help choosing?</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">Talk to our product specialists and get a custom recommendation for your industry.</p>
            <Link href="/contact" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">Contact us</Link>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Featured products</p>
              <h2 className="text-3xl font-black">{category ? category : 'All products'}</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">{filtered.length} products available</div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-72 overflow-hidden">
                  <Image src={product.images?.[0] || product.image} alt={product.name} fill className="object-cover transition duration-700 ease-in-out hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                    <span className="rounded-full bg-slate-100 px-3 py-1">{product.category}</span>
                    <span className="font-semibold">₦{product.price.toLocaleString()}</span>
                  </div>
                  <h3 className="text-xl font-black mb-2">{product.name}</h3>
                  <p className="text-sm leading-6 text-slate-600 mb-5">{product.description}</p>
                  <div className="flex items-center gap-3">
                    <Link href={`/products/${product.slug}`} className="font-semibold text-primary">View details</Link>
                    <button onClick={() => addItem({ id: product.slug, name: product.name, price: product.price, image: product.images?.[0] || product.image, slug: product.slug })} className="ml-auto rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition">Add to cart</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
