'use client';
import { useState } from "react";
import Image, { type StaticImageData } from 'next/image';
import { Share2, Copy, Check, X, Facebook, Twitter, Mail, MessageCircle } from "lucide-react";

interface ShareModalProps {
  title: string;
  description: string;
  imageSrc: string | StaticImageData;
}

export function ShareModal({ title, description, imageSrc }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';


  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, '_blank');
  };

  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + "\n\n" + url)}`;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center border border-border bg-background text-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:border-brand-gold hover:text-brand-gold transition-colors"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-background border border-border shadow-2xl max-w-md w-full relative flex flex-col text-left">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-brand-gold z-10 bg-black/30 backdrop-blur-sm p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-48 relative border-b border-border">
              <Image
                src={imageSrc}
                alt="Share Cover"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
            </div>
            <div className="p-8 pt-6">
              <h3 className="text-2xl font-serif font-bold mb-3">{title}</h3>
              <p className="text-muted-fg mb-6 text-sm leading-relaxed">
                {description}
              </p>
              
              <div className="flex items-center justify-between mb-6 border-y border-border py-4">
                <button 
                  onClick={handleShareWhatsApp}
                  className="flex flex-col items-center gap-2 text-muted-fg hover:text-[#25D366] transition-colors"
                  title="Share on WhatsApp"
                >
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background hover:border-[#25D366]">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">WhatsApp</span>
                </button>
                <button 
                  onClick={handleShareFacebook}
                  className="flex flex-col items-center gap-2 text-muted-fg hover:text-[#1877F2] transition-colors"
                  title="Share on Facebook"
                >
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background hover:border-[#1877F2]">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Facebook</span>
                </button>
                <button 
                  onClick={handleShareTwitter}
                  className="flex flex-col items-center gap-2 text-muted-fg hover:text-[#1DA1F2] transition-colors"
                  title="Share on Twitter"
                >
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background hover:border-[#1DA1F2]">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Twitter</span>
                </button>
                <button 
                  onClick={handleShareEmail}
                  className="flex flex-col items-center gap-2 text-muted-fg hover:text-brand-gold transition-colors"
                  title="Share via Email"
                >
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background hover:border-brand-gold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Email</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={url} 
                  className="grow bg-muted/50 border border-border p-3 text-sm text-foreground focus:outline-none"
                />
                <button 
                  onClick={handleCopy}
                  className="bg-brand-gold text-brand-dark px-4 py-3 font-semibold uppercase tracking-widest text-xs hover:bg-brand-gold/90 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
