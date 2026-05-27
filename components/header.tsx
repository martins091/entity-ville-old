"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { products as productList } from '@/lib/products';

const industries = [
  { name: 'Oil & Gas', href: '/industries/oil-gas' },
  { name: 'Telecommunications', href: '/industries/telecom' },
  { name: 'Manufacturing', href: '/industries/manufacturing' },
  { name: 'Real Estate & Construction', href: '/industries/real-estate' },
  { name: 'Utilities', href: '/industries/utilities' },
  { name: 'Renewable Energy', href: '/industries/renewable-energy' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const { totalItems } = useCart();

  const categories = Array.from(new Set(productList.map((p) => p.category)));

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-primary shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image src="/images/logo.png" alt="Entity Ville" width={180} height={60} className="h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <Link href="/" className="text-foreground font-bold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg">Home</Link>
          
          <Link href="/about" className="text-foreground font-bold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg">About</Link>

          {/* Products Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-1">
              <Link href="/products" className="text-foreground font-bold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg">Products</Link>
              <button className="px-2 py-2 text-foreground/80 hover:text-primary transition rounded-lg">
                <ChevronDown size={16} className="group-hover:rotate-180 transition" />
              </button>
            </div>

            <div className="absolute left-0 mt-0 w-64 bg-white border-2 border-primary/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-3 top-full z-50">
              <div className="grid grid-cols-1 gap-1">
                <Link href="/products" className="block px-3 py-2 text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary rounded-lg transition border-l-3 border-transparent hover:border-accent font-semibold text-sm">All Products</Link>
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="block px-3 py-2 text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary rounded-lg transition border-l-3 border-transparent hover:border-accent font-semibold text-sm"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Industries Dropdown - Widened for longer names */}
          <div className="relative group">
            <button className="text-foreground font-bold hover:text-primary transition text-sm px-3 py-2 flex items-center gap-1 group-hover:bg-blue-50 rounded-lg">
              Industries
              <ChevronDown size={16} className="group-hover:rotate-180 transition" />
            </button>
            <div className="absolute left-0 mt-0 w-80 bg-white border-2 border-primary/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-3 top-full z-50">
              <div className="space-y-1">
                {industries.map((industry) => (
                  <Link
                    key={industry.name}
                    href={industry.href}
                    className="block px-3 py-2 text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary rounded-lg transition border-l-3 border-transparent hover:border-accent font-semibold text-sm"
                  >
                    {industry.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/case-studies" className="text-foreground font-bold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg">Case Studies</Link>
          <Link href="/brand" className="text-foreground font-bold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg">Brand</Link>
          <Link href="/news" className="text-foreground font-bold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg">News</Link>
          <Link href="/careers" className="text-foreground font-bold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg">Careers</Link>
          <Link href="/track-order" className="text-foreground font-bold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg">Track Order</Link>
          <Link href="/contact" className="text-foreground font-bold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg">Contact</Link>
          
          {/* Get Quote Button */}
          <Link href="/contact" className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-red-600 transition font-bold text-sm shadow-lg hover:shadow-xl ml-2">
            Get Quote
          </Link>

          {/* Cart */}
          <Link href="/cart" className="ml-3 px-3 py-2 text-foreground font-bold hover:text-primary transition text-sm flex items-center gap-2">
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-accent text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="lg:hidden text-foreground">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t-2 border-primary bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-5 py-5 space-y-2">
            <Link href="/" className="block text-foreground font-bold text-base hover:text-primary transition py-2 border-b border-blue-50" onClick={toggleMenu}>Home</Link>
            
            <Link href="/about" className="block text-foreground font-bold text-base hover:text-primary transition py-2 border-b border-blue-50" onClick={toggleMenu}>About</Link>

            {/* Products Mobile - categories */}
            <div>
              <button onClick={() => setProductsOpen(!productsOpen)} className="w-full text-left text-foreground font-bold text-base flex items-center justify-between py-2 border-b border-blue-50">
                Products
                <ChevronDown size={18} className={`transition ${productsOpen ? 'rotate-180' : ''}`} />
              </button>
              {productsOpen && (
                <div className="space-y-1 py-2 pl-3">
                  <Link href="/products" className="block text-foreground hover:text-primary font-medium text-sm py-2" onClick={toggleMenu}>All Products</Link>
                  {categories.map((cat) => (
                    <Link key={cat} href={`/products?category=${encodeURIComponent(cat)}`} className="block text-foreground hover:text-primary font-medium text-sm py-2" onClick={toggleMenu}>
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Industries Mobile */}
            <div>
              <button onClick={() => setIndustriesOpen(!industriesOpen)} className="w-full text-left text-foreground font-bold text-base flex items-center justify-between py-2 border-b border-blue-50">
                Industries
                <ChevronDown size={18} className={`transition ${industriesOpen ? 'rotate-180' : ''}`} />
              </button>
              {industriesOpen && (
                <div className="space-y-1 py-2 pl-3">
                  {industries.map((industry) => (
                    <Link key={industry.name} href={industry.href} className="block text-foreground hover:text-primary font-medium text-sm py-2" onClick={toggleMenu}>
                      {industry.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/case-studies" className="block text-foreground font-bold text-base hover:text-primary transition py-2 border-b border-blue-50" onClick={toggleMenu}>Case Studies</Link>
            <Link href="/news" className="block text-foreground font-bold text-base hover:text-primary transition py-2 border-b border-blue-50" onClick={toggleMenu}>News</Link>
            <Link href="/careers" className="block text-foreground font-bold text-base hover:text-primary transition py-2 border-b border-blue-50" onClick={toggleMenu}>Careers</Link>
            <Link href="/track-order" className="block text-foreground font-bold text-base hover:text-primary transition py-2 border-b border-blue-50" onClick={toggleMenu}>Track Order</Link>
            <Link href="/contact" className="block text-foreground font-bold text-base hover:text-primary transition py-2 border-b border-blue-50" onClick={toggleMenu}>Contact</Link>
            
            {/* Get Quote Button - Mobile */}
            <Link href="/contact" className="block w-full text-center px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-red-600 transition font-bold text-sm shadow-lg mt-4" onClick={toggleMenu}>
              Get Quote
            </Link>

            <Link href="/cart" className="block w-full text-center px-4 py-2.5 bg-white text-foreground rounded-lg border border-primary mt-3 font-bold" onClick={toggleMenu}>
              View Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
