'use client';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Play, Music, ImageIcon, Plus, Trash2, X, Maximize2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ShareModal } from '../../components/ShareModal';

const galleryHeroImage = '/images/gallery.jpg';

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
] as const;

function isGalleryItemType(value: string | null): value is GalleryItemType {
  return value === 'image' || value === 'video' || value === 'song';
}

export default function GalleryClient() {
  const { t } = useTranslation();
  const authContext = useAuth();
  const profile = authContext?.profile;
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type');
  const [currentType, setCurrentType] = useState<GalleryItemType>(
    isGalleryItemType(initialType) ? initialType : 'image',
  );

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);
  const itemCache = useRef<Partial<Record<GalleryItemType, GalleryItem[]>>>({});
  const activeType = useRef(currentType);

  // Admin state
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    url: '',
  });

  const fetchItems = useCallback(async (type: GalleryItemType, force = false) => {
    const cachedItems = itemCache.current[type];
    if (cachedItems && !force) {
      if (activeType.current === type) {
        setItems(cachedItems);
        setLoading(false);
      }
      return;
    }

    if (activeType.current === type) setLoading(true);

    try {
      const res = await fetch(`/api/gallery?type=${type}`);
      if (res.ok) {
        const data = (await res.json()) as GalleryItem[];
        itemCache.current[type] = data;
        if (activeType.current === type) setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (activeType.current === type) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems(currentType);

    TABS.forEach(({ id }) => {
      if (id !== currentType) void fetchItems(id);
    });
  }, [currentType, fetchItems]);

  useEffect(() => {
    const handlePopState = () => {
      const type = new URL(window.location.href).searchParams.get('type');
      const nextType = isGalleryItemType(type) ? type : 'image';
      activeType.current = nextType;
      setCurrentType(nextType);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!activeMedia) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMedia(null);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMedia]);

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
        await fetchItems(currentType, true);
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
        setItems((prev) => {
          const nextItems = prev.filter((item) => item.id !== id);
          itemCache.current[currentType] = nextItems;
          return nextItems;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectType = (type: GalleryItemType) => {
    if (type === currentType) return;

    activeType.current = type;
    setCurrentType(type);

    const cachedItems = itemCache.current[type];
    if (cachedItems) {
      setItems(cachedItems);
      setLoading(false);
    }

    const url = new URL(window.location.href);
    url.searchParams.set('type', type);
    window.history.pushState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <div className="grow flex flex-col w-full justify-center items-center">
      <section className="relative isolate flex min-h-145 w-full items-end overflow-hidden lg:min-h-[64svh] lg:items-stretch xl:min-h-[68svh]">
        <Image
          src={galleryHeroImage}
          alt="A collection of personalized StoryMelody celebrations and portraits"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_center] lg:object-center"
        />

        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-black/5 lg:bg-linear-to-r lg:from-background/35 lg:via-transparent lg:to-black/10" />

        <div
          className="absolute inset-y-0 left-0 hidden w-[54%] border-r border-brand-gold/30 bg-background/72 backdrop-blur-md lg:block"
          style={{
            clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)',
          }}
        />
        <div
          className="absolute inset-y-0 left-0 hidden w-[54%] bg-linear-to-r from-brand-gold/8 via-transparent to-brand-gold/12 lg:block"
          style={{
            clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)',
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end px-4 pb-16 pt-28 sm:px-6 lg:items-center lg:px-8 lg:py-20">
          <div className="relative w-full bg-background/78 px-6 py-8 text-left backdrop-blur-xl sm:px-9 sm:py-10 lg:max-w-[48%] lg:bg-transparent lg:p-0 lg:pr-10 lg:backdrop-blur-none">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-brand-gold via-brand-gold/50 to-transparent lg:hidden" />
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-14 bg-brand-gold" />
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                StoryMelody Studio
              </p>
            </div>

            <h1 className="text-5xl font-serif font-bold leading-[0.92] sm:text-6xl lg:text-7xl xl:text-8xl">
              {t('nav.gallery')}
            </h1>

            <p className="mt-7 max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
              {t('gallery.desc')}
            </p>

            <div className="mt-9 flex items-center gap-5">
              <ShareModal
                title={`${t('nav.gallery')} - StoryMelody`}
                description={t('gallery.desc')}
                imageSrc={galleryHeroImage}
                className="border-brand-gold/50 bg-background/45 backdrop-blur-sm"
              />
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-fg sm:block">
                {t('gallery.hero.tagline')}
              </span>
            </div>

            <div className="absolute -bottom-16 left-6 hidden h-16 w-px bg-linear-to-b from-brand-gold/70 to-transparent lg:block" />
          </div>
        </div>
      </section>

      <div className="relative z-20 -mt-7 flex w-full justify-center px-4 sm:px-6">
        <div className="flex w-full max-w-md border border-border bg-background/90 p-1 shadow-xl backdrop-blur-xl">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                selectType(tab.id);
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
        <div className="m-12">
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
        <div className="grid w-full max-w-7xl grid-cols-1 gap-8 px-4 pt-16 pb-24 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8 lg:pt-24 lg:pb-32">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative border border-border bg-background overflow-hidden flex flex-col"
            >
              <div
                className={`aspect-video bg-muted relative overflow-hidden flex items-center justify-center ${
                  item.type !== 'song' ? 'cursor-zoom-in' : ''
                }`}
                onClick={() => {
                  if (item.type !== 'song') setActiveMedia(item);
                }}
              >
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
                  <>
                    <iframe
                      src={item.url}
                      title={item.title}
                      className="w-full h-full pointer-events-none"
                      allowFullScreen
                    ></iframe>
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
                  </>
                )}
                {item.type === 'song' && (
                  <audio controls src={item.url} className="w-full px-4">
                    <track kind="captions" />
                  </audio>
                )}
                {item.type !== 'song' && (
                  <span className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                    <Maximize2 className="h-4 w-4" />
                  </span>
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

      {activeMedia && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveMedia(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeMedia.title}
            className="relative flex h-full max-h-[92vh] w-full max-w-7xl flex-col"
          >
            <div className="mb-3 flex items-center justify-between gap-4 text-white">
              <div className="min-w-0">
                <h2 className="truncate font-serif text-xl font-bold sm:text-2xl">
                  {activeMedia.title}
                </h2>
                {activeMedia.description && (
                  <p className="mt-1 hidden truncate text-sm text-white/65 sm:block">
                    {activeMedia.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                aria-label="Close fullscreen media"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative min-h-0 grow overflow-hidden border border-white/15 bg-black shadow-2xl">
              {activeMedia.type === 'image' ? (
                <Image
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                  referrerPolicy="no-referrer"
                />
              ) : (
                <iframe
                  src={activeMedia.url}
                  title={activeMedia.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
