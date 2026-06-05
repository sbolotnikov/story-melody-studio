'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import logoImg from "../assets/images/storymelody_logo_1780521281759.png";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-brand-dark text-white border-t border-brand-gold/20 py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center space-x-4 mb-6 group w-fit">
            <Image src={logoImg} alt="StoryMelody Logo" width={48} height={48} className="w-12 h-12 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
            <div className="flex flex-col justify-center">
              <span className="font-serif text-2xl font-bold leading-none tracking-tight text-white">
                Story<span className="text-brand-gold">Melody</span>
              </span>
              <span className="text-[0.7rem] font-sans font-semibold uppercase tracking-[0.4em] text-gray-400 mt-1">
                Studio
              </span>
            </div>
          </Link>
          <p className="text-gray-400 max-w-sm mt-4">
            {t('hero.subtitle')}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-xs uppercase tracking-widest text-gray-500 mb-6">Explore</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link href="/packages" className="hover:text-brand-gold transition-colors">{t('products.song.title')}</Link></li>
            <li><Link href="/packages" className="hover:text-brand-gold transition-colors">{t('products.video.title')}</Link></li>
            <li><Link href="/packages" className="hover:text-brand-gold transition-colors">{t('products.portrait.title')}</Link></li>
            <li><Link href="/packages" className="hover:text-brand-gold transition-colors">{t('nav.packages')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-xs uppercase tracking-widest text-gray-500 mb-6">Studio</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link href="/about" className="hover:text-brand-gold transition-colors">{t('nav.about')}</Link></li>
            <li><Link href="/gallery" className="hover:text-brand-gold transition-colors">{t('nav.gallery')}</Link></li>
            <li><Link href="/faq" className="hover:text-brand-gold transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-brand-gold/10 text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between">
        <p>StoryMelody &copy; {new Date().getFullYear()}</p>
        <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
          <Link href="https://twitter.com" className="hover:text-brand-gold transition-colors" target="_blank" rel="noopener noreferrer">Twitter</Link>
          <Link href="https://instagram.com" className="hover:text-brand-gold transition-colors" target="_blank" rel="noopener noreferrer">Instagram</Link>
          <Link href="https://youtube.com" className="hover:text-brand-gold transition-colors" target="_blank" rel="noopener noreferrer">YouTube</Link>
        </div>
      </div>
    </footer>
  );
}
