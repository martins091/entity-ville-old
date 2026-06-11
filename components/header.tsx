"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ShoppingCart, Briefcase, Newspaper, FileText } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import Image from 'next/image';
import { getSupabaseBrowserClient } from '@/lib/supabase/client'; // ← CHANGE THIS

const supabase = getSupabaseBrowserClient();

const industries = [
  { name: 'Oil & Gas', href: '/industries/oil-gas' },
  { name: 'Telecommunications', href: '/industries/telecom' },
  { name: 'Manufacturing', href: '/industries/manufacturing' },
  { name: 'Real Estate & Construction', href: '/industries/real-estate' },
  { name: 'Utilities', href: '/industries/utilities' },
  { name: 'Renewable Energy', href: '/industries/renewable-energy' },
];

// Company info dropdown items
const companyItems = [
  { name: 'About Us', href: '/about' },
  { name: 'Brand', href: '/brand' },
  { name: 'Careers', href: '/careers' },
  { name: 'News', href: '/news' },
];

// Resources dropdown items
const resourceItems = [
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Track Order', href: '/track-order' },
  { name: 'Contact', href: '/contact' },
];

// Category type
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

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      // Check if supabase client is available
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-primary shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
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
        <div className="hidden lg:flex items-center gap-1">
          {/* Home - Always visible */}
          <Link 
            href="/" 
            className="text-foreground font-semibold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg"
          >
            Home
          </Link>

          {/* Products Dropdown - Now using database categories */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('products')}
              className="flex items-center gap-1 text-foreground font-semibold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg"
            >
              Products
              <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'products' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'products' && (
              <div className="absolute left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
                <Link 
                  href="/products" 
                  className="block px-4 py-2.5 text-foreground hover:bg-primary/5 hover:text-primary font-medium text-sm border-b border-gray-100"
                  onClick={() => setOpenDropdown(null)}
                >
                  All Products
                </Link>
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-500">Loading categories...</div>
                  ) : categories.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">No categories found</div>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products/category/${cat.slug}`}
                        className="block px-4 py-2 text-foreground hover:bg-primary/5 hover:text-primary text-sm"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="flex flex-col">
                          <span>{cat.name}</span>
                          <span className="text-xs text-gray-400">{cat.main_category}</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Industries Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('industries')}
              className="flex items-center gap-1 text-foreground font-semibold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg"
            >
              Industries
              <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'industries' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'industries' && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
                {industries.map((industry) => (
                  <Link
                    key={industry.name}
                    href={industry.href}
                    className="block px-4 py-2.5 text-foreground hover:bg-primary/5 hover:text-primary text-sm"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {industry.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Company Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('company')}
              className="flex items-center gap-1 text-foreground font-semibold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg"
            >
              Company
              <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'company' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'company' && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
                {companyItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2.5 text-foreground hover:bg-primary/5 hover:text-primary text-sm"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {item.name === 'Careers' && <Briefcase size={14} />}
                    {item.name === 'News' && <Newspaper size={14} />}
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('resources')}
              className="flex items-center gap-1 text-foreground font-semibold hover:text-primary transition text-sm px-3 py-2 hover:bg-blue-50 rounded-lg"
            >
              Resources
              <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'resources' ? 'rotate-180' : ''}`} />
            </button>
            
            {openDropdown === 'resources' && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
                {resourceItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2.5 text-foreground hover:bg-primary/5 hover:text-primary text-sm"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex items-center gap-2 ml-2">
            <Link 
              href="/contact" 
              className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm shadow-md hover:shadow-lg"
            >
              Get Quote
            </Link>

            <Link 
              href="/cart" 
              className="relative px-3 py-2 text-foreground font-semibold hover:text-primary transition text-sm flex items-center gap-2 hover:bg-blue-50 rounded-lg"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold rounded-full bg-accent text-white min-w-[18px]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="lg:hidden text-foreground p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink href="/" onClick={toggleMenu}>Home</MobileNavLink>
            
            {/* Products Mobile - Now using database categories */}
            <MobileDropdown
              title="Products"
              isOpen={openDropdown === 'mobile-products'}
              onToggle={() => toggleDropdown('mobile-products')}
            >
              <MobileSubLink href="/products" onClick={toggleMenu}>All Products</MobileSubLink>
              {isLoading ? (
                <div className="text-sm text-gray-500 py-2">Loading categories...</div>
              ) : categories.map((cat) => (
                <MobileSubLink 
                  key={cat.id} 
                  href={`/products/category/${cat.slug}`} 
                  onClick={toggleMenu}
                >
                  <div className="flex flex-col">
                    <span>{cat.name}</span>
                    <span className="text-xs text-gray-400">{cat.main_category}</span>
                  </div>
                </MobileSubLink>
              ))}
            </MobileDropdown>

            {/* Industries Mobile */}
            <MobileDropdown
              title="Industries"
              isOpen={openDropdown === 'mobile-industries'}
              onToggle={() => toggleDropdown('mobile-industries')}
            >
              {industries.map((industry) => (
                <MobileSubLink key={industry.name} href={industry.href} onClick={toggleMenu}>
                  {industry.name}
                </MobileSubLink>
              ))}
            </MobileDropdown>

            {/* Company Mobile */}
            <MobileDropdown
              title="Company"
              isOpen={openDropdown === 'mobile-company'}
              onToggle={() => toggleDropdown('mobile-company')}
            >
              {companyItems.map((item) => (
                <MobileSubLink key={item.name} href={item.href} onClick={toggleMenu}>
                  {item.name}
                </MobileSubLink>
              ))}
            </MobileDropdown>

            {/* Resources Mobile */}
            <MobileDropdown
              title="Resources"
              isOpen={openDropdown === 'mobile-resources'}
              onToggle={() => toggleDropdown('mobile-resources')}
            >
              {resourceItems.map((item) => (
                <MobileSubLink key={item.name} href={item.href} onClick={toggleMenu}>
                  {item.name}
                </MobileSubLink>
              ))}
            </MobileDropdown>

            {/* Mobile CTAs */}
            <div className="pt-4 space-y-2">
              <Link 
                href="/contact" 
                className="block w-full text-center px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                onClick={toggleMenu}
              >
                Get Quote
              </Link>
              
              <Link 
                href="/cart" 
                className="flex items-center justify-center gap-2 w-full text-center px-4 py-2.5 bg-white text-foreground rounded-lg border border-gray-200 hover:border-primary transition font-semibold text-sm"
                onClick={toggleMenu}
              >
                <ShoppingCart size={16} />
                Cart {totalItems > 0 && `(${totalItems})`}
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
    <Link 
      href={href} 
      className="block text-foreground font-medium text-base hover:text-primary transition py-3 border-b border-gray-100"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

function MobileDropdown({ title, isOpen, onToggle, children }: { 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode 
}) {
  return (
    <div className="border-b border-gray-100">
      <button 
        onClick={onToggle} 
        className="w-full text-left text-foreground font-medium text-base flex items-center justify-between py-3"
      >
        {title}
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-3 pl-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function MobileSubLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="block text-foreground/80 hover:text-primary text-sm py-2"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}