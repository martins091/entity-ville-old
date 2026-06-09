"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  Plane
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

export default function ProductsClient() {
  const [productFamilies, setProductFamilies] = useState<ProductFamily[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesWithCounts, setCategoriesWithCounts] = useState(MAIN_CATEGORIES);

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
        // Keep empty state instead of falling back to staticProducts
        setProductFamilies([]);
        setCategoriesWithCounts(MAIN_CATEGORIES);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Calculate total product families
  const totalFamilies = productFamilies.length;

  return (
    <main className="bg-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-100/20 via-transparent to-transparent" />
        
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-blue-50 border border-red-100 mb-6 shadow-sm">
              <Sparkles size={14} style={{ color: colors.primary }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                IEC EN 62305 & 62561 Certified
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
              Lightning Protection &{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                  Grounding Systems
                </span>
                <svg className="absolute -bottom-3 left-0 w-full" height="4" viewBox="0 0 300 4" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={colors.primary} />
                      <stop offset="100%" stopColor={colors.secondary} />
                    </linearGradient>
                  </defs>
                  <path d="M0 2 L300 2" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Complete solutions for external lightning protection, grounding systems, 
              and exothermic welding. Browse our comprehensive catalog of certified products.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package size={18} style={{ color: colors.primary }} />
                <span className="font-medium">{totalFamilies} Product Families</span>
              </div>
              <div className="w-px h-5 bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield size={18} style={{ color: colors.secondary }} />
                <span className="font-medium">IEC Certified</span>
              </div>
              <div className="w-px h-5 bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={18} style={{ color: colors.primary }} />
                <span className="font-medium">12+ Years Experience</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
          <div className="grid lg:grid-cols-2 gap-8">
            {categoriesWithCounts.map((category, idx) => {
              const totalProductsInCategory = category.subcategories.reduce((sum, sub) => sum + (sub.productCount || 0), 0);
              const IconComponent = category.icon;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                  
                  <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className={`p-6 border-b border-gray-100 bg-gradient-to-r ${category.gradient}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}15` }}
                          >
                            <IconComponent size={24} style={{ color: category.color }} />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                            <p className="text-sm text-gray-500">{category.subcategories.length} Product Categories</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: category.color }}>
                            {totalProductsInCategory}
                          </div>
                          <div className="text-xs text-gray-400">Total Products</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid sm:grid-cols-2 gap-2">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/products/category/${sub.slug}`}
                            className="group/item flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100"
                          >
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-700 group-hover/item:text-gray-900 transition">
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
                            <ChevronRight size={16} className="text-gray-400 group-hover/item:text-red-500 group-hover/item:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                      
                      <Link
                        href={`/products/category/${category.subcategories[0]?.slug}`}
                        className="mt-5 block text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
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

      {/* Trust Section */}
      <div className="relative bg-gray-50 py-16 mt-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm mb-4">
              <Shield size={14} style={{ color: colors.primary }} />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Industry Recognition</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Trusted by Industry Leaders</h3>
            <p className="text-gray-500 mt-2">Join 500+ corporate clients across Africa</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { icon: Shield, label: "IEC EN 62305 Certified", color: colors.primary },
              { icon: Zap, label: "12+ Years Experience", color: colors.secondary },
              { icon: Package, label: "500+ Corporate Clients", color: colors.primary },
              { icon: Clock, label: "24/7 Technical Support", color: colors.secondary },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background: colors.gradient }}>
          <div className="absolute inset-0 bg-white/5" />
          
          <div className="relative p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Need help finding the right product?</h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Our technical specialists can help you select the perfect components for your project.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
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