"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutTransferClient({ orderId }: { orderId: string | null }) {
  const { items, totalPrice, clear } = useCart();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [effectiveOrderId, setEffectiveOrderId] = useState<string | null>(orderId);

  useEffect(() => {
    if (!orderId && typeof window !== 'undefined') {
      const stored = localStorage.getItem('entityville.orderId');
      if (stored) {
        setEffectiveOrderId(stored);
      }
    } else if (orderId) {
      setEffectiveOrderId(orderId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('entityville.orderId', orderId);
      }
    }
  }, [orderId]);

  async function handleConfirmTransfer() {
    if (!effectiveOrderId) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/orders/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: effectiveOrderId }),
      });
      const data = await res.json();

      if (res.ok && data?.status) {
        setMessage('Thank you — we have received your notice. We will verify your transfer and deliver your product to your door step.');
        clear();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('entityville.orderId');
        }
      } else {
        setMessage('There was a problem confirming your transfer. Please contact support.');
      }
    } catch (err) {
      console.error(err);
      setMessage('There was a problem confirming your transfer. Please try again.');
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  }

  if (!effectiveOrderId) {
    return (
      <main className="bg-background text-foreground min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-black mb-4">Bank transfer details</h1>
          <p className="text-lg text-muted-foreground mb-8">We could not find an order reference. Please place your order first, then complete the transfer.</p>
          <Link href="/checkout" className="inline-flex rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-blue-700 transition">Go to checkout</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-[2rem] bg-white border border-slate-200 p-10 shadow-2xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Final Step</p>
            <h1 className="text-4xl font-black tracking-tight">Complete your bank transfer</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">Your order is ready. Transfer the amount below and confirm once you have completed it. We'll verify your payment and deliver your product to your door step.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr,0.8fr]">
            <section className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Order reference</p>
                    <p className="mt-2 text-xl font-semibold">{effectiveOrderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Amount</p>
                    <p className="mt-2 text-2xl font-black">₦{totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold mb-4">Bank transfer instructions</h2>
                <div className="grid gap-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-muted-foreground">Bank</p>
                    <p className="mt-1 font-semibold">First Bank of Nigeria</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-muted-foreground">Account name</p>
                    <p className="mt-1 font-semibold">Entity Ville Ltd</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-muted-foreground">Account number</p>
                    <p className="mt-1 font-semibold">1234567890</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-muted-foreground">Transfer amount</p>
                    <p className="mt-1 font-semibold">₦{totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {message && <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">{message}</div>}

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Confirm transfer</h3>
                    <p className="text-sm text-muted-foreground">After you make the payment, click the button below to notify us.</p>
                  </div>
                  <button type="button" onClick={() => setDialogOpen(true)} disabled={loading} className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-blue-700'}`}>
                    {loading ? 'Processing...' : 'I have made the transfer'}
                  </button>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-semibold mb-4">Order summary</h2>
                <div className="space-y-4">
                  {items.length ? (
                    items.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₦{((item.price ?? 0) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-white p-4 text-sm text-muted-foreground">
                      No items currently in cart. If this is a mistake, go back to checkout.
                    </div>
                  )}
                </div>
                <div className="mt-6 rounded-2xl bg-white p-4 text-sm font-semibold flex items-center justify-between">
                  <span>Total</span>
                  <span>₦{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold mb-3">Need help?</h3>
                <p className="text-sm text-muted-foreground">If you have any questions during the transfer, send us a message and we’ll assist you immediately.</p>
                <Link href="/contact" className="mt-4 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-red-600 transition">Contact support</Link>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
            <button type="button" onClick={() => setDialogOpen(false)} className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100">
              ×
            </button>
            <div className="h-1 w-full rounded-t-[1.5rem] bg-gradient-to-r from-primary to-accent" />
            <h2 className="mt-6 text-3xl font-black">Confirm transfer</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Have you completed the bank transfer for order <span className="font-semibold">{effectiveOrderId}</span>? Confirming here tells us to start verification and prepare delivery immediately.
            </p>

            <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground mb-3">Final confirmation</p>
              <p className="text-sm leading-7 text-slate-700">Once confirmed, we will verify your transfer and deliver your product to your door step. This is the last step in your premium checkout experience.</p>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setDialogOpen(false)} className="w-full rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:w-auto">Cancel</button>
              <button type="button" onClick={handleConfirmTransfer} disabled={loading} className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                {loading ? 'Processing...' : 'Confirm transfer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
