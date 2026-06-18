"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Package,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { type ProductFamily } from "@/lib/supabase/catalog";
import ProductImage from "@/components/product-image";

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
};

const CATEGORY_LABELS: Record<string, string> = {
  "cable-management": "Cable Management Systems",
  "grounding-systems": "Grounding Systems",
  "external-lightning-protection": "External Lightning Protection",
  "exothermic-welding": "Exothermic Welding Systems",
  "aircraft-warning": "Aircraft Warning Systems",
};

function formatCategoryName(value?: string | null) {
  if (!value) return "Other Products";
  const normalized = value.trim();
  const mapped = CATEGORY_LABELS[normalized.toLowerCase()];
  if (mapped) return mapped;
  if (normalized === normalized.toUpperCase() && normalized.includes(" ")) return normalized;

  return normalized
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStartingPrice(family: ProductFamily) {
  const prices = family.variants?.map((variant) => Number(variant.price || 0)).filter((price) => price > 0) || [];
  return prices.length ? Math.min(...prices) : 0;
}

function matchesSearch(family: ProductFamily, searchTerm: string) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return true;

  return (
    family.name.toLowerCase().includes(term) ||
    family.description?.toLowerCase().includes(term) ||
    family.material?.toLowerCase().includes(term) ||
    family.category?.name?.toLowerCase().includes(term) ||
    family.category?.main_category?.toLowerCase().includes(term) ||
    family.variants?.some((variant) =>
      [variant.part_number, variant.size, variant.weight].some((value) => value?.toLowerCase().includes(term))
    )
  );
}

function ProductCard({ family, compact = false }: { family: ProductFamily; compact?: boolean }) {
  const startingPrice = getStartingPrice(family);
  const variantCount = family.variants?.length || 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="group h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <Link href={`/products/${family.slug}`} className="flex h-full flex-col">
        <div className={`relative bg-gray-100 ${compact ? "h-44" : "h-56"}`}>
          <ProductImage
            src={family.image_url}
            alt={family.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-bold text-white shadow" style={{ background: colors.gradient }}>
            {variantCount} sizes
          </div>
          {family.material && (
            <div className="absolute bottom-3 left-3 max-w-[80%] truncate rounded-md bg-white/95 px-2.5 py-1 text-xs font-medium text-gray-700 shadow">
              {family.material}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="truncate text-xs font-semibold uppercase tracking-wide text-gray-500">
              {family.category?.name || "Electrical"}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
              <CheckCircle size={13} />
              Stock
            </span>
          </div>

          <h3 className="min-h-[44px] text-sm font-bold leading-snug text-gray-950 line-clamp-2 transition group-hover:text-[#C10008] md:text-base">
            {family.name}
          </h3>
          <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-gray-500 line-clamp-2">
            {family.description || "Quality electrical component for professional projects."}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <span className="block text-[11px] uppercase tracking-wide text-gray-400">From</span>
              <span className="text-lg font-black" style={{ color: startingPrice > 0 ? colors.primary : "#4b5563" }}>
                {startingPrice > 0 ? `₦${startingPrice.toLocaleString()}` : "Request Quote"}
              </span>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-gray-950 text-white transition group-hover:bg-[#C10008]">
              <ChevronRight size={18} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function ProductShelf({ title, subtitle, products }: { title: string; subtitle: string; products: ProductFamily[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-gray-200 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-2xl font-black text-gray-950">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        </div>
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#C10008]">
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((family) => (
          <ProductCard key={family.id} family={family} compact />
        ))}
      </div>
    </section>
  );
}

export default function ProductsSection({ initialProductFamilies }: { initialProductFamilies: ProductFamily[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const values = new Map<string, { name: string; count: number }>();

    initialProductFamilies.forEach((family) => {
      const key = formatCategoryName(family.category?.main_category || family.category?.name);
      const current = values.get(key);
      values.set(key, { name: key, count: (current?.count || 0) + 1 });
    });

    return Array.from(values.values()).sort((a, b) => b.count - a.count);
  }, [initialProductFamilies]);

  const filteredProducts = useMemo(() => {
    return initialProductFamilies.filter((family) => {
      const category = formatCategoryName(family.category?.main_category || family.category?.name);
      const categoryMatch = activeCategory === "all" || category === activeCategory;
      return categoryMatch && matchesSearch(family, searchTerm);
    });
  }, [activeCategory, initialProductFamilies, searchTerm]);

  const featuredProducts = initialProductFamilies.slice(0, 8);
  const pricedProducts = initialProductFamilies.filter((family) => getStartingPrice(family) > 0).slice(0, 8);
  const categoryShelves = categories.slice(0, 3).map((category) => ({
    ...category,
    products: initialProductFamilies.filter((family) => formatCategoryName(family.category?.main_category || family.category?.name) === category.name),
  }));
  const totalVariants = initialProductFamilies.reduce((sum, family) => sum + (family.variants?.length || 0), 0);

  return (
    <section id="products" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
              <Sparkles size={14} style={{ color: colors.primary }} />
              <span className="text-xs font-bold uppercase tracking-wider text-[#C10008]">Shop Electrical Products</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-gray-950 md:text-5xl">
              Find the right product fast
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
              Browse cable management, grounding, lightning protection, welding systems, and professional electrical components.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="bg-white p-4 text-center">
              <div className="text-2xl font-black text-gray-950">{initialProductFamilies.length}+</div>
              <div className="text-xs uppercase tracking-wide text-gray-500">Families</div>
            </div>
            <div className="bg-white p-4 text-center">
              <div className="text-2xl font-black text-gray-950">{totalVariants}+</div>
              <div className="text-xs uppercase tracking-wide text-gray-500">Variants</div>
            </div>
            <div className="bg-white p-4 text-center">
              <div className="text-2xl font-black text-gray-950">IEC</div>
              <div className="text-xs uppercase tracking-wide text-gray-500">Quality</div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 md:p-6">
          <div className="relative">
            <Search size={26} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products, sizes, categories, or part numbers..."
              className="h-16 w-full rounded-lg border border-gray-200 bg-white pl-14 pr-14 text-base shadow-sm outline-none transition focus:border-[#C10008] focus:ring-4 focus:ring-red-100 md:h-20 md:text-lg"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                aria-label="Clear product search"
              >
                <X size={21} />
              </button>
            )}
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-bold transition ${
                activeCategory === "all" ? "text-white" : "bg-white text-gray-700 hover:text-[#C10008]"
              }`}
              style={activeCategory === "all" ? { background: colors.gradient } : undefined}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-bold transition ${
                  activeCategory === category.name ? "text-white" : "bg-white text-gray-700 hover:text-[#C10008]"
                }`}
                style={activeCategory === category.name ? { background: colors.gradient } : undefined}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {(searchTerm || activeCategory !== "all") && (
          <section className="py-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-gray-950">Search Results</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} found
                </p>
              </div>
              <Link href="/products" className="hidden items-center gap-2 text-sm font-bold text-[#C10008] sm:inline-flex">
                Open full catalog
                <ArrowRight size={16} />
              </Link>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.slice(0, 12).map((family) => (
                  <ProductCard key={family.id} family={family} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-white py-14 text-center">
                <Package size={42} className="mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-bold text-gray-800">No matching products</h3>
                <p className="mt-1 text-sm text-gray-500">Try another product name, size, or part number.</p>
              </div>
            )}
          </section>
        )}

        <section className="py-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-black text-gray-950">Featured Products</h3>
              <p className="mt-1 text-sm text-gray-600">Popular product families ready for quotes and orders.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#C10008]">
              Browse catalog
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((family) => (
              <ProductCard key={family.id} family={family} />
            ))}
          </div>
        </section>

        <section className="border-t border-gray-200 py-10">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-gray-950">Shop by Department</h3>
            <p className="mt-1 text-sm text-gray-600">Jump into the main catalog sections customers usually need first.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.name}
                href="/products"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#C10008] hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 text-[#C10008]">
                    <ShoppingBag size={22} />
                  </span>
                  <div>
                    <h4 className="font-black text-gray-950">{category.name}</h4>
                    <p className="text-sm text-gray-500">{category.count} product families</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400 transition group-hover:text-[#C10008]" />
              </Link>
            ))}
          </div>
        </section>

        <ProductShelf title="Priced Products" subtitle="Products with published starting prices." products={pricedProducts} />

        {categoryShelves.map((category) => (
          <ProductShelf
            key={category.name}
            title={category.name}
            subtitle={`${category.count} product families available in this section.`}
            products={category.products}
          />
        ))}

        <section className="border-t border-gray-200 pt-10">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-5">
              <Shield size={24} style={{ color: colors.primary }} />
              <div>
                <h4 className="font-bold text-gray-950">Certified Quality</h4>
                <p className="text-sm text-gray-500">IEC-focused product families.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-5">
              <Truck size={24} style={{ color: colors.secondary }} />
              <div>
                <h4 className="font-bold text-gray-950">Project Delivery</h4>
                <p className="text-sm text-gray-500">Supply support across Africa.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-5">
              <Zap size={24} style={{ color: colors.primary }} />
              <div>
                <h4 className="font-bold text-gray-950">Technical Help</h4>
                <p className="text-sm text-gray-500">Product matching for installations.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
