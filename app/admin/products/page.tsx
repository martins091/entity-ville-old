"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImagePlus, Plus, Save, Search, Trash2 } from 'lucide-react';
import AdminFrame from '../AdminFrame';
import { requireAdminSession } from '@/lib/supabase/admin';
import { uploadAdminImage } from '@/lib/supabase/storage';

type ProductForm = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  images: string;
  features: string;
  specs: string;
  applications: string;
  active: boolean;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string | null;
  images: string[] | null;
  features: string[] | null;
  specs: string[] | null;
  applications: string[] | null;
  active: boolean;
  updated_at: string;
};

const emptyForm: ProductForm = {
  slug: '',
  name: '',
  description: '',
  category: '',
  price: '',
  image: '',
  images: '',
  features: '',
  specs: '',
  applications: '',
  active: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function linesToArray(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function rowToForm(product: ProductRow): ProductForm {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    category: product.category,
    price: String(product.price),
    image: product.image || '',
    images: (product.images || []).join('\n'),
    features: (product.features || []).join('\n'),
    specs: (product.specs || []).join('\n'),
    applications: (product.applications || []).join('\n'),
    active: product.active,
  };
}

function formToPayload(form: ProductForm) {
  const image = form.image.trim();
  const images = linesToArray(form.images);

  return {
    slug: form.slug || slugify(form.name),
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category.trim(),
    price: Number(form.price || 0),
    image: image || images[0] || null,
    images: images.length ? images : image ? [image] : [],
    features: linesToArray(form.features),
    specs: linesToArray(form.specs),
    applications: linesToArray(form.applications),
    active: form.active,
  };
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((product) =>
      `${product.name} ${product.category} ${product.slug}`.toLowerCase().includes(q)
    );
  }, [products, query]);

  async function loadProducts() {
    setLoading(true);
    setMessage(null);

    const { supabase, isAdmin, error } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push('/admin/login');
      return;
    }

    const { data, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('updated_at', { ascending: false });

    if (productsError) {
      setMessage(productsError.message || error || 'Unable to load products.');
    } else {
      setProducts((data || []) as ProductRow[]);
    }

    setLoading(false);
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const { supabase, isAdmin } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push('/admin/login');
      return;
    }

    const payload = formToPayload(form);
    const result = form.id
      ? await supabase.from('products').update(payload).eq('id', form.id)
      : await supabase.from('products').insert(payload);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage(form.id ? 'Product updated.' : 'Product created.');
      setForm(emptyForm);
      await loadProducts();
    }

    setSaving(false);
  }

  async function deleteProduct(product: ProductRow) {
    const confirmed = window.confirm(`Delete ${product.name}? This removes it from the storefront.`);
    if (!confirmed) return;

    const { supabase, isAdmin } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push('/admin/login');
      return;
    }

    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) {
      setMessage(error.message);
      return;
    }

    setProducts((current) => current.filter((entry) => entry.id !== product.id));
    if (form.id === product.id) setForm(emptyForm);
  }

  function updateForm<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      slug: key === 'name' && !current.id ? slugify(String(value)) : current.slug,
    }));
  }

  async function handleImageUpload(file: File | null, mode: 'main' | 'gallery') {
    if (!file) return;
    setUploading(true);
    setMessage(null);

    try {
      const url = await uploadAdminImage({
        file,
        bucket: 'products',
        folder: form.slug || slugify(form.name) || 'products',
      });

      if (mode === 'main') {
        setForm((current) => ({
          ...current,
          image: url,
          images: current.images ? `${current.images}\n${url}` : url,
        }));
      } else {
        setForm((current) => ({
          ...current,
          images: current.images ? `${current.images}\n${url}` : url,
        }));
      }
      setMessage('Image uploaded.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <AdminFrame>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Admin products</p>
        <h1 className="mt-2 text-3xl font-black">Product management</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Create products, update prices, change images, and hide unavailable items from the storefront.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr,420px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products"
                className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              New product
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">No products found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((product) => (
                <article key={product.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                  <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-28">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xs text-slate-500">
                        No image
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setForm(rowToForm(product))}
                    className="flex-1 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-black">{product.name}</h2>
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                        product.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {product.active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{product.category}</p>
                    <p className="mt-1 text-sm font-semibold">₦{Number(product.price || 0).toLocaleString()}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProduct(product)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <form onSubmit={saveProduct} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-black">{form.id ? 'Edit product' : 'New product'}</h2>
            <p className="mt-1 text-sm text-slate-500">Use one item per line for images, features, specs, and applications.</p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Name</span>
              <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} required className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Slug</span>
              <input value={form.slug} onChange={(event) => updateForm('slug', slugify(event.target.value))} required className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Category</span>
                <input value={form.category} onChange={(event) => updateForm('category', event.target.value)} required className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Price</span>
                <input type="number" min="0" value={form.price} onChange={(event) => updateForm('price', event.target.value)} required className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Main image path</span>
              <input value={form.image} onChange={(event) => updateForm('image', event.target.value)} placeholder="/images/cable-tray.png" className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
                <ImagePlus size={17} />
                {uploading ? 'Uploading...' : 'Upload main image'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading}
                  onChange={(event) => handleImageUpload(event.target.files?.[0] || null, 'main')}
                />
              </label>
              <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
                <ImagePlus size={17} />
                Upload gallery image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  disabled={uploading}
                  onChange={(event) => handleImageUpload(event.target.files?.[0] || null, 'gallery')}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Description</span>
              <textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} required rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>

            {[
              ['images', 'Gallery images'],
              ['features', 'Features'],
              ['specs', 'Specifications'],
              ['applications', 'Applications'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-sm font-semibold">{label}</span>
                <textarea
                  value={String(form[key as keyof ProductForm])}
                  onChange={(event) => updateForm(key as keyof ProductForm, event.target.value as never)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            ))}

            <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4 text-sm font-semibold">
              Product visible
              <input type="checkbox" checked={form.active} onChange={(event) => updateForm('active', event.target.checked)} className="h-5 w-5 accent-primary" />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? 'Saving...' : 'Save product'}
          </button>
        </form>
      </div>
    </AdminFrame>
  );
}