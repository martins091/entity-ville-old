// app/products/category/[category]/page.tsx (Complete with Pagination)

"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/use-cart';
import { fetchProductFamiliesByCategory, type ProductFamily, type ProductVariant } from '@/lib/supabase/catalog';
import ProductImage from '@/components/product-image';
import { 
  ShoppingBag, 
  ArrowRight, 
  Search,
  X, 
  Sparkles, 
  Zap, 
  Shield, 
  ChevronLeft,
  Package,
  Ruler,
  Weight,
  Hash,
  ChevronDown,
  Eye,
  CheckCircle,
  TrendingUp,
  Truck,
  Clock,
  Award,
  Filter,
  SlidersHorizontal,
  DollarSign,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight
} from 'lucide-react';

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
  gradientReverse: "linear-gradient(135deg, #027FFF 0%, #C10008 100%)",
};

// Category title mapping (keep your existing CATEGORY_TITLES here)
const CATEGORY_TITLES: Record<string, { title: string; description: string }> = {
  'earthing-conductors': {
    title: 'Earthing Conductors',
    description: 'Complete range of copper, CCA, tape, and flexible conductors for reliable earthing systems.'
  },
  'isolated-down-systems': {
    title: 'Isolated Down Systems',
    description: 'Isolated lightning down conductors and connection components.'
  },
  'conductor-connection-elements': {
    title: 'Conductor Connection Elements',
    description: 'Cable lugs, connection tubes, and clamps for secure conductor connections.'
  },
  'equipotential-earth-bars': {
    title: 'Equipotential Earth Bars',
    description: 'Earth bars for equipotential bonding and grounding systems.'
  },
  'earthing-electrodes': {
    title: 'Earthing Electrodes',
    description: 'High-quality earthing electrodes for reliable ground connections.'
  },
  'earthing-rod-elements': {
    title: 'Earthing Rod Elements',
    description: 'Extension rods for earthing systems.'
  },
  'earthing-rod-clamps': {
    title: 'Earthing Rod Clamps',
    description: 'Clamps for secure earthing rod connections.'
  },
  'inspection-pits': {
    title: 'Inspection Pits',
    description: 'Durable inspection pits for grounding system access.'
  },
  'earth-points': {
    title: 'Earth Points',
    description: 'Earth connection points for various applications.'
  },
  'electrical-safety-equipments': {
    title: 'Electrical Safety Equipments',
    description: 'Safety equipment for electrical installations.'
  },
  'electrical-insulation-materials': {
    title: 'Electrical Insulation Materials',
    description: 'Insulation materials for electrical safety.'
  },
  'ground-enhancement-material': {
    title: 'Ground Enhancement Material',
    description: 'Materials to improve ground conductivity.'
  },
  'ese-active-lightning-rods': {
    title: 'E.S.E Active Lightning Rods',
    description: 'Early Streamer Emission lightning protection systems.'
  },
  'lightning-strike-counters': {
    title: 'Lightning Strike Counters',
    description: 'Counters to track lightning strikes on protection systems.'
  },
  'galvanized-steel-poles': {
    title: 'Galvanized Steel Poles',
    description: 'Heavy-duty galvanized steel poles for lightning protection installations.'
  },
  'pole-adapters': {
    title: 'Pole Adapters',
    description: 'Adapters for lightning protection poles.'
  },
  'pole-clamps': {
    title: 'Pole Clamps',
    description: 'Clamps for securing poles in lightning protection systems.'
  },
  'pole-bases': {
    title: 'Pole Bases',
    description: 'Base plates and foundations for poles.'
  },
  'test-clamps': {
    title: 'Test Clamps',
    description: 'Clamps for testing grounding systems.'
  },
  'pole-stretch-components': {
    title: 'Pole Stretch Components',
    description: 'Components for pole extension systems.'
  },
  'fixing-clamps': {
    title: 'Fixing Clamps',
    description: 'Clamps for fixing conductors and components.'
  },
  'air-terminals': {
    title: 'Air Terminals',
    description: 'Lightning air terminals for capture systems.'
  },
  'fixing-bases': {
    title: 'Fixing Bases',
    description: 'Bases for fixing lightning protection components.'
  },
  'exothermic-welding-systems': {
    title: 'Exothermic Welding Systems',
    description: 'Complete exothermic welding solutions for grounding connections.'
  },
  'exothermic-technical-info': {
    title: 'Technical Information',
    description: 'Technical information for exothermic welding systems.'
  },
  'product-selection-charts': {
    title: 'Product Selection Charts',
    description: 'Selection charts for exothermic welding products.'
  },
  'exothermic-grounding-systems': {
    title: 'Grounding Systems',
    description: 'Grounding systems for exothermic welding applications.'
  },
  'aircraft-warning-systems': {
    title: 'Aircraft Warning Systems',
    description: 'Aviation obstruction lighting and warning systems.'
  },
  'aircraft-technical-info': {
    title: 'Technical Information',
    description: 'Technical information for aircraft warning systems.'
  },
};

// Quick View Modal Component
function QuickViewModal({ family, isOpen, onClose, onAddToCart }: { family: ProductFamily; isOpen: boolean; onClose: () => void; onAddToCart: (variant: ProductVariant) => void; }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  
  useEffect(() => {
    if (family.variants?.[0]) {
      setSelectedVariant(family.variants[0]);
    }
  }, [family]);
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition"><X size={20} className="text-gray-600" /></button>
        
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-80 md:h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <ProductImage src={family.image_url} alt={family.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4"><span className="px-2.5 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-semibold text-gray-700">{family.material}</span></div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[80vh]">
            <div className="mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600">{family.category?.name || 'Premium Product'}</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{family.name}</h2>
              <p className="text-gray-600 text-sm mt-2">{family.description}</p>
            </div>
            
            {family.variants && family.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {family.variants.map((variant) => (
                    <button key={variant.id} onClick={() => setSelectedVariant(variant)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedVariant?.id === variant.id ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={selectedVariant?.id === variant.id ? { background: colors.gradient } : {}}>
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedVariant && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Part Number</span><p className="font-mono font-semibold text-gray-900">{selectedVariant.part_number}</p></div>
                  <div><span className="text-gray-500">Weight</span><p className="font-semibold text-gray-900">{selectedVariant.weight}</p></div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Price</span>
                    <span className="text-2xl font-bold" style={{ color: colors.primary }}>{selectedVariant.price > 0 ? `₦${selectedVariant.price.toLocaleString()}` : 'Request Quote'}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              {selectedVariant && selectedVariant.price > 0 ? (
                <button onClick={() => { onAddToCart(selectedVariant); onClose(); }} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg" style={{ background: colors.gradient }}>
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              ) : (
                <Link href="/contact" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-center" style={{ background: colors.gradient }}>
                  Request Quote <ArrowRight size={16} />
                </Link>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><Shield size={12} style={{ color: colors.secondary }} /><span>IEC EN 62305 Certified</span></div>
                <div className="flex items-center gap-1"><Truck size={12} style={{ color: colors.primary }} /><span>Fast Delivery</span></div>
                <div className="flex items-center gap-1"><Award size={12} style={{ color: colors.secondary }} /><span>2 Year Warranty</span></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Premium Product Card Component
function ProductCard({ family, onQuickView, onAddToCart }: { family: ProductFamily; onQuickView: () => void; onAddToCart: (variant: ProductVariant) => void; }) {
  const [isHovered, setIsHovered] = useState(false);
  const firstVariant = family.variants?.[0];
  const variantCount = family.variants?.length || 0;
  const startingPrice = firstVariant?.price || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500" style={{ background: colors.gradient }} />
      
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <ProductImage src={family.image_url} alt={family.name} fill className="object-cover scale-100 group-hover:scale-110 transition duration-700 ease-out" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
          <button onClick={onQuickView} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 shadow-xl"><Eye size={20} style={{ color: colors.primary }} /></button>
          <div className="absolute top-4 left-4 flex gap-2"><span className="px-3 py-1 text-white text-xs font-bold rounded-lg shadow-lg" style={{ background: colors.gradient }}>{variantCount} SIZES</span></div>
          {startingPrice > 0 && (<div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"><span className="text-xs text-gray-500">Starting from</span><span className="text-xl font-bold block" style={{ color: colors.primary }}>₦{startingPrice.toLocaleString()}</span></div>)}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"><div className="flex justify-around text-white text-xs"><div className="text-center"><div className="font-bold">{variantCount}</div><div>Sizes</div></div><div className="text-center"><div className="font-bold">{family.material || 'Copper'}</div><div>Material</div></div><div className="text-center"><div className="font-bold">IEC</div><div>Certified</div></div></div></div>
        </div>
        
        <div className="p-5">
          <div className="flex items-center justify-between mb-2"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{family.category?.name || 'Premium'}</span><div className="flex items-center gap-1"><TrendingUp size={12} style={{ color: colors.secondary }} /><span className="text-xs text-gray-500">Best Seller</span></div></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{family.name}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{family.description}</p>
          <div className="flex items-center gap-4 mb-4 pt-2 border-t border-gray-100"><div className="flex items-center gap-1.5"><Zap size={12} style={{ color: colors.primary }} /><span className="text-xs text-gray-500">Premium</span></div><div className="flex items-center gap-1.5"><Shield size={12} style={{ color: colors.secondary }} /><span className="text-xs text-gray-500">Certified</span></div><div className="flex items-center gap-1.5"><Package size={12} className="text-gray-400" /><span className="text-xs text-gray-500">{variantCount} sizes</span></div></div>
          <div className="flex gap-3"><button onClick={onQuickView} className="flex-1 text-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105" style={{ color: colors.secondary, backgroundColor: `${colors.secondary}10` }}>Quick View</button>{firstVariant && firstVariant.price > 0 ? (<button onClick={() => onAddToCart(firstVariant)} className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md" style={{ background: colors.gradient }}><ShoppingBag size={16} /></button>) : (<Link href="/contact" className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md inline-flex items-center justify-center" style={{ background: colors.gradient }}>Quote</Link>)}</div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100"><div className="h-full transition-all duration-500" style={{ width: isHovered ? '100%' : '0%', background: colors.gradient }} /></div>
      </div>
    </motion.div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-gray-100">
      <div className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 transition"
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 transition"
        >
          <ChevronLeft size={18} />
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[40px] h-10 rounded-lg font-medium transition-all duration-200 ${
              currentPage === page
                ? 'text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={currentPage === page ? { background: colors.gradient } : {}}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 transition"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 transition"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
      
      <select
        value={12}
        onChange={(e) => {
          // You can add items per page functionality here
        }}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#C10008]"
      >
        <option value={12}>12 per page</option>
        <option value={24}>24 per page</option>
        <option value={48}>48 per page</option>
      </select>
    </div>
  );
}

// Filter Sidebar Component
function FilterSidebar({ 
  materials, 
  selectedMaterials, 
  onMaterialChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalResults
}: { 
  materials: string[];
  selectedMaterials: string[];
  onMaterialChange: (material: string) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onResetFilters: () => void;
  totalResults: number;
}) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="pb-3 border-b border-gray-100">
        <p className="text-sm text-gray-600"><span className="font-bold text-gray-900">{totalResults}</span> products found</p>
      </div>
      
      {/* Sort Options */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><TrendingUp size={16} style={{ color: colors.primary }} /> Sort By</h3>
        <div className="space-y-2">
          {[
            { value: 'name_asc', label: 'Name A-Z' },
            { value: 'name_desc', label: 'Name Z-A' },
            { value: 'price_asc', label: 'Price: Low to High' },
            { value: 'price_desc', label: 'Price: High to Low' },
            { value: 'variants_desc', label: 'Most Sizes' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sort" value={option.value} checked={sortBy === option.value} onChange={() => onSortChange(option.value)} className="w-4 h-4" style={{ accentColor: colors.primary }} />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Material Filter */}
      {materials.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Shield size={16} style={{ color: colors.secondary }} /> Material</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {materials.map((material) => (
              <label key={material} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedMaterials.includes(material)} onChange={() => onMaterialChange(material)} className="w-4 h-4 rounded" style={{ accentColor: colors.primary }} />
                <span className="text-sm text-gray-700">{material}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      {/* Price Range Filter */}
      <div className="border-t border-gray-100 pt-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><DollarSign size={16} style={{ color: colors.primary }} /> Price Range (₦)</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={priceRange.min || ''} onChange={(e) => onPriceRangeChange({ ...priceRange, min: parseInt(e.target.value) || 0 })} className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-red-400" />
          <input type="number" placeholder="Max" value={priceRange.max || ''} onChange={(e) => onPriceRangeChange({ ...priceRange, max: parseInt(e.target.value) || 0 })} className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-red-400" />
        </div>
      </div>
      
      {/* Reset Button */}
      <button onClick={onResetFilters} className="w-full py-2 rounded-xl text-sm font-semibold transition border border-gray-200 hover:bg-gray-50" style={{ color: colors.primary }}>Reset All Filters</button>
    </div>
  );
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <FilterContent />
        </div>
      </aside>
      
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold"><SlidersHorizontal size={16} /> Filters & Sort</button>
      </div>
      
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setIsMobileFilterOpen(false)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 overflow-y-auto h-full">
                <div className="flex justify-between items-center mb-5"><h2 className="text-xl font-bold">Filters</h2><button onClick={() => setIsMobileFilterOpen(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button></div>
                <FilterContent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function CategoryDetailPage() {
  const params = useParams();
  const category = params?.category as string;
  const decodedCategory = decodeURIComponent(category || '');
  const { addItem } = useCart();
  
  const [productFamilies, setProductFamilies] = useState<ProductFamily[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewFamily, setQuickViewFamily] = useState<ProductFamily | null>(null);
  
  // Filter states
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [sortBy, setSortBy] = useState<string>('name_asc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const categoryInfo = CATEGORY_TITLES[decodedCategory] || {
    title: decodedCategory?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Products',
    description: 'Browse our complete range of products.'
  };

  useEffect(() => {
    if (!decodedCategory) return;
    fetchProductFamiliesByCategory(decodedCategory).then(families => { setProductFamilies(families); }).catch(error => { console.error('Error fetching category products:', error); setProductFamilies([]); }).finally(() => setIsLoading(false));
  }, [decodedCategory]);

  // Extract unique materials from product families
  const availableMaterials = useMemo(() => {
    const materials = new Set<string>();
    productFamilies.forEach(family => { if (family.material) materials.add(family.material); });
    return Array.from(materials).sort();
  }, [productFamilies]);

  // Filter and sort families
  const filteredFamilies = useMemo(() => {
    let results = productFamilies.filter(family => {
      const matchesSearch = !searchTerm || family.name.toLowerCase().includes(searchTerm.toLowerCase()) || family.variants?.some(v => v.part_number.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(family.material);
      const familyPrice = family.variants?.length ? Math.min(...family.variants.map(v => v.price).filter(p => p > 0)) : 0;
      const matchesPrice = (!priceRange.min || familyPrice >= priceRange.min) && (!priceRange.max || familyPrice <= priceRange.max);
      return matchesSearch && matchesMaterial && matchesPrice;
    });
    
    // Apply sorting
    results.sort((a, b) => {
      const aPrice = a.variants?.length ? Math.min(...a.variants.map(v => v.price).filter(p => p > 0)) : 0;
      const bPrice = b.variants?.length ? Math.min(...b.variants.map(v => v.price).filter(p => p > 0)) : 0;
      const aVariantCount = a.variants?.length || 0;
      const bVariantCount = b.variants?.length || 0;
      
      switch (sortBy) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'price_asc': return aPrice - bPrice;
        case 'price_desc': return bPrice - aPrice;
        case 'variants_desc': return bVariantCount - aVariantCount;
        default: return 0;
      }
    });
    
    return results;
  }, [productFamilies, searchTerm, selectedMaterials, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredFamilies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFamilies = filteredFamilies.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMaterials, priceRange, sortBy]);

  const totalVariants = productFamilies.reduce((sum, f) => sum + (f.variants?.length || 0), 0);
  const hasActiveFilters = searchTerm || selectedMaterials.length > 0 || priceRange.min > 0 || priceRange.max > 0 || sortBy !== 'name_asc';

  const handleAddToCart = (variant: ProductVariant) => {
    const family = productFamilies.find(f => f.variants?.some(v => v.id === variant.id));
    addItem({ id: variant.id, name: `${family?.name || 'Product'} ${variant.size}`, price: variant.price, image: family?.image_url || '', slug: family?.slug || '' });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedMaterials([]);
    setPriceRange({ min: 0, max: 0 });
    setSortBy('name_asc');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!decodedCategory) {
    return (<main className="bg-white min-h-screen"><Header /><div className="flex justify-center items-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" /></div><Footer /></main>);
  }

  return (
    <main className="bg-white min-h-screen">
      <Header />

      <AnimatePresence>{quickViewFamily && (<QuickViewModal family={quickViewFamily} isOpen={!!quickViewFamily} onClose={() => setQuickViewFamily(null)} onAddToCart={handleAddToCart} />)}</AnimatePresence>

      {/* Category Hero */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="absolute inset-0 overflow-hidden"><div className="absolute -top-40 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse" style={{ backgroundColor: colors.primary }} /><div className="absolute top-40 -left-20 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" style={{ backgroundColor: colors.secondary }} /></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm mb-6"><Link href="/" className="text-gray-500 hover:text-gray-700 transition">Home</Link><ChevronLeft size={12} className="text-gray-400 rotate-180" /><Link href="/products" className="text-gray-500 hover:text-gray-700 transition">Products</Link><ChevronLeft size={12} className="text-gray-400 rotate-180" /><span className="font-semibold" style={{ color: colors.primary }}>{categoryInfo.title}</span></div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-50 to-blue-50 mb-4"><Sparkles size={14} style={{ color: colors.primary }} /><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.secondary }}>Technical Catalog</span></div><h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">{categoryInfo.title}</h1><p className="mt-4 text-lg text-gray-600 max-w-2xl leading-relaxed">{categoryInfo.description}</p><div className="flex flex-wrap items-center gap-4 mt-4"><div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100"><Package size={14} className="text-gray-500" /><span className="text-sm font-medium text-gray-700">{productFamilies.length} Product Families</span></div><div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100"><Hash size={14} className="text-gray-500" /><span className="text-sm font-medium text-gray-700">{totalVariants} Variants Available</span></div><div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100"><CheckCircle size={14} className="text-green-600" /><span className="text-sm font-medium text-gray-700">IEC Certified</span></div></div></div>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-lg" style={{ background: colors.gradient }}><ShoppingBag size={16} /> Request Bulk Quote <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* Products Section with Filters and Pagination */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by product name or part number (e.g., HEC 20003)..." className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition" />
            {searchTerm && (<button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"><X size={16} /></button>)}
          </div>
        </div>

        {/* Main Content with Filters Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar 
            materials={availableMaterials}
            selectedMaterials={selectedMaterials}
            onMaterialChange={(material) => setSelectedMaterials(prev => prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material])}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={resetFilters}
            totalResults={filteredFamilies.length}
          />
          
          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-32"><div className="relative"><div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" /><div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 bg-red-600 rounded-full animate-ping opacity-75" /></div></div></div>
            ) : paginatedFamilies.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-8">
                  {paginatedFamilies.map((family) => (<ProductCard key={family.id} family={family} onQuickView={() => setQuickViewFamily(family)} onAddToCart={handleAddToCart} />))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl"><Package size={64} className="mx-auto text-gray-300 mb-4" /><h3 className="text-xl font-semibold text-gray-700">No products found</h3><p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p><button onClick={resetFilters} className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition hover:scale-105" style={{ background: colors.gradient }}>Reset All Filters</button></div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-gray-50 py-12 mt-8"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="grid grid-cols-2 md:grid-cols-4 gap-6"><div className="text-center"><div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3"><Shield size={20} style={{ color: colors.primary }} /></div><h4 className="font-semibold text-gray-800">IEC Certified</h4><p className="text-xs text-gray-500 mt-1">EN 62305 & 62561</p></div><div className="text-center"><div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3"><Truck size={20} style={{ color: colors.secondary }} /></div><h4 className="font-semibold text-gray-800">Fast Delivery</h4><p className="text-xs text-gray-500 mt-1">Across Africa</p></div><div className="text-center"><div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3"><Clock size={20} style={{ color: colors.primary }} /></div><h4 className="font-semibold text-gray-800">24/7 Support</h4><p className="text-xs text-gray-500 mt-1">Technical assistance</p></div><div className="text-center"><div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-3"><Award size={20} style={{ color: colors.secondary }} /></div><h4 className="font-semibold text-gray-800">2 Year Warranty</h4><p className="text-xs text-gray-500 mt-1">On all products</p></div></div></div></div>

      <Footer />
    </main>
  );
}
