"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ShoppingCart, Briefcase, Newspaper, FileText, Zap, Shield, Package, Activity, Plane, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const supabase = getSupabaseBrowserClient();

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
};

const industries = [
  { name: 'Oil & Gas', href: '/industries/oil-gas', icon: '🛢️' },
  { name: 'Telecommunications', href: '/industries/telecom', icon: '📡' },
  { name: 'Manufacturing', href: '/industries/manufacturing', icon: '🏭' },
  { name: 'Real Estate & Construction', href: '/industries/real-estate', icon: '🏗️' },
  { name: 'Utilities', href: '/industries/utilities', icon: '⚡' },
  { name: 'Renewable Energy', href: '/industries/renewable-energy', icon: '☀️' },
];

const companyItems = [
  { name: 'About Us', href: '/about', description: 'Learn about our story' },
  { name: 'Brand', href: '/brand', description: 'Our values & culture' },
  { name: 'Careers', href: '/careers', description: 'Join our team' },
  { name: 'News', href: '/news', description: 'Latest updates' },
];

const resourceItems = [
  { name: 'Case Studies', href: '/case-studies', description: 'Success stories' },
  { name: 'Technical Resources', href: '/resources', description: 'Downloads & guides' },
  { name: 'Track Order', href: '/track-order', description: 'Track your shipment' },
  { name: 'Contact', href: '/contact', description: 'Get in touch' },
];

type Category = {
  id: string;
  name: string;
  slug: string;
  main_category: string;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { totalItems } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      if (!supabase) {
        console.error('Supabase client not configured');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, main_category')
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Group categories by main_category
  const groupedCategories = categories.reduce((acc, cat) => {
    const group = cat.main_category || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Bar */}
      <div className="hidden lg:block bg-gray-900 text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">✓ IEC EN 62305 Certified</span>
            <span className="flex items-center gap-1">★ 500+ Corporate Clients</span>
            <span className="flex items-center gap-1">🚚 Fast Delivery Across Africa</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-red-400 transition">Support</Link>
            <Link href="/track-order" className="hover:text-red-400 transition">Track Order</Link>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image 
            src="/images/logo.png" 
            alt="Entity Ville" 
            width={180} 
            height={60} 
            className="h-12 w-auto" 
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2" ref={dropdownRef}>
          <Link href="/" className="text-gray-700 font-medium hover:text-red-600 transition px-3 py-2 text-sm">
            Home
          </Link>

          {/* Products Mega Menu - Shifted Left */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('products')}
              className={`flex items-center gap-1 text-gray-700 font-medium hover:text-red-600 transition px-3 py-2 text-sm ${openDropdown === 'products' ? 'text-red-600' : ''}`}
            >
              Products
              <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'products' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'products' && (
              <div className="absolute right-0 mt-2 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="grid grid-cols-4 gap-0">
                  {/* Left Column - Featured Categories */}
                  <div className="col-span-3 p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {Object.entries(groupedCategories).map(([groupName, cats]) => (
                        <div key={groupName}>
                          <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider border-l-2 border-red-500 pl-3">
                            {groupName}
                          </h3>
                          <ul className="space-y-2">
                            {cats.slice(0, 6).map((cat) => (
                              <li key={cat.id}>
                                <Link
                                  href={`/products/category/${cat.slug}`}
                                  className="text-gray-600 hover:text-red-600 text-sm block py-1 hover:translate-x-1 transition-all"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {cat.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link href="/products" className="text-red-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                        View All Products <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Right Column - Promo / Featured */}
                  <div className="bg-gradient-to-br from-red-50 to-blue-50 p-6">
                    <div className="text-center">
                      <Zap size={32} className="mx-auto mb-3 text-red-500" />
                      <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
                      <p className="text-xs text-gray-600 mb-4">Our experts are here to help you choose the right products</p>
                      <Link href="/contact" className="inline-block px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition">
                        Contact Sales
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Industries Mega Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('industries')}
              className={`flex items-center gap-1 text-gray-700 font-medium hover:text-red-600 transition px-3 py-2 text-sm ${openDropdown === 'industries' ? 'text-red-600' : ''}`}
            >
              Industries
              <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'industries' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'industries' && (
              <div className="absolute left-0 mt-2 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                <div className="grid grid-cols-2 gap-0">
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider border-l-2 border-red-500 pl-3">
                      Industries We Serve
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {industries.map((industry) => (
                        <Link
                          key={industry.name}
                          href={industry.href}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition group"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span className="text-2xl">{industry.icon}</span>
                          <div>
                            <div className="font-medium text-gray-800 group-hover:text-red-600">{industry.name}</div>
                            <div className="text-xs text-gray-400">Solutions for {industry.name.toLowerCase()}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                    <Shield size={32} className="mb-3 text-blue-500" />
                    <h4 className="font-bold text-gray-900 mb-2">Custom Solutions</h4>
                    <p className="text-xs text-gray-600 mb-4">Need a solution for your specific industry?</p>
                    <Link href="/contact" className="text-red-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                      Talk to an Expert <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Company Mega Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('company')}
              className={`flex items-center gap-1 text-gray-700 font-medium hover:text-red-600 transition px-3 py-2 text-sm ${openDropdown === 'company' ? 'text-red-600' : ''}`}
            >
              Company
              <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'company' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'company' && (
              <div className="absolute left-0 mt-2 w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                <div className="grid grid-cols-2 gap-0">
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider border-l-2 border-red-500 pl-3">
                      Company
                    </h3>
                    <ul className="space-y-3">
                      {companyItems.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="block p-2 rounded-lg hover:bg-gray-50 transition"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="font-medium text-gray-800 hover:text-red-600">{item.name}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-blue-50 p-6">
                    <Activity size={32} className="mb-3 text-red-500" />
                    <h4 className="font-bold text-gray-900 mb-2">12+ Years</h4>
                    <p className="text-xs text-gray-600 mb-4">Of industry experience serving Africa</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-red-600">500+</span>
                      <span className="text-gray-500">Corporate Clients</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resources Mega Menu */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('resources')}
              className={`flex items-center gap-1 text-gray-700 font-medium hover:text-red-600 transition px-3 py-2 text-sm ${openDropdown === 'resources' ? 'text-red-600' : ''}`}
            >
              Resources
              <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'resources' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'resources' && (
              <div className="absolute left-0 mt-2 w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                <div className="grid grid-cols-2 gap-0">
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider border-l-2 border-red-500 pl-3">
                      Resources
                    </h3>
                    <ul className="space-y-3">
                      {resourceItems.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="block p-2 rounded-lg hover:bg-gray-50 transition"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="font-medium text-gray-800 hover:text-red-600">{item.name}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                    <FileText size={32} className="mb-3 text-blue-500" />
                    <h4 className="font-bold text-gray-900 mb-2">Technical Resources</h4>
                    <p className="text-xs text-gray-600 mb-4">Download catalogs, datasheets, and guides</p>
                    <Link href="/resources" className="text-red-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                      View Resources <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex items-center gap-3 ml-4">
            <Link 
              href="/contact" 
              className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold text-sm shadow-md hover:shadow-lg"
            >
              Get Quote
            </Link>

            <Link 
              href="/cart" 
              className="relative p-2 text-gray-700 hover:text-red-600 transition"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-red-600 text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="lg:hidden p-2 text-gray-700">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink href="/" onClick={toggleMenu}>Home</MobileNavLink>
            
            <MobileDropdown title="Products" isOpen={openDropdown === 'mobile-products'} onToggle={() => toggleDropdown('mobile-products')}>
              {isLoading ? (
                <div className="text-sm text-gray-500 py-2">Loading categories...</div>
              ) : (
                Object.entries(groupedCategories).map(([groupName, cats]) => (
                  <div key={groupName} className="mb-3">
                    <div className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-2">{groupName}</div>
                    {cats.map((cat) => (
                      <MobileSubLink key={cat.id} href={`/products/category/${cat.slug}`} onClick={toggleMenu}>
                        {cat.name}
                      </MobileSubLink>
                    ))}
                  </div>
                ))
              )}
              <MobileSubLink href="/products" onClick={toggleMenu}>All Products</MobileSubLink>
            </MobileDropdown>

            <MobileDropdown title="Industries" isOpen={openDropdown === 'mobile-industries'} onToggle={() => toggleDropdown('mobile-industries')}>
              {industries.map((industry) => (
                <MobileSubLink key={industry.name} href={industry.href} onClick={toggleMenu}>
                  <span className="mr-2">{industry.icon}</span> {industry.name}
                </MobileSubLink>
              ))}
            </MobileDropdown>

            <MobileDropdown title="Company" isOpen={openDropdown === 'mobile-company'} onToggle={() => toggleDropdown('mobile-company')}>
              {companyItems.map((item) => (
                <MobileSubLink key={item.name} href={item.href} onClick={toggleMenu}>
                  {item.name}
                </MobileSubLink>
              ))}
            </MobileDropdown>

            <MobileDropdown title="Resources" isOpen={openDropdown === 'mobile-resources'} onToggle={() => toggleDropdown('mobile-resources')}>
              {resourceItems.map((item) => (
                <MobileSubLink key={item.name} href={item.href} onClick={toggleMenu}>
                  {item.name}
                </MobileSubLink>
              ))}
            </MobileDropdown>

            <div className="pt-4 space-y-2">
              <Link href="/contact" className="block w-full text-center px-4 py-3 bg-red-600 text-white rounded-xl font-semibold text-sm" onClick={toggleMenu}>
                Get Quote
              </Link>
              <Link href="/cart" className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 border border-gray-200 rounded-xl font-semibold text-sm" onClick={toggleMenu}>
                <ShoppingCart size={16} /> Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Mobile helper components
function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-gray-700 font-medium py-3 border-b border-gray-100" onClick={onClick}>
      {children}
    </Link>
  );
}

function MobileDropdown({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100">
      <button onClick={onToggle} className="w-full text-left text-gray-700 font-medium flex items-center justify-between py-3">
        {title}
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="pb-3 pl-4 space-y-2">{children}</div>}
    </div>
  );
}

function MobileSubLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-gray-500 text-sm py-2 hover:text-red-600" onClick={onClick}>
      {children}
    </Link>
  );
}