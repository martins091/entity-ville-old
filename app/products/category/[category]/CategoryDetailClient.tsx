"use client";

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/use-cart';
import { products } from '@/lib/products';
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Star, 
  Truck,
  Clock,
  Award,
  CheckCircle,
  ChevronLeft,
  TrendingUp,
  Package
} from 'lucide-react';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
  gradientReverse: "linear-gradient(135deg, #027FFF 0%, #C10008 100%)",
};

export default function CategoryClient({ params }: { params: { category: string } }) {
  const { category } = params;
  const decoded = decodeURIComponent(category);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { addItem } = useCart();
  
  const filtered = products.filter((p) => p.category === decoded);
  
  // Get category stats
  const categoryStats = {
    totalProducts: filtered.length,
    avgPrice: filtered.reduce((sum, p) => sum + p.price, 0) / filtered.length,
    priceRange: {
      min: Math.min(...filtered.map(p => p.price)),
      max: Math.max(...filtered.map(p => p.price))
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <Header />

      {/* Hero Section - Premium Dual Color */}
      <section className="relative overflow-hidden py-24">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-40 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ backgroundColor: colors.primary }}
          />
          <div 
            className="absolute top-40 -left-20 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ backgroundColor: colors.secondary }}
            style={{ animationDelay: '1s' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(193,0,8,0.08)_0%,_rgba(2,127,255,0.05)_50%,_transparent_100%)]" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(${colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${colors.secondary} 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-100 p-8 md:p-12 shadow-2xl"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6">
              <Link href="/" className="text-gray-500 hover:text-gray-700 transition">Home</Link>
              <ChevronLeft size={14} className="text-gray-400 rotate-180" />
              <Link href="/products" className="text-gray-500 hover:text-gray-700 transition">Products</Link>
              <ChevronLeft size={14} className="text-gray-400 rotate-180" />
              <span className="font-semibold" style={{ color: colors.primary }}>{decoded}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-3xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-6">
                  <Sparkles size={14} style={{ color: colors.primary }} />
                  <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: colors.secondary }}>
                    Category Collection
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                      {decoded}
                    </span>
                    <svg className="absolute -bottom-3 left-0 w-full" height="8" viewBox="0 0 400 10" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="categoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={colors.primary} />
                          <stop offset="100%" stopColor={colors.secondary} />
                        </linearGradient>
                      </defs>
                      <path d="M10 5 L390 5" stroke="url(#categoryGradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 6" fill="none"/>
                    </svg>
                  </span>
                </h1>

                <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Browse our premium {decoded.toLowerCase()} collection, engineered for reliability 
                  and performance in demanding applications.
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <Package size={16} style={{ color: colors.secondary }} />
                    <span className="text-sm text-gray-600">
                      <span className="font-bold">{categoryStats.totalProducts}</span> Products
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} style={{ color: colors.primary }} />
                    <span className="text-sm text-gray-600">
                      ₦{categoryStats.priceRange.min.toLocaleString()} - ₦{categoryStats.priceRange.max.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/checkout"
                className="relative inline-flex items-center gap-2 px-8 py-4 text-sm font-bold rounded-full text-white shadow-2xl hover:scale-105 transition-all duration-300 group whitespace-nowrap"
                style={{ background: colors.gradient }}
              >
                <ShoppingBag size={18} />
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header with Stats */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: colors.primary }} />
              <div className="h-0.5 w-4 rounded-full" style={{ backgroundColor: colors.secondary }} />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Premium Selection
              </span>
            </div>
            <h2 className="text-3xl font-black">
              <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                {filtered.length}
              </span>
              <span className="text-gray-900"> Products Available</span>
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{ color: colors.secondary, backgroundColor: `${colors.secondary}10` }}
          >
            View All Categories
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-gradient-to-r from-red-50 to-blue-50 rounded-3xl"
          >
            <div className="inline-flex p-4 rounded-full bg-white shadow-lg mb-4">
              <Package size={48} style={{ color: colors.primary }} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">No products available in the {decoded} category yet.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{ background: colors.gradient }}
            >
              Browse All Products
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  {/* Card Glow Effect */}
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
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover scale-100 group-hover:scale-110 transition duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                      
                      {/* Stock Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-500/90 backdrop-blur-sm rounded-lg shadow-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="text-xs font-bold text-white">In Stock</span>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <span 
                          className="px-2.5 py-1.5 text-xs font-bold rounded-lg shadow-lg text-white"
                          style={{ background: colors.gradient }}
                        >
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-700">4.8</span>
                          <span className="text-xs text-gray-400">(128)</span>
                        </div>
                        <span className="text-xl font-bold" style={{ color: colors.primary }}>
                          ₦{product.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent transition-all duration-300"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: hoveredProduct === product.id ? 'transparent' : '#111827'
                        }}>
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Features */}
                      <div className="flex items-center gap-4 mb-5 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 group/feature">
                          <Zap size={12} style={{ color: colors.primary }} />
                          <span className="text-xs text-gray-500 group-hover/feature:text-gray-700 transition">Premium</span>
                        </div>
                        <div className="flex items-center gap-1.5 group/feature">
                          <Shield size={12} style={{ color: colors.secondary }} />
                          <span className="text-xs text-gray-500 group-hover/feature:text-gray-700 transition">Certified</span>
                        </div>
                        <div className="flex items-center gap-1.5 group/feature">
                          <Truck size={12} style={{ color: colors.primary }} />
                          <span className="text-xs text-gray-500 group-hover/feature:text-gray-700 transition">Fast Ship</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex-1 text-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                          style={{ color: colors.secondary, backgroundColor: `${colors.secondary}10` }}
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => addItem({ 
                            id: product.slug, 
                            name: product.name, 
                            price: product.price, 
                            image: product.image, 
                            slug: product.slug 
                          })}
                          className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md"
                          style={{ background: colors.gradient }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
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

        {/* Trust Section */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 pt-10 border-t border-gray-100"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-3">
                <Award size={20} style={{ color: colors.primary }} />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                  Why Choose Us
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Trusted Quality & Support</h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "2 Year Warranty", desc: "Full coverage on all products" },
                { icon: Truck, title: "Fast Delivery", desc: "Express shipping available" },
                { icon: Clock, title: "24/7 Support", desc: "Expert assistance anytime" },
                { icon: CheckCircle, title: "Certified Quality", desc: "ISO & CE certified" }
              ].map((item, idx) => (
                <div key={idx} className="text-center p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                  <div className="inline-flex p-3 rounded-xl mb-3" style={{ backgroundColor: `${colors.secondary}10` }}>
                    <item.icon size={24} style={{ color: colors.primary }} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}