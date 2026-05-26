"use client";

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { products } from '@/lib/products';

export default function CategoryClient({ params }: { params: { category: string } }) {
  const { category } = params;
  const decoded = category;
  const filtered = products.filter((p) => p.category === decoded);
  const { addItem } = useCart();

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Header />

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[2rem] bg-white/95 border border-slate-200 p-10 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Category collection</p>
                <h1 className="text-5xl font-black tracking-tight">{decoded}</h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-8">Browse all products in this premium category and choose the best fit for your project.</p>
              </div>
              <Link href="/products" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700">View all products</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Category collection</p>
            <h2 className="text-3xl font-black">{filtered.length} products in {decoded}</h2>
          </div>
          <Link href="/checkout" className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-red-600 transition">Proceed to Checkout</Link>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative h-72 overflow-hidden">
                <Image src={product.image} alt={product.name} fill className="object-cover transition duration-700 ease-in-out hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{product.category}</span>
                  <span className="font-semibold">₦{product.price.toLocaleString()}</span>
                </div>
                <h3 className="text-xl font-black mb-2">{product.name}</h3>
                <p className="text-sm leading-6 text-slate-600 mb-5">{product.description}</p>
                <div className="flex items-center gap-3">
                  <Link href={`/products/${product.slug}`} className="font-semibold text-primary">View details</Link>
                  <button onClick={() => addItem({ id: product.slug, name: product.name, price: product.price, image: product.image, slug: product.slug })} className="ml-auto rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition">Add to cart</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
