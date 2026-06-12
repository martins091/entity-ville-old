"use client";

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Clock, 
  ChevronRight,
  Package,
  Zap,
  Database,
  Activity,
  Plane,
  Truck,
  Award,
  TrendingUp,
  Headphones
} from 'lucide-react';
import { fetchProductFamilies, type ProductFamily } from '@/lib/supabase/catalog';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
};

// Main Categories from your document
const MAIN_CATEGORIES = [
  {
    id: 'grounding-systems',
    name: 'GROUNDING SYSTEMS',
    icon: Database,
    color: '#10B981',
    gradient: 'from-emerald-50 to-transparent',
    subcategories: [
      { name: 'Earthing Conductors', slug: 'earthing-conductors' },
      { name: 'Isolated Down Systems', slug: 'isolated-down-systems' },
      { name: 'Conductor Connection Elements', slug: 'conductor-connection-elements' },
      { name: 'Equipotential Earth Bars', slug: 'equipotential-earth-bars' },
      { name: 'Earthing Electrodes', slug: 'earthing-electrodes' },
      { name: 'Earthing Rod Elements', slug: 'earthing-rod-elements' },
      { name: 'Earthing Rod Clamps', slug: 'earthing-rod-clamps' },
      { name: 'Inspection Pits', slug: 'inspection-pits' },
      { name: 'Earth Points', slug: 'earth-points' },
      { name: 'Electrical Safety Equipments', slug: 'electrical-safety-equipments' },
      { name: 'Electrical Insulation Materials', slug: 'electrical-insulation-materials' },
      { name: 'Ground Enhancement Material', slug: 'ground-enhancement-material' },
    ]
  },
  {
    id: 'external-lightning-protection',
    name: 'EXTERNAL LIGHTNING PROTECTION',
    icon: Zap,
    color: '#F59E0B',
    gradient: 'from-amber-50 to-transparent',
    subcategories: [
      { name: 'E.S.E Active Lightning Rods', slug: 'ese-active-lightning-rods' },
      { name: 'Lightning Strike Counters', slug: 'lightning-strike-counters' },
      { name: 'Galvanized Steel Poles', slug: 'galvanized-steel-poles' },
      { name: 'Pole Adapters', slug: 'pole-adapters' },
      { name: 'Pole Clamps', slug: 'pole-clamps' },
      { name: 'Pole Bases', slug: 'pole-bases' },
      { name: 'Test Clamps', slug: 'test-clamps' },
      { name: 'Pole Stretch Components', slug: 'pole-stretch-components' },
      { name: 'Fixing Clamps', slug: 'fixing-clamps' },
      { name: 'Air Terminals', slug: 'air-terminals' },
      { name: 'Fixing Bases', slug: 'fixing-bases' },
    ]
  },
  {
    id: 'exothermic-welding',
    name: 'EXOTHERMIC WELDING SYSTEMS',
    icon: Activity,
    color: '#EF4444',
    gradient: 'from-red-50 to-transparent',
    subcategories: [
      { name: 'Exothermic Welding Systems', slug: 'exothermic-welding-systems' },
      { name: 'Technical Information', slug: 'exothermic-technical-info' },
      { name: 'Product Selection Charts', slug: 'product-selection-charts' },
      { name: 'Grounding Systems', slug: 'exothermic-grounding-systems' },
    ]
  },
  {
    id: 'aircraft-warning',
    name: 'AIRCRAFT WARNING SYSTEMS',
    icon: Plane,
    color: '#8B5CF6',
    gradient: 'from-purple-50 to-transparent',
    subcategories: [
      { name: 'Aircraft Warning Systems', slug: 'aircraft-warning-systems' },
      { name: 'Technical Information', slug: 'aircraft-technical-info' },
    ]
  },
];

// Animated Counter Component
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={counterRef} className="text-2xl md:text-3xl font-black">
      {count}{suffix}
    </span>
  );
}

export default function ProductsClient() {
  const [productFamilies, setProductFamilies] = useState<ProductFamily[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesWithCounts, setCategoriesWithCounts] = useState(MAIN_CATEGORIES);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    fetchProductFamilies()
      .then(families => {
        setProductFamilies(families);
        
        const updatedCategories = MAIN_CATEGORIES.map(category => ({
          ...category,
          subcategories: category.subcategories.map(sub => ({
            ...sub,
            productCount: families.filter(family => family.category?.name === sub.name).length
          }))
        }));
        
        setCategoriesWithCounts(updatedCategories);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setProductFamilies([]);
        setCategoriesWithCounts(MAIN_CATEGORIES);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const totalFamilies = productFamilies.length;

  return (
    <main className="bg-white min-h-screen">
      <Header />

      {/* Premium Hero Section - Adjusted height to show all content without scrolling */}
      <section ref={heroRef} className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center overflow-hidden">
        {/* Animated Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ scale }}
        >
          <Image
            src="/images/bg.png"
            alt="Lightning Protection Products"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10" />
        </motion.div>

        {/* Animated Lightning Effect */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-[10%] w-32 h-32 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-40 left-[5%] w-48 h-48 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-[20%] w-64 h-64 rounded-full bg-red-500/5 blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Premium Badge with Glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 relative group"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                Industry Leader Since 2012 | IEC EN 62305 & 62561 Certified
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight"
            >
              <span className="text-white">Lightning Protection &</span>
              <br />
              <span className="relative inline-block mt-2">
                <span className="bg-gradient-to-r from-[#C10008] via-red-500 to-[#027FFF] bg-clip-text text-transparent">
                  Grounding Systems
                </span>
                {/* Animated Underline */}
                <motion.svg 
                  className="absolute -bottom-3 left-0 w-full" 
                  height="3" 
                  viewBox="0 0 300 3" 
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={colors.primary} />
                      <stop offset="50%" stopColor="#FF3366" />
                      <stop offset="100%" stopColor={colors.secondary} />
                    </linearGradient>
                  </defs>
                  <path d="M0 1.5 L300 1.5" stroke="url(#lineGradient)" strokeWidth="2" strokeLinecap="round" fill="none" />
                </motion.svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed"
            >
              Complete solutions for external lightning protection, grounding systems, 
              and exothermic welding. Trusted by 500+ corporate clients across Africa.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <Link
                href="#categories"
                className="group relative inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full text-white font-semibold text-sm md:text-base shadow-2xl transition-all duration-300 overflow-hidden"
                style={{ background: colors.gradient }}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now
                  <ShoppingBag size={16} className="md:size-18 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold text-sm md:text-base hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <Headphones size={16} className="md:size-18 group-hover:animate-pulse" />
                Contact Experts
                <ArrowRight size={14} className="md:size-16 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats - All visible without scrolling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/20"
            >
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20">
                  <Package size={18} className="md:size-22 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">
                    <AnimatedCounter target={totalFamilies} />+
                  </div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">Product Families</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20">
                  <Shield size={18} className="md:size-22 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">IEC</div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">Certified</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20">
                  <Truck size={18} className="md:size-22 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">500+</div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">Corporate Clients</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20">
                  <Clock size={18} className="md:size-22 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">24/7</div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">Support</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Smaller and less intrusive */}
        <motion.div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center">
            <div className="w-0.5 h-1.5 bg-white/30 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Categories Grid */}
      <div id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-4">
            <Sparkles size={14} style={{ color: colors.primary }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
              Shop by Category
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">
            Browse Our{' '}
            <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
              Product Catalog
            </span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of certified lightning protection and grounding products
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-red-600 rounded-full animate-ping opacity-75" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {categoriesWithCounts.map((category, idx) => {
              const totalProductsInCategory = category.subcategories.reduce((sum, sub) => sum + (sub.productCount || 0), 0);
              const IconComponent = category.icon;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                  
                  <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className={`p-5 md:p-6 border-b border-gray-100 bg-gradient-to-r ${category.gradient}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div 
                            className="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-md"
                            style={{ backgroundColor: `${category.color}15` }}
                          >
                            <IconComponent size={20} className="md:size-28" style={{ color: category.color }} />
                          </div>
                          <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">{category.name}</h2>
                            <p className="text-xs md:text-sm text-gray-500">{category.subcategories.length} Product Categories</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl md:text-2xl font-bold" style={{ color: category.color }}>
                            {totalProductsInCategory}
                          </div>
                          <div className="text-xs text-gray-400">Total Products</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="grid sm:grid-cols-2 gap-2">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/products/category/${sub.slug}`}
                            className="group/item flex items-center justify-between p-2 md:p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                          >
                            <div className="flex-1">
                              <span className="text-xs md:text-sm font-medium text-gray-700 group-hover/item:text-gray-900 transition">
                                {sub.name}
                              </span>
                              {sub.productCount > 0 && (
                                <div className="mt-1">
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                    {sub.productCount} products
                                  </span>
                                </div>
                              )}
                            </div>
                            <ChevronRight size={14} className="md:size-16 text-gray-400 group-hover/item:text-red-500 group-hover/item:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                      
                      <Link
                        href={`/products/category/${category.subcategories[0]?.slug}`}
                        className="mt-4 md:mt-5 block text-center py-2 md:py-3 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                        style={{ color: colors.secondary, backgroundColor: `${colors.secondary}08` }}
                      >
                        Browse All {category.name.split(' ')[0]} Products →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Featured Products Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-12 md:py-16 my-6 md:my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 mb-3">
                <TrendingUp size={14} className="text-white" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">Featured Products</span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Need a Custom Solution?</h3>
              <p className="text-gray-300 mt-1 max-w-md">Get personalized recommendations from our technical experts</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ background: colors.gradient }}
            >
              Request a Quote
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="relative bg-gray-50 py-12 md:py-16 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm mb-3">
              <Award size={14} style={{ color: colors.primary }} />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Why Choose Us</span>
            </div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Trusted by Industry Leaders</h3>
            <p className="text-gray-500 mt-1">Join 500+ corporate clients across Africa</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Shield size={24} className="md:size-28" style={{ color: colors.primary }} />
              </div>
              <h4 className="font-bold text-gray-800">IEC Certified</h4>
              <p className="text-xs text-gray-500 mt-1">EN 62305 & 62561</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Truck size={24} className="md:size-28" style={{ color: colors.secondary }} />
              </div>
              <h4 className="font-bold text-gray-800">Fast Delivery</h4>
              <p className="text-xs text-gray-500 mt-1">Across Africa</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Headphones size={24} className="md:size-28" style={{ color: colors.primary }} />
              </div>
              <h4 className="font-bold text-gray-800">24/7 Support</h4>
              <p className="text-xs text-gray-500 mt-1">Technical assistance</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Award size={24} className="md:size-28" style={{ color: colors.secondary }} />
              </div>
              <h4 className="font-bold text-gray-800">2 Year Warranty</h4>
              <p className="text-xs text-gray-500 mt-1">On all products</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background: colors.gradient }}>
          <div className="absolute inset-0 bg-white/5" />
          <div className="absolute inset-0 bg-black/10" />
          
          <div className="relative p-6 md:p-8 lg:p-12 text-center text-white">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">Need help finding the right product?</h3>
            <p className="text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
              Our technical specialists can help you select the perfect components for your project.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 bg-white rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ color: colors.primary }}
            >
              Contact Our Experts
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}