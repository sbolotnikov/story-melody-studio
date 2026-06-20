'use client';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Play, Music, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

type GalleryItemType = 'image' | 'video' | 'song';

interface GalleryItem {
  id: string;
  type: GalleryItemType;
  title: string;
  description: string;
  url: string;
  createdAt: string;
}

const TABS = [
  { id: 'image', label: 'Images', icon: ImageIcon },
  { id: 'video', label: 'Videos', icon: Play },
  { id: 'song', label: 'Songs', icon: Music },
];

export default function GalleryClient() {
  const { t } = useTranslation();
  const authContext = useAuth();
  const profile = authContext?.profile;
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentType = (searchParams.get('type') as GalleryItemType) || 'image';

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin state
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    url: '',
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?type=${currentType}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // schedule fetch on next microtask to avoid calling setState synchronously within the effect
    Promise.resolve().then(() => fetchItems());
  }, [currentType]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.url) return;
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, type: currentType }),
      });
      if (res.ok) {
        setNewItem({ title: '', description: '', url: '' });
        setIsAdding(false);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setSearchParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="grow flex flex-col py-16 lg:py-24 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{t('nav.gallery')} - StoryMelody</title>
        <meta name="description" content={t('gallery.desc')} />
        <meta
          property="og:title"
          content={`${t('nav.gallery')} - StoryMelody`}
        />
        <meta property="og:description" content={t('gallery.desc')} />
        <meta
          property="og:image"
          content={process.env.NEXTAUTH_URL+"/images/storymelody_logo - Small.png"}
        />
      </Helmet>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
          {t('nav.gallery')}
        </h1>
        <p className="text-lg text-muted-fg">{t('gallery.desc')}</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="flex border border-border p-1 bg-muted/50 w-full max-w-md">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSearchParams({ type: tab.id });
                setIsAdding(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-widest transition-colors ${
                currentType === tab.id
                  ? 'bg-background text-foreground shadow-sm border border-border'
                  : 'text-muted-fg hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {t(`gallery.tabs.${tab.id}`)}
            </button>
          ))}
        </div>
      </div>

      {profile?.role === 'admin' && (
        <div className="mb-12">
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="px-6 py-3 bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-widest inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New {currentType}
            </button>
          ) : (
            <form
              onSubmit={handleAddItem}
              className="bg-muted/30 border border-border p-6 max-w-2xl"
            >
              <h3 className="text-lg font-serif font-bold mb-4">
                Add New {currentType}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1">
                    Title
                  </label>
                  <input
                    required
                    value={newItem.title}
                    onChange={(e) =>
                      setNewItem({ ...newItem, title: e.target.value })
                    }
                    className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1">
                    Media URL (image link, youtube/vimeo link, or audio link)
                  </label>
                  <input
                    required
                    value={newItem.url}
                    onChange={(e) =>
                      setNewItem({ ...newItem, url: e.target.value })
                    }
                    className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold min-h-24"
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-widest"
                  >
                    Save Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-3 border border-border text-xs font-bold uppercase tracking-widest hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-muted-fg uppercase tracking-widest text-xs font-medium">
          {t('gallery.loading')}
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center border mx-auto w-full border-border bg-muted/20 text-muted-fg font-medium">
          {t('gallery.empty')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative border border-border bg-background overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
                {item.type === 'image' && (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                )}
                {item.type === 'video' && (
                  <iframe
                    src={item.url}
                    title={item.title}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                )}
                {item.type === 'song' && (
                  <audio controls src={item.url} className="w-full px-4">
                    <track kind="captions" />
                  </audio>
                )}
              </div>
              <div className="p-6 grow flex flex-col">
                {item.type === 'song' ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-serif font-bold mb-2 text-brand-gold hover:underline inline-block"
                  >
                    {item.title}
                  </a>
                ) : (
                  <h3 className="text-xl font-serif font-bold mb-2">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-sm text-muted-fg grow">
                    {item.description}
                  </p>
                )}

                {profile?.role === 'admin' && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-xs font-semibold uppercase tracking-widest text-red-500 hover:text-red-400 inline-flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
