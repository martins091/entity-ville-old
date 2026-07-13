"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, ImageOff, Package, Plus, Search, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import AdminFrame from "../AdminFrame";
import { requireAdminSession } from "@/lib/supabase/admin";

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
};

type ProductFamily = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  material: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  updated_at: string | null;
  category?: { id: string; name: string; slug: string; main_category: string } | null;
  variants?: Array<{ id: string; price: number | null }>;
};

function getMinPrice(family: ProductFamily) {
  const prices = (family.variants || [])
    .map((variant) => Number(variant.price || 0))
    .filter((price) => price > 0);

  return prices.length ? Math.min(...prices) : 0;
}

// Pagination Component
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  startIndex,
  endIndex
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}) {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;
  
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  
  return (
    <div className="border-t border-gray-100 px-5 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} - {Math.min(endIndex, totalItems)} of {totalItems} product families
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
          value={itemsPerPage}
          onChange={(e) => {
            onItemsPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-red-400"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [families, setFamilies] = useState<ProductFamily[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    families.forEach((family) => {
      if (family.category?.slug) map.set(family.category.slug, family.category.name);
    });
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [families]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return families.filter((family) => {
      const matchesQuery = !q || `${family.name} ${family.slug} ${family.category?.name || ""}`.toLowerCase().includes(q);
      const matchesCategory = category === "all" || family.category?.slug === category;
      return matchesQuery && matchesCategory;
    });
  }, [families, query, category]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFamilies = filtered.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, category]);

  async function loadProductFamilies() {
    setLoading(true);
    const { supabase, isAdmin } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push("/admin/login");
      return;
    }

    const { data, error } = await supabase
      .from("product_families")
      .select("*, variants:product_variants(id, price), category:categories(id, name, slug, main_category)")
      .order("updated_at", { ascending: false });

    if (error) setMessage({ type: "error", text: error.message });
    else setFamilies(data || []);

    setLoading(false);
  }

  async function deleteProductFamily(family: ProductFamily) {
    if (!confirm(`Delete "${family.name}" and all its variants?`)) return;

    const { supabase, isAdmin } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push("/admin/login");
      return;
    }

    const { error } = await supabase.from("product_families").delete().eq("id", family.id);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setFamilies((current) => current.filter((item) => item.id !== family.id));
    setMessage({ type: "success", text: `${family.name} deleted.` });
    
    // Adjust current page if needed
    const newFilteredLength = filtered.length - 1;
    const newTotalPages = Math.ceil(newFilteredLength / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  }

  useEffect(() => {
    loadProductFamilies();
  }, []);

  return (
    <AdminFrame>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full" style={{ background: colors.gradient }} />
            <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: colors.primary }}>
              Admin Products
            </p>
          </div>
          <h1 className="text-3xl font-black text-gray-900 md:text-4xl">Product Families</h1>
          <p className="mt-2 text-gray-500">Search, edit images, manage variants, and keep the catalogue organized.</p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
          style={{ background: colors.gradient }}
        >
          <Plus size={17} />
          Add Product
        </Link>
      </div>

      {message && (
        <div className={`mb-6 rounded-xl border p-4 text-sm ${
          message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr,260px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product name, slug, or category..."
              className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
          >
            <option value="all">All categories</option>
            {categories.map(([slug, name]) => (
              <option key={slug} value={slug}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <p className="text-sm font-semibold text-gray-700">
            {loading ? "Loading products..." : `${filtered.length} of ${families.length} product families`}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
            <p className="mt-3 text-sm">Loading product families...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={48} className="text-gray-300" />
            <h2 className="mt-3 text-lg font-bold text-gray-900">No products found</h2>
            <p className="mt-1 text-sm text-gray-500">Try another search or create a new product family.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {paginatedFamilies.map((family) => {
                const minPrice = getMinPrice(family);
                return (
                  <div key={family.id} className="grid gap-4 p-5 transition hover:bg-gray-50 md:grid-cols-[80px,1fr,auto] md:items-center">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                      {family.image_url ? (
                        <img
                          src={family.image_url}
                          alt={family.name}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageOff size={24} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-gray-900">{family.name}</h2>
                        {family.is_featured && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Featured</span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{family.description || "No description yet."}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>{family.category?.name || "Uncategorized"}</span>
                        <span>{family.variants?.length || 0} variants</span>
                        <span>{minPrice > 0 ? `From ₦${minPrice.toLocaleString()}` : "Quote only"}</span>
                        {family.updated_at && <span>Updated {new Date(family.updated_at).toLocaleDateString()}</span>}
                      </div>
                    </div>

                    <div className="flex gap-2 md:justify-end">
                      <Link
                        href={`/admin/products/${family.id}/edit`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                      >
                        <Edit size={15} />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteProductFamily(family)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              totalItems={filtered.length}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          </>
        )}
      </div>
    </AdminFrame>
  );
}