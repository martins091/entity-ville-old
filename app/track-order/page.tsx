"use client";

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Copy, CreditCard, Mail, PackageSearch, ShieldCheck } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

type TrackedOrder = {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  shipping_address: string;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_zip?: string | null;
  order_notes?: string | null;
  items: {
    name: string;
    price?: number;
    quantity: number;
  }[];
  total: number;
  status: 'awaiting_transfer' | 'transfer_notified' | 'verified' | string;
  created_at: string;
  email_logs?: {
    id: string;
    type: string;
    status: string;
    sent_at?: string | null;
    error_message?: string | null;
    created_at: string;
  }[];
};

const statusSteps = [
  { key: 'awaiting_transfer', label: 'Awaiting transfer', icon: CreditCard },
  { key: 'transfer_notified', label: 'Verifying payment', icon: Clock },
  { key: 'verified', label: 'Payment verified', icon: ShieldCheck },
];

function money(value: number) {
  return `₦${Number(value || 0).toLocaleString()}`;
}

function statusIndex(status: string) {
  if (status === 'verified') return 2;
  if (status === 'transfer_notified') return 1;
  return 0;
}

export default function TrackOrderPage() {
  const [orderReference, setOrderReference] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeIndex = useMemo(() => statusIndex(order?.status || ''), [order?.status]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference');
    if (reference) setOrderReference(reference);
  }, []);

  async function handleTrack(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setOrder(null);

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderReference, email }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.error || 'Unable to find this order.');
        return;
      }

      setOrder(data.order);
    } catch {
      setError('Unable to check this order right now.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!order) return;
    setResending(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/resend-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderReference: order.order_reference,
          email: order.customer_email,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.error || 'Unable to resend the email right now.');
        return;
      }

      setMessage(data.warning || 'Confirmation email sent.');
    } catch {
      setError('Unable to resend the email right now.');
    } finally {
      setResending(false);
    }
  }

  async function copyReference() {
    if (!order) return;
    await navigator.clipboard.writeText(order.order_reference);
    setMessage('Order reference copied.');
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Order tracking</p>
          <h1 className="mt-3 text-4xl font-black">Track your Entity Ville order</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Enter your order reference and the email address used at checkout. No account login is required.
          </p>
        </div>

        <form onSubmit={handleTrack} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr,1fr,auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Order reference</span>
            <input
              value={orderReference}
              onChange={(event) => setOrderReference(event.target.value)}
              placeholder="ORD-1734567890123"
              required
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <PackageSearch size={18} />
            {loading ? 'Checking...' : 'Track'}
          </button>
        </form>

        {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {message && <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div>}

        {order && (
          <section className="mt-8 space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Order reference</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black">{order.order_reference}</h2>
                    <button onClick={copyReference} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold hover:bg-slate-50">
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Mail size={18} />
                  {resending ? 'Sending...' : 'Resend confirmation email'}
                </button>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const active = index <= activeIndex;
                  return (
                    <div
                      key={step.key}
                      className={`rounded-lg border p-4 ${
                        active ? 'border-primary bg-blue-50 text-primary' : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}
                    >
                      <Icon size={22} />
                      <p className="mt-2 text-sm font-bold">{step.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((activeIndex + 1) / 3) * 100}%` }} />
              </div>

              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {order.status === 'awaiting_transfer' && (
                  <div>
                    <p className="font-bold text-slate-950">Awaiting bank transfer</p>
                    <p>Transfer the total amount and return to the checkout transfer page to notify us.</p>
                    <p className="mt-3 font-semibold">Bank: First Bank of Nigeria</p>
                    <p>Account Name: Entity Ville Ltd</p>
                    <p>Account Number: 1234567890</p>
                  </div>
                )}
                {order.status === 'transfer_notified' && (
                  <div>
                    <p className="font-bold text-slate-950">Payment verification in progress</p>
                    <p>We received your transfer notice and our team is verifying it.</p>
                  </div>
                )}
                {order.status === 'verified' && (
                  <div>
                    <p className="font-bold text-slate-950">Payment confirmed</p>
                    <p>Your payment is verified. We will contact you soon by phone about delivery.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-black">Order summary</h3>
                <div className="mt-4 space-y-3">
                  {order.items.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-semibold">{money((item.price || 0) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-black">
                  <span>Total</span>
                  <span>{money(order.total)}</span>
                </div>
              </section>

              <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-black">Delivery details</h3>
                <p className="mt-4 text-sm font-semibold">{order.customer_name}</p>
                <p className="mt-1 text-sm text-slate-600">{order.shipping_address}</p>
                <p className="text-sm text-slate-600">
                  {[order.shipping_city, order.shipping_state, order.shipping_zip].filter(Boolean).join(', ')}
                </p>
                {order.order_notes && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <p className="font-semibold text-slate-950">Order notes</p>
                    <p className="mt-1">{order.order_notes}</p>
                  </div>
                )}
              </aside>
            </div>
          </section>
        )}
      </section>

      <Footer />
    </main>
  );
}
