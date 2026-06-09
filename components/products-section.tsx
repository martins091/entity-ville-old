// components/products-section.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Truck, Star, Eye, Award, Clock, CheckCircle } from "lucide-react";
import { type ProductFamily } from "@/lib/supabase/catalog";
import ProductImage from "@/components/product-image";

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
  gradientReverse: "linear-gradient(135deg, #027FFF 0%, #C10008 100%)",
};

export default function ProductsSection({ initialProductFamilies }: { initialProductFamilies: ProductFamily[] }) {
  const [productFamilies] = useState<ProductFamily[]>(initialProductFamilies.slice(0, 6));
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Helper to get starting price
  const getStartingPrice = (family: ProductFamily): number => {
    if (!family.variants || family.variants.length === 0) return 0;
    const prices = family.variants.map(v => v.price).filter(p => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="products"
      className="py-28 relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top, ${colors.primary}03 0%, rgba(2,127,255,0.02) 50%, rgba(255,255,255,1) 100%)`,
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ backgroundColor: colors.primary }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ backgroundColor: colors.secondary, animationDelay: '1s' }}
        />
        <div className="absolute top-20 left-1/4 w-60 h-60 rounded-full opacity-5 blur-3xl"
          style={{ background: colors.gradient }}
        />
        
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(${colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${colors.secondary} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center lg:text-left lg:flex lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-6">
              <Sparkles size={14} style={{ color: colors.primary }} />
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: colors.secondary }}>
                Electrical Collection
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Premium{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                  Electrical Components
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 300 8" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={colors.primary} />
                      <stop offset="100%" stopColor={colors.secondary} />
                    </linearGradient>
                  </defs>
                  <path d="M10 4 L290 4" stroke="url(#lineGradient)" strokeWidth="2" strokeLinecap="round" strokeDasharray="8 4" fill="none"/>
                </svg>
              </span>
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl">
              High-performance lightning protection and grounding materials engineered for reliability, 
              efficiency, and modern infrastructure across Africa. Trusted by industry leaders.
            </p>
          </div>

          <div className="hidden lg:flex gap-6 mt-6 lg:mt-0">
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">{productFamilies.length}+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Product Families</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-[#C10008] to-[#027FFF]" />
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">500+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Variants</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-[#C10008] to-[#027FFF]" />
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">24/7</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Support</div>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {productFamilies.map((family) => {
            const startingPrice = getStartingPrice(family);
            const variantCount = family.variants?.length || 0;
            
            return (
              <motion.div
                key={family.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredProduct(family.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative"
              >
                <div 
                  className="absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500"
                  style={{ 
                    background: colors.gradient,
                    opacity: hoveredProduct === family.id ? 0.3 : 0
                  }}
                />

                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                    <ProductImage
                      src={family.image_url}
                      alt={family.name}
                      fill
                      className="object-cover scale-100 group-hover:scale-110 transition duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                    <Link
                      href={`/products/category/${family.category?.slug || family.slug}`}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 shadow-xl"
                    >
                      <Eye size={20} style={{ color: colors.primary }} />
                    </Link>

                    <div className="absolute top-4 left-4 flex gap-2">
                      <span 
                        className="px-2.5 py-1 text-white text-xs font-bold rounded-lg shadow-lg"
                        style={{ background: colors.gradient }}
                      >
                        {variantCount} SIZES
                      </span>
                    </div>

                    {startingPrice > 0 && (
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition">
                        <span className="text-xs text-gray-500">From</span>
                        <span className="text-lg font-bold ml-2" style={{ color: colors.primary }}>
                          ₦{startingPrice.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {family.category?.name || family.material || "Electrical"}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">4.8</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-transparent transition-all duration-300"
                      style={{ 
                        backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: hoveredProduct === family.id ? 'transparent' : '#111827'
                      }}>
                      {family.name}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {family.description}
                    </p>

                    <div className="flex items-center gap-4 mb-5 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 group/feature">
                        <Zap size={14} style={{ color: colors.primary }} />
                        <span className="text-xs text-gray-500 group-hover/feature:text-gray-700 transition">Premium</span>
                      </div>
                      <div className="flex items-center gap-1.5 group/feature">
                        <Shield size={14} style={{ color: colors.secondary }} />
                        <span className="text-xs text-gray-500 group-hover/feature:text-gray-700 transition">IEC Certified</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/products/category/${family.category?.slug || family.slug}`}
                        className="flex-1 relative overflow-hidden group/btn rounded-xl px-4 py-2.5 text-center font-semibold transition-all duration-300"
                        style={{ background: colors.gradient }}
                      >
                        <span className="relative z-10 text-white text-sm flex items-center justify-center gap-2">
                          View Details
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition" />
                        </span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition" />
                      </Link>

                      <button 
                        className="px-4 py-2.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 font-semibold text-sm relative overflow-hidden group/truck"
                        style={{ 
                          borderColor: colors.secondary,
                          color: colors.secondary
                        }}
                      >
                        <Truck size={18} className="group-hover/truck:translate-x-0.5 transition" />
                      </button>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: hoveredProduct === family.id ? '100%' : '60%',
                        background: colors.gradient
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* BOTTOM CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="relative inline-block">
            <div 
              className="absolute inset-0 blur-xl opacity-50 rounded-full"
              style={{ background: colors.gradient }}
            />
            <Link
              href="/products"
              className="relative inline-flex items-center gap-3 px-10 py-4 text-base font-bold rounded-full text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
              style={{ background: colors.gradient }}
            >
              <span>Browse All Products</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition duration-300" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 group/badge">
              <Truck size={18} style={{ color: colors.primary }} />
              <span className="text-sm text-gray-600 group-hover/badge:text-gray-900 transition">Free Shipping Over ₦500k</span>
            </div>
            <div className="w-px h-6 bg-gradient-to-b from-[#C10008] to-[#027FFF] hidden sm:block" />
            <div className="flex items-center gap-2 group/badge">
              <Award size={18} style={{ color: colors.secondary }} />
              <span className="text-sm text-gray-600 group-hover/badge:text-gray-900 transition">IEC Certified</span>
            </div>
            <div className="w-px h-6 bg-gradient-to-b from-[#C10008] to-[#027FFF] hidden sm:block" />
            <div className="flex items-center gap-2 group/badge">
              <Clock size={18} style={{ color: colors.primary }} />
              <span className="text-sm text-gray-600 group-hover/badge:text-gray-900 transition">Express Delivery Available</span>
            </div>
            <div className="w-px h-6 bg-gradient-to-b from-[#C10008] to-[#027FFF] hidden sm:block" />
            <div className="flex items-center gap-2 group/badge">
              <CheckCircle size={18} style={{ color: colors.secondary }} />
              <span className="text-sm text-gray-600 group-hover/badge:text-gray-900 transition">500+ Corporate Clients</span>
            </div>
          </div>

          <div className="mt-8 inline-flex items-center gap-6 px-6 py-3 rounded-full bg-gradient-to-r from-red-50 to-blue-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>Trusted By</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
              </div>
            </div>
            <div className="text-xs text-gray-500">500+ Corporate Clients Across Africa</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
