"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: { name, email, address }, items, total: totalPrice }),
      });

      const data = await res.json();
      if (typeof window !== 'undefined' && data?.id) {
        localStorage.setItem('entityville.orderId', data.id);
      }
      router.push('/checkout/transfer');
    } catch (err) {
      setMessage('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white text-foreground min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black mb-6">Checkout</h1>

        {message && <div className="mb-6 p-4 bg-green-50 text-green-800 rounded">{message}</div>}

        <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded mb-3" required />

            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-3 py-2 border rounded mb-3" required />

            <label className="block text-sm font-medium mb-1">Shipping address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded mb-3" rows={5} required />

            <button disabled={loading} className="bg-accent text-white px-6 py-3 rounded font-bold">{loading ? 'Placing...' : 'Place Order'}</button>
          </div>

          <aside className="bg-white p-4 border rounded">
            <h3 className="font-bold mb-2">Order Summary</h3>
            <div className="text-sm text-muted-foreground mb-4">{items.length} items</div>
            <div className="flex justify-between font-bold text-lg">Total <span>₦{totalPrice.toFixed(2)}</span></div>
            <p className="mt-4 text-muted-foreground text-sm">This is a demo checkout. Payment integration can be added (Stripe, Paystack, etc.).</p>
          </aside>
        </form>

      </div>

      <Footer />
    </main>
  );
}
