"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Package, ReceiptText } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/admin/orders', label: 'Orders', icon: ReceiptText },
  { href: '/admin/products', label: 'Products', icon: Package },
];

export default function AdminFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await getSupabaseBrowserClient()?.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <Link href="/" className="block">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Entity Ville</p>
          <h1 className="mt-2 text-2xl font-black">Admin</h1>
        </Link>

        <nav className="mt-10 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  active ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-5 left-5 right-5 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      <section className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin/orders" className="font-black">Entity Ville Admin</Link>
            <button type="button" onClick={handleLogout} className="rounded-md border border-slate-200 p-2">
              <LogOut size={18} />
            </button>
          </div>
          <nav className="mt-4 grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                    active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
    </main>
  );
}
