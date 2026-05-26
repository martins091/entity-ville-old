"use client";

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';

export default function CartPage() {
  const { items, updateQty, removeItem, totalItems, totalPrice } = useCart();

  return (
    <main className="bg-white text-foreground min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-6">Your cart is empty.</p>
            <Link href="/products" className="px-6 py-3 bg-primary text-white rounded-lg font-bold">Browse Products</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {items.map((it) => (
                <div key={it.id || it.slug} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-primary/10">
                  {it.image ? (
                    <div className="w-28 h-20 relative rounded overflow-hidden bg-secondary">
                      <Image src={it.image} alt={it.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-28 h-20 bg-secondary rounded flex items-center justify-center">No Image</div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{it.name}</h3>
                      <button onClick={() => removeItem(it.id || it.slug)} className="text-sm text-muted-foreground">Remove</button>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <label className="text-sm text-muted-foreground">Qty</label>
                      <input type="number" min={0} value={it.quantity} onChange={(e) => updateQty(it.id || it.slug, Number(e.target.value))} className="w-20 px-2 py-1 border rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-white p-6 rounded-lg shadow-sm border border-primary/10">
              <h4 className="font-bold">Order Summary</h4>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" className="block mt-6 w-full text-center bg-accent text-white px-4 py-3 rounded-lg font-bold">Proceed to Checkout</Link>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
