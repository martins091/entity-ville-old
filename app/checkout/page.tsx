"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCart } from '@/hooks/use-cart';
import { createStorefrontOrder } from '@/lib/supabase/orders';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      setMessage('Please add at least one product to your cart before checkout.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const order = await createStorefrontOrder({
        customer: { 
          name, 
          email, 
          phone,
          address,
          city,
          state,
          zipCode,
          orderNotes
        },
        items,
        total: totalPrice,
      });

      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order_confirmation',
          orderReference: order.order_reference,
          email,
        }),
      }).catch((error) => {
        console.error('Order confirmation email request failed', error);
      });

      router.push(`/checkout/transfer?orderId=${encodeURIComponent(order.id)}`);
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
            <label className="block text-sm font-medium mb-1">Full name *</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-3 py-2 border rounded mb-3" 
              required 
            />

            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              className="w-full px-3 py-2 border rounded mb-3" 
              required 
            />

            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              type="tel" 
              placeholder="e.g., 08012345678"
              className="w-full px-3 py-2 border rounded mb-3" 
              required 
            />

            <label className="block text-sm font-medium mb-1">Shipping Address *</label>
            <textarea 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Street address, building number, etc."
              className="w-full px-3 py-2 border rounded mb-3" 
              rows={3} 
              required 
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  className="w-full px-3 py-2 border rounded" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <input 
                  value={state} 
                  onChange={(e) => setState(e.target.value)} 
                  className="w-full px-3 py-2 border rounded" 
                  required 
                />
              </div>
            </div>

            <label className="block text-sm font-medium mb-1">ZIP/Postal Code</label>
            <input 
              value={zipCode} 
              onChange={(e) => setZipCode(e.target.value)} 
              className="w-full px-3 py-2 border rounded mb-3" 
            />

            <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
            <textarea 
              value={orderNotes} 
              onChange={(e) => setOrderNotes(e.target.value)} 
              placeholder="Special delivery instructions, additional information, etc."
              className="w-full px-3 py-2 border rounded mb-3" 
              rows={2} 
            />

            <button 
              disabled={loading} 
              className="bg-accent text-white px-6 py-3 rounded font-bold w-full"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

          <aside className="bg-white p-4 border rounded h-fit sticky top-4">
            <h3 className="font-bold mb-2">Order Summary</h3>
            <div className="text-sm text-muted-foreground mb-4">{items.length} items</div>
            
            <div className="border-t pt-3 mb-3">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm mb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₦{((item.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              Total <span>₦{totalPrice.toFixed(2)}</span>
            </div>
            
            <p className="mt-4 text-muted-foreground text-xs">
              After placing your order, save your order reference. You need it with your email address to track your order.
            </p>
          </aside>
        </form>
      </div>

      <Footer />
    </main>
  );
}
