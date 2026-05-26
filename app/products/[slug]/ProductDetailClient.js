"use client";

import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';
import { productsMap } from '@/lib/products';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ProductDetailClient({ slug }) {
  const product = productsMap[slug];
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [isCartModalOpen, setCartModalOpen] = useState(false);

  // ✅ NEW: active image state
  const [activeImage, setActiveImage] = useState(
    product?.images?.[0] || product?.image
  );

  if (!product) {
    return (
      <main className="bg-white text-foreground">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-black text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">Sorry, we couldn't find this product.</p>
            <Link href="/products" className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-700">Back to Products</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAdd = () => {
    addItem(
      {
        id: product.slug,
        name: product.name,
        price: product.price,
        image: activeImage,
        slug: product.slug,
      },
      qty
    );
    setCartModalOpen(true);
  };

  return (
    <main className="bg-white text-foreground">
      <Header />

      <section className="relative h-64 flex items-center">
        <Image src={product.image} alt={product.name} fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
          <Link href="/products" className="text-white/80 hover:text-white text-sm mb-4 inline-block">← Back to Products</Link>
          <h1 className="text-4xl md:text-5xl font-black">{product.name}</h1>
          <p className="text-lg mt-2 text-white/90">{product.description}</p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        
        {/* ✅ IMAGE GALLERY */}
        <div>
          {/* MAIN IMAGE */}
          <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl mb-4">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover transition duration-300 hover:scale-105"
            />
          </div>

          {/* THUMBNAILS */}
          {product.images && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    activeImage === img ? "border-accent" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt={`thumb-${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div>
          <h2 className="text-3xl font-black text-foreground mb-4">Product Overview</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-1">Category:</p>
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">
              {product.category}
            </span>
          </div>

          <div className="mb-4">
            <div className="text-sm text-muted-foreground">Price</div>
            <div className="text-2xl font-black">₦{product.price.toLocaleString()}</div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-24 px-2 py-1 border rounded"
            />
            <button
              onClick={handleAdd}
              className="inline-flex bg-accent text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-bold"
            >
              Add to Cart
            </button>
            <Link
              href="/contact"
              className="inline-flex bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold items-center gap-2"
            >
              Request Quote <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-foreground mb-8">
            Key <span className="text-accent">Features</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {product.features &&
              product.features.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-primary/10"
                >
                  <CheckCircle2 className="text-accent flex-shrink-0" size={20} />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {product.specs && (
        <section className="py-16 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-foreground mb-8">
            Technical <span className="text-accent">Specifications</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {product.specs.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-primary/10"
              >
                <CheckCircle2 className="text-primary flex-shrink-0" size={20} />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {product.applications && (
        <section className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-black text-foreground mb-8">
              Common <span className="text-accent">Applications</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.applications.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg border border-primary/20 text-center hover:border-accent hover:shadow-md transition"
                >
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Dialog open={isCartModalOpen} onOpenChange={setCartModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Added to cart</DialogTitle>
            <DialogDescription>
              {qty} x {product.name} has been added to your cart. You can continue shopping or go directly to your cart.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-white">
                <Image src={activeImage} alt={product.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {qty}</p>
                <p className="text-sm text-muted-foreground">Total: ₦{(product.price * qty).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-3">
            <Link href="/cart" className="inline-flex w-full justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition">
              View Cart
            </Link>
            <DialogClose className="inline-flex w-full justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
              Continue Shopping
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}