"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/use-cart';
import { 
  ShoppingBag, 
  ArrowRight, 
  Filter, 
  X, 
  Sparkles, 
  Zap, 
  Shield, 
  Truck, 
  Star, 
  Clock, 
  Award,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { fetchStorefrontProducts, staticProducts, type Product } from '@/lib/supabase/catalog';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
  gradientReverse: "linear-gradient(135deg, #027FFF 0%, #C10008 100%)",
};

export default function ProductsClient() {
  const { addItem } = useCart();
  const router = useRouter();
  const [category, setCategory] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Product[]>(staticProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategory(params.get('category'));
    fetchStorefrontProducts().then(setCatalog).finally(() => setIsLoading(false));
  }, []);

  const categories = Array.from(new Set(catalog.map((p) => p.category)));
  const filtered = category ? catalog.filter((p) => p.category === category) : catalog;

  function handleCategory(cat: string | null) {
    setCategory(cat);
    if (cat) router.push(`/products?category=${encodeURIComponent(cat)}`);
    else router.push('/products');
    setMobileFiltersOpen(false);
  }

  return (
    <main className="bg-white min-h-screen">
      <Header />

      {/* Hero Section - Premium Dual Color */}
      <section className="relative overflow-hidden py-24">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-40 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: colors.primary }}
          />
          <div 
            className="absolute top-40 -left-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: colors.secondary }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(193,0,8,0.08)_0%,_rgba(2,127,255,0.05)_50%,_transparent_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-100 p-8 md:p-12 shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-3xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-6">
                  <Sparkles size={14} style={{ color: colors.primary }} />
                  <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: colors.secondary }}>
                    Premium Collection
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                  Explore Our{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                      Products
                    </span>
                    <svg className="absolute -bottom-3 left-0 w-full" height="8" viewBox="0 0 400 10" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={colors.primary} />
                          <stop offset="100%" stopColor={colors.secondary} />
                        </linearGradient>
                      </defs>
                      <path d="M10 5 L390 5" stroke="url(#heroGradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 6" fill="none"/>
                    </svg>
                  </span>
                </h1>

                <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Browse our premium electrical components, compare features, 
                  and find the perfect solution for your business needs.
                </p>
              </div>

              {/* CTA Button */}
              <Link
                href="/checkout"
                className="relative inline-flex items-center gap-2 px-8 py-4 text-sm font-bold rounded-full text-white shadow-2xl hover:scale-105 transition-all duration-300 group whitespace-nowrap"
                style={{ background: colors.gradient }}
              >
                <ShoppingBag size={18} />
                <span>Proceed to Checkout</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block space-y-6">
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Filter size={18} style={{ color: colors.primary }} />
                Categories
              </h2>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategory(null)}
                    className={`w-full text-left rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      category === null
                        ? 'text-white shadow-md'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    style={category === null ? { background: colors.gradient } : {}}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategory(cat)}
                      className={`w-full text-left rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                        category === cat
                          ? 'text-white shadow-md'
                          : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                      }`}
                      style={category === cat ? { background: colors.gradient } : {}}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl overflow-hidden shadow-xl"
              style={{ background: colors.gradient }}
            >
              <div className="p-6 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <Clock size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Fast Support</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Need help choosing?</h3>
                <p className="text-sm leading-relaxed text-white/90 mb-6">
                  Talk to our product specialists and get a custom recommendation for your industry.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ color: colors.primary }}
                >
                  Contact us
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg text-center"
            >
              <div className="flex justify-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
              </div>
              <p className="text-sm font-semibold text-gray-700">Trusted by 500+</p>
              <p className="text-xs text-gray-500">Corporate Clients Across Africa</p>
            </motion.div>
          </aside>

          {/* Products Grid */}
          <section className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: colors.primary }} />
                  <div className="h-0.5 w-4 rounded-full" style={{ backgroundColor: colors.secondary }} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Premium Selection
                  </span>
                </div>
                <h2 className="text-3xl font-black">
                  {category ? (
                    <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                      {category}
                    </span>
                  ) : (
                    "All Products"
                  )}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-red-50 to-blue-50 px-4 py-2 text-sm font-semibold" style={{ color: colors.primary }}>
                  {filtered.length} Products Available
                </div>
                
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold"
                >
                  <Filter size={16} />
                  Filters
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Loading products...</p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filtered.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      className="group relative"
                    >
                      {/* Card Glow */}
                      <div
                        className="absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500"
                        style={{
                          background: colors.gradient,
                          opacity: hoveredProduct === product.id ? 0.3 : 0
                        }}
                      />

                      <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                        {/* Image Section */}
                        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                          <Image
                            src={product.images?.[0] || product.image}
                            alt={product.name}
                            fill
                            className="object-cover scale-100 group-hover:scale-110 transition duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                          
                          {/* Stock Badge */}
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-lg">
                              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span className="text-xs font-semibold text-white">In Stock</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium px-2 py-1 rounded-lg bg-gradient-to-r from-red-50 to-blue-50" style={{ color: colors.secondary }}>
                              {product.category}
                            </span>
                            <span className="text-lg font-bold" style={{ color: colors.primary }}>
                              ₦{product.price.toLocaleString()}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent transition-all duration-300"
                            style={{
                              backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              color: hoveredProduct === product.id ? 'transparent' : '#111827'
                            }}>
                            {product.name}
                          </h3>

                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Features */}
                          <div className="flex items-center gap-3 mb-5 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <Zap size={12} style={{ color: colors.primary }} />
                              <span className="text-xs text-gray-500">Premium</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield size={12} style={{ color: colors.secondary }} />
                              <span className="text-xs text-gray-500">Certified</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star size={12} className="fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-500">4.8</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/products/${product.slug}`}
                              className="flex-1 text-center px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                              style={{ color: colors.secondary, backgroundColor: `${colors.secondary}10` }}
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => addItem({
                                id: product.slug,
                                name: product.name,
                                price: product.price,
                                image: product.images?.[0] || product.image,
                                slug: product.slug
                              })}
                              className="px-4 py-2 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md"
                              style={{ background: colors.gradient }}
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: hoveredProduct === product.id ? '100%' : '0%',
                              background: colors.gradient
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex p-4 rounded-full bg-gray-100 mb-4">
                  <ShoppingBag size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try selecting a different category</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Categories</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategory(null)}
                      className={`w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        category === null
                          ? 'text-white'
                          : 'hover:bg-gray-50'
                      }`}
                      style={category === null ? { background: colors.gradient } : {}}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => handleCategory(cat)}
                        className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition ${
                          category === cat
                            ? 'text-white'
                            : 'hover:bg-gray-50'
                        }`}
                        style={category === cat ? { background: colors.gradient } : {}}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}