'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Facebook,
  Mail,
  MessageCircle,
  Share2,
  Twitter,
  X,
} from 'lucide-react';

interface ShareModalProps {
  title: string;
  description: string;
  imageSrc: string | StaticImageData;
  buttonLabel?: string;
  className?: string;
}

function getImagePath(imageSrc: string | StaticImageData) {
  return typeof imageSrc === 'string' ? imageSrc : imageSrc.src;
}

function getFileName(path: string, type: string) {
  const pathName = new URL(path, window.location.origin).pathname;
  const name = pathName.split('/').pop();
  if (name?.includes('.')) return name;

  const extension = type.split('/')[1] || 'jpg';
  return `storymelody-share.${extension}`;
}

function getShareUrl() {
  const shareUrl = new URL(window.location.href);
  if (!shareUrl.searchParams.has('lng')) {
    const documentLocale = document.documentElement.lang.toLowerCase().split('-')[0];
    if (documentLocale) shareUrl.searchParams.set('lng', documentLocale);
  }
  return shareUrl.toString();
}

export function ShareModal({
  title,
  description,
  imageSrc,
  buttonLabel = 'Share',
  className = '',
}: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const imagePath = useMemo(() => getImagePath(imageSrc), [imageSrc]);
  const url = isOpen ? getShareUrl() : '';

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setShareMessage('');
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      setShareMessage('Sharing is not supported here, so the link was copied.');
      return;
    }

    setIsSharing(true);
    setShareMessage('');

    try {
      const shareData: ShareData = { title, text: description, url };

      try {
        const response = await fetch(
          new URL(imagePath, window.location.origin),
        );
        if (response.ok) {
          const blob = await response.blob();
          const file = new File([blob], getFileName(imagePath, blob.type), {
            type: blob.type,
          });
          const dataWithFile: ShareData = { ...shareData, files: [file] };

          if (navigator.canShare?.(dataWithFile)) {
            await navigator.share(dataWithFile);
            return;
          }
        }
      } catch {
        // The link-only share below remains available when the image cannot be fetched.
      }

      await navigator.share(shareData);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareMessage('Could not open sharing. You can copy the link instead.');
    } finally {
      setIsSharing(false);
    }
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShareMessage('');
          setIsOpen(true);
        }}
        className={`inline-flex items-center justify-center border border-border bg-background text-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:border-brand-gold hover:text-brand-gold transition-colors ${className}`}
      >
        <Share2 className="w-4 h-4 mr-2" />
        {buttonLabel}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
            className="bg-background border border-border shadow-2xl max-w-md w-full relative flex flex-col text-left"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close share dialog"
              className="absolute top-4 right-4 text-white hover:text-brand-gold z-10 bg-black/40 backdrop-blur-sm p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-52 relative border-b border-border">
              <Image
                src={imageSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 448px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-8 pt-6">
              <h2 id="share-modal-title" className="text-2xl font-serif font-bold mb-3">
                {title}
              </h2>
              <p className="text-muted-fg mb-6 text-sm leading-relaxed">
                {description}
              </p>

              <button
                type="button"
                onClick={handleNativeShare}
                disabled={isSharing}
                className="w-full mb-6 bg-brand-gold text-brand-dark px-5 py-4 font-bold uppercase tracking-widest text-xs hover:bg-brand-gold/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Share2 className="w-4 h-4" />
                {isSharing ? 'Preparing image…' : 'Share page and image'}
              </button>

              <div className="grid grid-cols-4 gap-3 mb-6 border-y border-border py-4">
                <button
                  type="button"
                  onClick={() =>
                    openShareWindow(
                      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
                    )
                  }
                  className="flex flex-col items-center gap-2 text-muted-fg hover:text-[#25D366] transition-colors"
                  aria-label="Share on WhatsApp"
                >
                  <span className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background">
                    <MessageCircle className="w-5 h-5" />
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider">WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openShareWindow(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                    )
                  }
                  className="flex flex-col items-center gap-2 text-muted-fg hover:text-[#1877F2] transition-colors"
                  aria-label="Share on Facebook"
                >
                  <span className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background">
                    <Facebook className="w-5 h-5" />
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider">Facebook</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openShareWindow(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
                    )
                  }
                  className="flex flex-col items-center gap-2 text-muted-fg hover:text-[#1DA1F2] transition-colors"
                  aria-label="Share on X"
                >
                  <span className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background">
                    <Twitter className="w-5 h-5" />
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider">X</span>
                </button>
                <a
                  href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`}
                  className="flex flex-col items-center gap-2 text-muted-fg hover:text-brand-gold transition-colors"
                  aria-label="Share by email"
                >
                  <span className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background">
                    <Mail className="w-5 h-5" />
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider">Email</span>
                </a>
              </div>

              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  readOnly
                  value={url}
                  aria-label="Page link"
                  className="min-w-0 grow bg-muted/50 border border-border p-3 text-sm text-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-foreground text-background px-4 py-3 font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {shareMessage && (
                <p role="status" className="mt-3 text-xs text-muted-fg">
                  {shareMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
