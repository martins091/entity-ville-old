"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import AdminFrame from "@/app/admin/AdminFrame";
import { requireAdminSession } from "@/lib/supabase/admin";
import { uploadAdminImage } from "@/lib/supabase/storage";

const colors = {
  primary: "#C10008",
  secondary: "#027FFF",
  gradient: "linear-gradient(135deg, #C10008 0%, #027FFF 100%)",
};

type Category = { id: string; name: string; slug: string; main_category: string };
type Variant = { id?: string; part_number: string; size: string; weight: string; price: number; stock_quantity: number };
type ProductFamilyFormState = {
  id?: string;
  slug: string;
  name: string;
  category_id: string;
  description: string;
  material: string;
  standard: string;
  image_url: string;
  is_featured: boolean;
  variants: Variant[];
};

const emptyVariant: Variant = { part_number: "", size: "", weight: "", price: 0, stock_quantity: 100 };

const emptyForm: ProductFamilyFormState = {
  slug: "",
  name: "",
  category_id: "",
  description: "",
  material: "Copper",
  standard: "IEC EN 62305",
  image_url: "",
  is_featured: false,
  variants: [{ ...emptyVariant }],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductFamilyForm({ familyId }: { familyId?: string }) {
  const router = useRouter();
  const isEditing = Boolean(familyId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFamilyFormState>(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function updateForm<K extends keyof ProductFamilyFormState>(key: K, value: ProductFamilyFormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      slug: key === "name" && !current.id ? slugify(String(value)) : current.slug,
    }));
  }

  function updateVariant(index: number, field: keyof Variant, value: string | number) {
    setForm((current) => {
      const variants = [...current.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...current, variants };
    });
  }

  function addVariant() {
    setForm((current) => ({ ...current, variants: [...current.variants, { ...emptyVariant }] }));
  }

  function removeVariant(index: number) {
    setForm((current) => ({ ...current, variants: current.variants.filter((_, itemIndex) => itemIndex !== index) }));
  }

  async function loadFormData() {
    const { supabase, isAdmin } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push("/admin/login");
      return;
    }

    const { data: categoryData } = await supabase
      .from("categories")
      .select("id, name, slug, main_category")
      .order("display_order");
    setCategories(categoryData || []);

    if (!familyId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("product_families")
      .select("*, variants:product_variants(*)")
      .eq("id", familyId)
      .single();

    if (error || !data) {
      setMessage({ type: "error", text: error?.message || "Product family not found." });
      setLoading(false);
      return;
    }

    setForm({
      id: data.id,
      slug: data.slug || "",
      name: data.name || "",
      category_id: data.category_id || "",
      description: data.description || "",
      material: data.material || "Copper",
      standard: data.standard || "IEC EN 62305",
      image_url: data.image_url || "",
      is_featured: Boolean(data.is_featured),
      variants: data.variants?.length ? data.variants : [{ ...emptyVariant }],
    });
    setLoading(false);
  }

  async function handleImageUpload(file: File | null) {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const url = await uploadAdminImage({
        file,
        bucket: "products",
        folder: form.slug || slugify(form.name) || "products",
      });
      updateForm("image_url", url);
      setMessage({ type: "success", text: "Image uploaded. Save the product to keep this image." });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Image upload failed." });
    } finally {
      setUploading(false);
    }
  }

  async function saveProductFamily(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const { supabase, isAdmin } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push("/admin/login");
      return;
    }

    const familyPayload = {
      slug: form.slug || slugify(form.name),
      name: form.name.trim(),
      category_id: form.category_id,
      description: form.description.trim(),
      material: form.material.trim(),
      standard: form.standard.trim(),
      image_url: form.image_url || null,
      is_featured: form.is_featured,
      updated_at: new Date().toISOString(),
    };

    let savedFamilyId = form.id;

    if (form.id) {
      const { error } = await supabase.from("product_families").update(familyPayload).eq("id", form.id);
      if (error) {
        setMessage({ type: "error", text: error.message });
        setSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase.from("product_families").insert(familyPayload).select("id").single();
      if (error || !data) {
        setMessage({ type: "error", text: error?.message || "Failed to create product family." });
        setSaving(false);
        return;
      }
      savedFamilyId = data.id;
    }

    if (savedFamilyId) {
      await supabase.from("product_variants").delete().eq("family_id", savedFamilyId);
      const variants = form.variants
        .filter((variant) => variant.part_number.trim())
        .map((variant) => ({
          family_id: savedFamilyId,
          part_number: variant.part_number.trim(),
          size: variant.size.trim(),
          weight: variant.weight.trim(),
          price: Number(variant.price || 0),
          stock_quantity: Number(variant.stock_quantity || 100),
        }));

      if (variants.length) {
        const { error } = await supabase.from("product_variants").insert(variants);
        if (error) {
          setMessage({ type: "error", text: `Product saved, but variants failed: ${error.message}` });
          setSaving(false);
          return;
        }
      }
    }

    setMessage({ type: "success", text: isEditing ? "Product family updated." : "Product family created." });
    router.push("/admin/products");
    router.refresh();
  }

  useEffect(() => {
    loadFormData();
  }, [familyId]);

  return (
    <AdminFrame>
      <div className="mb-8">
        <Link href="/admin/products" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} />
          Back to products
        </Link>
        <div className="mb-2 flex items-center gap-3">
          <div className="h-8 w-1 rounded-full" style={{ background: colors.gradient }} />
          <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: colors.primary }}>
            {isEditing ? "Edit Product" : "Add Product"}
          </p>
        </div>
        <h1 className="text-3xl font-black text-gray-900 md:text-4xl">
          {isEditing ? "Edit Product Family" : "Create Product Family"}
        </h1>
        <p className="mt-2 text-gray-500">Upload the image from your system, then manage product variants below.</p>
      </div>

      {message && (
        <div className={`mb-6 rounded-xl border p-4 text-sm ${
          message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
          Loading product form...
        </div>
      ) : (
        <form onSubmit={saveProductFamily} className="grid gap-6 xl:grid-cols-[1fr,360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Product Information</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Family Name *</span>
                  <input value={form.name} onChange={(event) => updateForm("name", event.target.value)} required className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Slug *</span>
                  <input value={form.slug} onChange={(event) => updateForm("slug", slugify(event.target.value))} required className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Category *</span>
                  <select value={form.category_id} onChange={(event) => updateForm("category_id", event.target.value)} required className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100">
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.main_category} / {category.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Material</span>
                  <input value={form.material} onChange={(event) => updateForm("material", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Standard</span>
                  <input value={form.standard} onChange={(event) => updateForm("standard", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-1 block text-sm font-semibold text-gray-700">Description *</span>
                  <textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} required rows={5} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Variants</h2>
                  <p className="text-sm text-gray-500">Add part numbers, sizes, weights, stock, and prices.</p>
                </div>
                <button type="button" onClick={addVariant} className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-white hover:bg-emerald-600">
                  <Plus size={16} />
                  Add Variant
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {form.variants.map((variant, index) => (
                  <div key={index} className="rounded-xl border border-gray-200 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Variant #{index + 1}</span>
                      {form.variants.length > 1 && (
                        <button type="button" onClick={() => removeVariant(index)} className="text-gray-400 hover:text-red-600">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid gap-2 md:grid-cols-5">
                      <input value={variant.part_number} onChange={(event) => updateVariant(index, "part_number", event.target.value)} placeholder="Part number" className="h-10 rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-red-400" />
                      <input value={variant.size} onChange={(event) => updateVariant(index, "size", event.target.value)} placeholder="Size" className="h-10 rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-red-400" />
                      <input value={variant.weight} onChange={(event) => updateVariant(index, "weight", event.target.value)} placeholder="Weight" className="h-10 rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-red-400" />
                      <input type="number" value={variant.price || ""} onChange={(event) => updateVariant(index, "price", Number(event.target.value || 0))} placeholder="Price" className="h-10 rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-red-400" />
                      <input type="number" value={variant.stock_quantity || ""} onChange={(event) => updateVariant(index, "stock_quantity", Number(event.target.value || 0))} placeholder="Stock" className="h-10 rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-red-400" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:sticky xl:top-8">
              <h2 className="text-lg font-bold text-gray-900">Image & Status</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                {form.image_url ? (
                  <img src={form.image_url} alt={form.name || "Product image"} className="h-56 w-full object-cover" />
                ) : (
                  <div className="flex h-56 flex-col items-center justify-center text-gray-400">
                    <ImagePlus size={40} />
                    <span className="mt-2 text-sm">No product image yet</span>
                  </div>
                )}
              </div>

              <label className="mt-4 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 transition hover:bg-gray-50">
                <ImagePlus size={17} />
                {uploading ? "Uploading..." : "Upload image from system"}
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(event) => handleImageUpload(event.target.files?.[0] || null)} />
              </label>

              <label className="mt-4 block">
                <span className="mb-1 block text-sm font-semibold text-gray-700">Saved image URL</span>
                <input value={form.image_url} onChange={(event) => updateForm("image_url", event.target.value)} placeholder="Upload an image or paste a URL" className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-red-400" />
              </label>

              <div className="mt-4 space-y-3">
                <label className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                  <span className="text-sm font-semibold text-gray-700">Featured on homepage</span>
                  <input type="checkbox" checked={form.is_featured} onChange={(event) => updateForm("is_featured", event.target.checked)} className="h-5 w-5 accent-red-600" />
                </label>
              </div>

              <div className="mt-6 flex gap-3">
                <button type="submit" disabled={saving || uploading} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-md disabled:opacity-60" style={{ background: colors.gradient }}>
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Product"}
                </button>
                <Link href="/admin/products" className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </Link>
              </div>

              {isEditing && (
                <button type="button" onClick={() => router.push("/admin/products")} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100">
                  <Trash2 size={16} />
                  Close editor
                </button>
              )}
            </section>
          </aside>
        </form>
      )}
    </AdminFrame>
  );
}
