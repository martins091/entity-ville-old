"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImagePlus, Plus, Save, Search, Trash2 } from 'lucide-react';
import AdminFrame from '../AdminFrame';
import { requireAdminSession } from '@/lib/supabase/admin';
import { uploadAdminImage } from '@/lib/supabase/storage';

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string | null;
  active: boolean;
  published_at: string;
};

type ArticleForm = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  active: boolean;
  published_at: string;
};

const emptyForm: ArticleForm = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  author: 'Entity Ville Team',
  category: 'News',
  image: '',
  active: true,
  published_at: new Date().toISOString().slice(0, 10),
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function rowToForm(article: ArticleRow): ArticleForm {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author,
    category: article.category,
    image: article.image || '',
    active: article.active,
    published_at: article.published_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  };
}

function formToPayload(form: ArticleForm) {
  return {
    slug: form.slug || slugify(form.title),
    title: form.title.trim(),
    excerpt: form.excerpt.trim(),
    content: form.content.trim(),
    author: form.author.trim() || 'Entity Ville Team',
    category: form.category.trim() || 'News',
    image: form.image.trim() || null,
    active: form.active,
    published_at: new Date(form.published_at).toISOString(),
  };
}

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return articles.filter((article) =>
      `${article.title} ${article.category} ${article.slug}`.toLowerCase().includes(q)
    );
  }, [articles, query]);

  async function loadArticles() {
    setLoading(true);
    setMessage(null);

    const { supabase, isAdmin, error } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push('/admin/login');
      return;
    }

    const { data, error: articlesError } = await supabase
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (articlesError) {
      setMessage(articlesError.message || error || 'Unable to load articles.');
    } else {
      setArticles((data || []) as ArticleRow[]);
    }

    setLoading(false);
  }

  async function saveArticle(event: React.FormEvent) {
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
      ? await supabase.from('news_articles').update(payload).eq('id', form.id)
      : await supabase.from('news_articles').insert(payload);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage(form.id ? 'Article updated.' : 'Article created.');
      setForm(emptyForm);
      await loadArticles();
    }

    setSaving(false);
  }

  async function deleteArticle(article: ArticleRow) {
    const confirmed = window.confirm(`Delete ${article.title}?`);
    if (!confirmed) return;

    const { supabase, isAdmin } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push('/admin/login');
      return;
    }

    const { error } = await supabase.from('news_articles').delete().eq('id', article.id);
    if (error) {
      setMessage(error.message);
      return;
    }

    setArticles((current) => current.filter((entry) => entry.id !== article.id));
    if (form.id === article.id) setForm(emptyForm);
  }

  function updateForm<K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      slug: key === 'title' && !current.id ? slugify(String(value)) : current.slug,
    }));
  }

  async function handleImageUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setMessage(null);

    try {
      const url = await uploadAdminImage({
        file,
        bucket: 'article-images',
        folder: form.slug || slugify(form.title) || 'articles',
      });
      setForm((current) => ({ ...current, image: url }));
      setMessage('Image uploaded.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <AdminFrame>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Admin articles</p>
        <h1 className="mt-2 text-3xl font-black">Article management</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Create and update website articles. Published articles appear on the public news pages.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr,460px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search articles"
                className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              New article
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">Loading articles...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">No articles found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((article) => (
                <article key={article.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                  <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-28">
                    {article.image && <Image src={article.image} alt={article.title} fill className="object-cover" />}
                  </div>
                  <button type="button" onClick={() => setForm(rowToForm(article))} className="flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-black">{article.title}</h2>
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                        article.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {article.active ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{article.category} · {article.author}</p>
                    <p className="mt-1 text-sm text-slate-500">{new Date(article.published_at).toLocaleDateString()}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteArticle(article)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${article.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <form onSubmit={saveArticle} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-black">{form.id ? 'Edit article' : 'New article'}</h2>
            <p className="mt-1 text-sm text-slate-500">Use the image upload button or paste a public image URL.</p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Title</span>
              <input value={form.title} onChange={(event) => updateForm('title', event.target.value)} required className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Slug</span>
              <input value={form.slug} onChange={(event) => updateForm('slug', slugify(event.target.value))} required className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Author</span>
                <input value={form.author} onChange={(event) => updateForm('author', event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Category</span>
                <input value={form.category} onChange={(event) => updateForm('category', event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Published date</span>
              <input type="date" value={form.published_at} onChange={(event) => updateForm('published_at', event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Image URL</span>
              <input value={form.image} onChange={(event) => updateForm('image', event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>

            <label className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
              <ImagePlus size={17} />
              {uploading ? 'Uploading...' : 'Upload article image'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                disabled={uploading}
                onChange={(event) => handleImageUpload(event.target.files?.[0] || null)}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Excerpt</span>
              <textarea value={form.excerpt} onChange={(event) => updateForm('excerpt', event.target.value)} required rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Content</span>
              <textarea value={form.content} onChange={(event) => updateForm('content', event.target.value)} required rows={10} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4 text-sm font-semibold">
              Article published
              <input type="checkbox" checked={form.active} onChange={(event) => updateForm('active', event.target.checked)} className="h-5 w-5 accent-primary" />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? 'Saving...' : 'Save article'}
          </button>
        </form>
      </div>
    </AdminFrame>
  );
}
