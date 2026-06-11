'use client';
import { useTranslation } from "react-i18next";
import Link from 'next/link';
import { ShareModal } from "../../components/ShareModal";
const songImg = "/images/product_song_1780519111946.png";

export default function Packages() {
  const { t } = useTranslation();
  return (
    <div className="grow flex flex-col">
      <section className="py-24 lg:py-32 bg-background">
         <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-sm font-medium uppercase tracking-widest text-brand-gold mb-4">{t('pricing.title_small')}</h1>
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6">{t('pricing.title')}</h2>
              <p className="text-muted-fg text-lg">{t('cta.desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-border bg-muted p-8 flex flex-col relative w-full h-full">
                <div className="mb-2 text-muted-fg text-xs uppercase tracking-widest font-semibold">{t('pricing.pack1.type')}</div>
                <div className="text-3xl font-serif font-bold mb-4">{t('pricing.pack1.title')}</div>
                <div className="text-4xl font-serif text-brand-gold mb-6">$79</div>
                <p className="text-muted-fg mb-8 text-sm grow">{t('pricing.pack1.desc')}</p>
                <Link href="/questionnaire?package=1" className="w-full block text-center rounded-none border border-brand-gold text-brand-gold px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-colors">{t('action.start')}</Link>
              </div>

              <div className="border border-brand-gold/50 bg-brand-gold/5 p-8 flex flex-col relative transform md:-translate-y-4 shadow-xl">
                <div className="absolute top-0 right-0 bg-brand-gold text-brand-dark px-3 py-1 text-[10px] uppercase tracking-widest font-bold">{t('action.best_seller')}</div>
                <div className="mb-2 text-brand-gold text-xs uppercase tracking-widest font-semibold">{t('pricing.pack2.type')}</div>
                <div className="text-3xl font-serif font-bold mb-4">{t('pricing.pack2.title')}</div>
                <div className="text-4xl font-serif text-brand-gold mb-6">$499</div>
                <p className="text-muted-fg mb-8 text-sm grow">{t('pricing.pack2.desc')}</p>
                <Link href="/questionnaire?package=2" className="w-full block text-center rounded-none bg-brand-gold border border-brand-gold text-brand-dark px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-transparent hover:text-brand-gold transition-colors">{t('action.start')}</Link>
              </div>

              <div className="border border-border bg-muted p-8 flex flex-col relative w-full h-full">
                <div className="mb-2 text-muted-fg text-xs uppercase tracking-widest font-semibold">{t('pricing.pack3.type')}</div>
                <div className="text-3xl font-serif font-bold mb-4">{t('pricing.pack3.title')}</div>
                <div className="text-4xl font-serif text-brand-gold mb-6">$1499<span className="text-lg opacity-70">+</span></div>
                <p className="text-muted-fg mb-8 text-sm grow">{t('pricing.pack3.desc')}</p>
                <Link href="/questionnaire?package=3" className="w-full block text-center rounded-none border border-brand-gold text-brand-gold px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-colors">{t('action.start')}</Link>
              </div>
            </div>
         </div>
      </section>
      
      <div className="py-12 bg-background flex justify-center">
        <ShareModal 
          title="Share Our Packages" 
          description="Help someone discover the perfect personalized gift. Share our pricing and packages with friends and family." 
          imageSrc={songImg} 
        />
      </div>
    </div>
  );
}
