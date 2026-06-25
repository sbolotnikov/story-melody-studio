'use client';
import { useTranslation } from "react-i18next";
import Link from 'next/link';
import Image from 'next/image';
import { ShareModal } from "../../components/ShareModal";
import { EditorialHero } from "../../components/EditorialHero";
const packageImg = "/images/packages_sm.jpg"
const songImg = "/images/product_song_1780519111946.png";
const videoImg = "/images/product_video_1780519123345.png";
const portraitImg = "/images/product_portrait_1780519136002.png";

export default function Packages() {
  const { t } = useTranslation();
  return (
    <div className="grow flex w-full flex-col">
      <EditorialHero
        imageSrc={packageImg}
        imageAlt={t('products.song.title')}
        eyebrow={t('pricing.title_small')}
        title={t('pricing.title')}
        description={t('cta.desc')}
        imageClassName="object-cover object-[72%_center] lg:object-center"
        actions={
          <ShareModal
            title={`${t('pricing.title')} | StoryMelody Studio`}
            description={t('seo.packages_desc')}
            imageSrc={packageImg}
            className="border-brand-gold/50 bg-background/45 backdrop-blur-sm"
          />
        }
        detail={t('products.title_small')}
      />

      <section className="py-20 lg:py-28 bg-background">
         <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group border border-border bg-muted flex flex-col relative w-full h-full overflow-hidden">
                <div className="relative aspect-4/3 w-full overflow-hidden bg-background">
                  <Image
                    src={songImg}
                    alt={t('products.song.title')}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                </div>
                <div className="p-8 flex grow flex-col">
                  <div className="mb-2 text-muted-fg text-xs uppercase tracking-widest font-semibold">{t('pricing.pack1.type')}</div>
                  <div className="text-3xl font-serif font-bold mb-4">{t('pricing.pack1.title')}</div>
                  <div className="text-4xl font-serif text-brand-gold mb-6">$79</div>
                  <p className="text-muted-fg mb-8 text-sm grow">{t('pricing.pack1.desc')}</p>
                  <Link href="/questionnaire?package=1" className="w-full block text-center rounded-none border border-brand-gold text-brand-gold px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-colors">{t('action.start')}</Link>
                </div>
              </div>

              <div className="group border border-brand-gold/50 bg-brand-gold/5 flex flex-col relative transform md:-translate-y-4 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 z-20 bg-brand-gold text-brand-dark px-3 py-1 text-[10px] uppercase tracking-widest font-bold">{t('action.best_seller')}</div>
                <div className="relative aspect-4/3 w-full overflow-hidden bg-background">
                  <Image
                    src={videoImg}
                    alt={t('products.video.title')}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                </div>
                <div className="p-8 flex grow flex-col">
                  <div className="mb-2 text-brand-gold text-xs uppercase tracking-widest font-semibold">{t('pricing.pack2.type')}</div>
                  <div className="text-3xl font-serif font-bold mb-4">{t('pricing.pack2.title')}</div>
                  <div className="text-4xl font-serif text-brand-gold mb-6">$499</div>
                  <p className="text-muted-fg mb-8 text-sm grow">{t('pricing.pack2.desc')}</p>
                  <Link href="/questionnaire?package=2" className="w-full block text-center rounded-none bg-brand-gold border border-brand-gold text-brand-dark px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-transparent hover:text-brand-gold transition-colors">{t('action.start')}</Link>
                </div>
              </div>

              <div className="group border border-border bg-muted flex flex-col relative w-full h-full overflow-hidden">
                <div className="relative aspect-4/3 w-full overflow-hidden bg-background">
                  <Image
                    src={portraitImg}
                    alt={t('products.portrait.title')}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                </div>
                <div className="p-8 flex grow flex-col">
                  <div className="mb-2 text-muted-fg text-xs uppercase tracking-widest font-semibold">{t('pricing.pack3.type')}</div>
                  <div className="text-3xl font-serif font-bold mb-4">{t('pricing.pack3.title')}</div>
                  <div className="text-4xl font-serif text-brand-gold mb-6">$1499<span className="text-lg opacity-70">+</span></div>
                  <p className="text-muted-fg mb-8 text-sm grow">{t('pricing.pack3.desc')}</p>
                  <Link href="/questionnaire?package=3" className="w-full block text-center rounded-none border border-brand-gold text-brand-gold px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-colors">{t('action.start')}</Link>
                </div>
              </div>
            </div>
         </div>
      </section>
    </div>
  );
}
