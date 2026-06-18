"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Package,
  Zap,
  Database,
  Activity,
  Plane,
  Truck,
  Award,
  Headphones,
  Layers,
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import { fetchProductFamilies, type ProductFamily } from '@/lib/supabase/catalog';
import ProductImage from '@/components/product-image';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
};

type CatalogCategory = {
  id: string;
  name: string;
  icon: typeof Package;
  color: string;
  subcategories: { name: string; slug: string }[];
};

function familyMatchesSearch(family: ProductFamily, term: string) {
  const query = term.trim().toLowerCase();
  if (!query) return true;

  return (
    family.name.toLowerCase().includes(query) ||
    family.description?.toLowerCase().includes(query) ||
    family.material?.toLowerCase().includes(query) ||
    family.category?.name?.toLowerCase().includes(query) ||
    family.category?.main_category?.toLowerCase().includes(query) ||
    family.variants?.some((variant) =>
      [
        variant.part_number,
        variant.size,
        variant.weight,
      ].some((value) => value?.toLowerCase().includes(query))
    )
  );
}

function getStartingPrice(family: ProductFamily) {
  const prices = family.variants?.map((variant) => Number(variant.price || 0)).filter((price) => price > 0) || [];
  return prices.length ? Math.min(...prices) : 0;
}

const CATEGORY_LABELS: Record<string, string> = {
  "cable-management": "Cable Management Systems",
  "grounding-systems": "Grounding Systems",
  "external-lightning-protection": "External Lightning Protection",
  "exothermic-welding": "Exothermic Welding Systems",
  "aircraft-warning": "Aircraft Warning Systems",
};

function formatCategoryName(value?: string | null) {
  if (!value) return 'Other Products';
  const normalized = value.trim();
  const mapped = CATEGORY_LABELS[normalized.toLowerCase()];
  if (mapped) return mapped;
  if (normalized === normalized.toUpperCase() && normalized.includes(' ')) return normalized;

  return normalized
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// Main Categories from your document
const MAIN_CATEGORIES = [
  {
    id: 'grounding-systems',
    name: 'GROUNDING SYSTEMS',
    icon: Database,
    color: '#10B981',
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
    subcategories: [
      { name: 'Aircraft Warning Systems', slug: 'aircraft-warning-systems' },
      { name: 'Technical Information', slug: 'aircraft-technical-info' },
    ]
  },
  {
    id: 'cable-management',
    name: 'CABLE MANAGEMENT SYSTEMS',
    icon: Layers,
    color: '#059669',
    subcategories: [
      { name: 'AMF Series Cable Trays (PG & HDG)', slug: 'amf-cable-trays' },
      { name: 'ALL Series Cable Trays (PG & HDG)', slug: 'all-cable-trays' },
      { name: 'Heavy Duty Cable Trays (PG & HDG)', slug: 'heavy-duty-trays' },
      { name: 'Cable Tray Accessories (PG & HDG)', slug: 'cable-tray-accessories' },
      { name: 'Medium Duty Cable Trays (PG & HDG)', slug: 'medium-duty-trays' },
      { name: 'Wiremesh Cable Trays', slug: 'wiremesh-trays' },
      { name: 'CM - FM Series Cable Ladders (PG & HDG)', slug: 'cable-ladders' },
      { name: 'Marine Type Cable Ladders (HDG)', slug: 'marine-ladders' },
      { name: 'Trunking Cable Trays', slug: 'trunking-trays' },
      { name: 'Underfloor Trunking', slug: 'underfloor-trunking' },
      { name: 'Supporting Systems (PG & HDG)', slug: 'supporting-systems' },
      { name: 'C Profile (PG & HDG)', slug: 'c-profiles' },
      { name: 'U Profile Systems (PG & HDG)', slug: 'u-profiles' },
      { name: 'I Profile Systems (PG & HDG)', slug: 'i-profiles' },
      { name: 'Hardwares', slug: 'hardwares' },
      { name: 'EMT Conduits', slug: 'emt-conduits' },
      { name: 'YTS - Earthing & Accessories', slug: 'yts-earthing' },
    ]
  },
] satisfies CatalogCategory[];

// Product Card Component - Fully Clickable
function ProductCard({ family }: { family: ProductFamily }) {
  const firstVariant = family.variants?.[0];
  const variantCount = family.variants?.length || 0;
  const startingPrice = getStartingPrice(family);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      {/* Entire card is a clickable link */}
      <Link href={`/products/${family.slug}`} className="block">
        {/* Image */}
        <div className="relative h-52 sm:h-56 md:h-60 bg-gray-100 overflow-hidden">
          <ProductImage
            src={family.image_url}
            alt={family.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-700"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {/* Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1.5 text-xs font-semibold text-white rounded-xl shadow-lg" style={{ background: colors.gradient }}>
              {variantCount} sizes
            </span>
          </div>
          {/* Material Badge */}
          {family.material && (
            <div className="absolute bottom-3 left-3">
              <span className="px-3 py-1.5 text-xs font-medium bg-white/95 backdrop-blur-sm rounded-xl text-gray-700 shadow-md">
                {family.material}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-[48px] group-hover:text-[#C10008] transition">
            {family.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 min-h-[40px]">
            {family.description || 'Quality electrical component'}
          </p>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {startingPrice > 0 ? (
                <span className="text-xl font-bold" style={{ color: colors.primary }}>
                  ₦{startingPrice.toLocaleString()}
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-500">Request Quote</span>
              )}
            </div>
            <div 
              className="p-2.5 rounded-xl transition-all duration-200 group-hover:scale-110"
              style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
            >
              <ChevronRight size={18} />
            </div>
          </div>
          
          {/* Part Number */}
          {firstVariant && (
            <div className="mt-1.5">
              <span className="text-[11px] text-gray-400 font-mono">{firstVariant.part_number}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// Category Section Component
function CategorySection({ 
  category, 
  products,
  searchTerm
}: { 
  category: CatalogCategory; 
  products: ProductFamily[];
  searchTerm: string;
}) {
  const IconComponent = category.icon;
  
  let categoryProducts = products;
  
  // Filter by search term
  if (searchTerm) {
    categoryProducts = categoryProducts.filter((family) => familyMatchesSearch(family, searchTerm));
  }
  
  const firstSubcategory = category.subcategories[0] || categoryProducts[0]?.category;
  
  if (categoryProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-10 border-b border-gray-100 last:border-0">
      <div>
        {/* Category Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${category.color}15` }}
            >
              <IconComponent size={24} style={{ color: category.color }} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {category.name}
              </h2>
              <p className="text-sm text-gray-500">
                {categoryProducts.length} products
              </p>
            </div>
          </div>
          {firstSubcategory && (
            <Link
              href={`/products/category/${firstSubcategory.slug}`}
              className="flex items-center gap-1.5 text-sm font-medium hover:underline transition"
              style={{ color: category.color }}
            >
              View All
              <ChevronRight size={16} />
            </Link>
          )}
        </div>

        {/* Products Grid - 4 columns for larger cards */}
        <div className="grid grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {categoryProducts.map((family) => (
            <ProductCard key={family.id} family={family} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProductFamilies()
      .then(families => {
        setProductFamilies(families);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setProductFamilies([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const { groupedProducts, catalogCategories } = useMemo(() => {
    const grouped: Record<string, ProductFamily[]> = {};
    const categories: CatalogCategory[] = [...MAIN_CATEGORIES];
    const knownSlugToCategory = new Map<string, string>();

    MAIN_CATEGORIES.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        knownSlugToCategory.set(subcategory.slug, category.id);
      });
    });

    productFamilies.forEach((family) => {
      const categorySlug = family.category?.slug;
      const knownCategoryId = categorySlug ? knownSlugToCategory.get(categorySlug) : undefined;
      const groupId = knownCategoryId || `category-${categorySlug || family.category?.main_category || family.category?.name || family.material || 'other'}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (!grouped[groupId]) {
        grouped[groupId] = [];
      }
      grouped[groupId].push(family);

      if (!knownCategoryId && !categories.some((category) => category.id === groupId)) {
        categories.push({
          id: groupId,
          name: formatCategoryName(family.category?.main_category || family.category?.name || family.material),
          icon: Package,
          color: '#334155',
          subcategories: categorySlug
            ? [{ name: family.category?.name || family.name, slug: categorySlug }]
            : [],
        });
      }
    });

    return { groupedProducts: grouped, catalogCategories: categories };
  }, [productFamilies]);

  const totalFamilies = productFamilies.length;
  
  // Count total products matching search
  const totalSearchResults = Object.values(groupedProducts).reduce(
    (sum, products) => {
      if (!searchTerm) return sum + products.length;
      return sum + products.filter((family) => familyMatchesSearch(family, searchTerm)).length;
    },
    0
  );

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <Header />

      {/* Hero Section - Smaller, more compact */}
      <section className="relative min-h-[50vh] md:min-h-[45vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ProductImage
            src="/images/bg.png"
            alt="Lightning Protection Products"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
            >
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                IEC EN 62305 & 62561 Certified
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
            >
              <span className="text-white">Lightning Protection &</span>
              <br />
              <span className="bg-gradient-to-r from-[#C10008] via-red-500 to-[#027FFF] bg-clip-text text-transparent">
                Electrical Products
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-3 text-sm md:text-base text-white/80 max-w-xl leading-relaxed"
            >
              Complete solutions for lightning protection, grounding systems, cable management, 
              and exothermic welding. Trusted by 500+ corporate clients across Africa.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-4 mt-6"
            >
              <Link
                href="#products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm shadow-2xl transition-all duration-300 hover:scale-105"
                style={{ background: colors.gradient }}
              >
                <ShoppingBag size={16} />
                Browse Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold text-sm hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <Headphones size={16} />
                Contact Experts
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-wrap gap-6 md:gap-10 mt-6 pt-6 border-t border-white/20"
            >
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">
                  <AnimatedCounter target={totalFamilies} />+
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wide">Product Families</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">IEC</div>
                <div className="text-xs text-white/60 uppercase tracking-wide">Certified</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-white/60 uppercase tracking-wide">Corporate Clients</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-white/60 uppercase tracking-wide">Support</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Products by Category */}
      <div id="products" className="py-6 md:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Search */}
          <div className="mb-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-2">
                <Sparkles size={14} style={{ color: colors.primary }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>
                  Our Product Range
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                Browse by{' '}
                <span className="bg-gradient-to-r from-[#C10008] to-[#027FFF] bg-clip-text text-transparent">
                  Category
                </span>
              </h2>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                Search by product name, material, category, size, or part number.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full max-w-4xl mx-auto mt-6">
              <div className="relative">
                <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products by name or part number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-16 md:h-20 pl-14 md:pl-16 pr-14 rounded-2xl border border-gray-200 bg-white text-base md:text-lg focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-[#C10008] transition shadow-lg"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Clear product search"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              {/* Search Results Count */}
              {searchTerm && (
                <div className="mt-3 text-center text-sm text-gray-500">
                  Found {totalSearchResults} product{totalSearchResults !== 1 ? 's' : ''}
                </div>
              )}
            </div>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              {Object.keys(groupedProducts).length === 0 || (searchTerm && totalSearchResults === 0) ? (
                <div className="text-center py-16">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
                </div>
              ) : (
                catalogCategories.map((category) => {
                  const products = groupedProducts[category.id] || [];
                  if (products.length === 0) return null;
                  
                  if (searchTerm) {
                    const hasMatch = products.some((family) => familyMatchesSearch(family, searchTerm));
                    if (!hasMatch) return null;
                  }
                  
                  return (
                    <CategorySection 
                      key={category.id}
                      category={category}
                      products={products}
                      searchTerm={searchTerm}
                    />
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 mb-3">
              <Award size={14} style={{ color: colors.primary }} />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Why Choose Us</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Trusted by Industry Leaders</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Shield size={24} style={{ color: colors.primary }} />
              </div>
              <h4 className="font-bold text-gray-800">IEC Certified</h4>
              <p className="text-xs text-gray-500">EN 62305 & 62561</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Truck size={24} style={{ color: colors.secondary }} />
              </div>
              <h4 className="font-bold text-gray-800">Fast Delivery</h4>
              <p className="text-xs text-gray-500">Across Africa</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Headphones size={24} style={{ color: colors.primary }} />
              </div>
              <h4 className="font-bold text-gray-800">24/7 Support</h4>
              <p className="text-xs text-gray-500">Technical assistance</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Award size={24} style={{ color: colors.secondary }} />
              </div>
              <h4 className="font-bold text-gray-800">2 Year Warranty</h4>
              <p className="text-xs text-gray-500">On all products</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ background: colors.gradient }}>
          <div className="relative p-8 md:p-10 text-center text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-3">Need help finding the right product?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
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
