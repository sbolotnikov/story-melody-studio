'use client';
import { ArrowRight, Music, Video, Image as ImageIcon, Star, Play, Heart, Gift, Camera, ChevronRight } from "lucide-react";
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { ShareModal } from "../components/ShareModal";
import { Helmet } from "react-helmet-async";
import Image from "next/image";
const heroImg = "/images/storymelody_hero_1780519099425.png";
const songImg = "/images/product_song_1780519111946.png";
const videoImg = "/images/product_video_1780519123345.png";
const portraitImg = "/images/product_portrait_1780519136002.png";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="w-full grow flex flex-col">
      <Helmet>
        <title>StoryMelody</title>
        <meta name="description" content={t('seo.home_desc')} />
        <meta property="og:title" content="StoryMelody" />
        <meta property="og:description" content={t('seo.home_desc')} />
        {/* <meta property="og:image" content={heroImg} /> */}
      </Helmet>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 12-col-grid gap-12 lg:gap-8 items-center flex flex-col lg:grid lg:grid-cols-2">
          
          <div className="space-y-8 relative z-10 w-full text-center lg:text-left">
            <div className="inline-flex items-center space-x-3 text-xs font-serif text-brand-gold uppercase tracking-[0.2em] w-fit mx-auto lg:mx-0">
              <Star className="h-4 w-4" />
              <span>{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-serif leading-[1.1] font-bold">
              {t('hero.title1')} <br className="hidden lg:block"/>
              <span className="italic text-brand-gold font-normal">{t('hero.title2')}</span>
            </h1>
            
            <p className="max-w-xl text-lg text-muted-fg leading-relaxed mx-auto lg:mx-0 whitespace-pre-line">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/questionnaire" className="w-full sm:w-auto inline-flex items-center justify-center rounded-none bg-brand-gold px-8 py-4 text-xs font-bold text-brand-dark transition-all hover:bg-brand-gold/90 uppercase tracking-widest">
                {t('action.start')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/gallery" className="w-full sm:w-auto inline-flex items-center justify-center rounded-none bg-transparent border border-border px-8 py-4 text-xs font-semibold text-foreground hover:bg-muted transition-colors uppercase tracking-widest">
                {t('action.portfolio')}
                <Play className="ml-2 h-4 w-4" />
              </Link>
              <ShareModal 
                title="Share StoryMelody Studio" 
                description="Know someone who would love a personalized song, cinematic video, or custom portrait? Share our studio with them!" 
                imageSrc={heroImg} 
              />
            </div>
            
            <div className="pt-8 flex items-center gap-4 justify-center lg:justify-start text-sm text-muted-fg">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt={`Customer ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p>{t('hero.stats')}</p>
            </div>
          </div>
          
          <div className="relative w-full aspect-4/5 lg:aspect-square mt-12 lg:mt-0 max-w-md lg:max-w-none mx-auto">
            <div className="absolute inset-0 bg-linear-to-tr from-brand-gold/20 to-transparent blur-3xl rounded-full" />
            <div className="relative h-full w-full rounded-2xl overflow-hidden border border-border/50 shadow-2xl p-2 bg-background/50 backdrop-blur-sm">
              <Image src={heroImg} alt="StoryMelody Hero" className="w-full h-full object-cover rounded-xl" fill/>
              <div className="absolute bottom-8 left-8 right-8 bg-background/90 backdrop-blur-md p-6 rounded-none border border-border shadow-xl">
                <p className="font-serif italic text-lg text-foreground">
                  &ldquo;They captured my parents&apos; 50-year love story perfectly. We cried watching the video.&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-widest text-foreground">Emma T.</p>
                    <p className="text-xs text-muted-fg">Anniversary Video Package</p>
                  </div>
                  <div className="flex text-brand-gold">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Strip */}
      <section className="border-y border-border bg-muted py-8 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-wrap justify-center gap-4 sm:gap-8 lg:gap-16">
              {[
                { icon: Gift, label: t('occasions.birthdays.title'), id: "birthdays" },
                { icon: Heart, label: t('occasions.weddings.title'), id: "weddings" },
                { icon: Star, label: t('occasions.anniversaries.title'), id: "anniversaries" },
                { icon: Music, label: t('occasions.dance.title'), id: "dance" },
                { icon: Camera, label: t('occasions.retirements.title'), id: "retirements" },
              ].map((occ, idx) => (
                <Link href={`/occasions/${occ.id}`} key={idx} className="flex items-center gap-2 group cursor-pointer bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border sm:border-none sm:bg-transparent sm:p-0 sm:rounded-none">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border bg-background flex items-center justify-center group-hover:border-brand-gold transition-colors">
                    <occ.icon className="w-4 h-4 text-muted-fg group-hover:text-brand-gold" />
                  </div>
                  <span className="text-[10px] sm:text-sm font-medium uppercase tracking-widest text-foreground sm:text-muted-fg group-hover:text-brand-gold transition-colors">{occ.label}</span>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Services / Products */}
      <section className="py-24 lg:py-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-medium uppercase tracking-widest text-brand-gold mb-4">{t('products.title_small')}</h2>
            <h3 className="text-4xl lg:text-5xl font-bold font-serif mb-6">{t('products.title')}</h3>
            <p className="text-muted-fg text-lg">{t('products.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative border border-border bg-muted flex flex-col items-start overflow-hidden">
              <div className="w-full aspect-4/3 overflow-hidden">
                <Image src={songImg} alt="Personalized Song" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" fill />
              </div>
              <div className="p-8 w-full flex flex-col grow">
                <Music className="w-6 h-6 mb-4 text-brand-gold" />
                <h3 className="text-2xl font-serif font-bold mb-3">{t('products.song.title')}</h3>
                <p className="text-muted-fg mb-6 grow">{t('products.song.desc')}</p>
                <Link href="/gallery" className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 transition-colors mt-auto">
                  {t('products.song.link')} <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="group relative border border-border bg-muted flex flex-col items-start overflow-hidden">
              <div className="w-full aspect-4/3 overflow-hidden">
                <Image src={videoImg} alt="Cinematic Music Videos" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" fill />
              </div>
              <div className="p-8 w-full flex flex-col grow">
                <Video className="w-6 h-6 mb-4 text-brand-gold" />
                <h3 className="text-2xl font-serif font-bold mb-3">{t('products.video.title')}</h3>
                <p className="text-muted-fg mb-6 grow">{t('products.video.desc')}</p>
                <Link href="/gallery" className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 transition-colors mt-auto">
                  {t('products.video.link')} <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="group relative border border-border bg-muted flex flex-col items-start overflow-hidden">
              <div className="w-full aspect-4/3 overflow-hidden">
                <Image src={portraitImg} alt="Custom Portraits" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" fill/>
              </div>
              <div className="p-8 w-full h-full flex flex-col grow">
                <ImageIcon className="w-6 h-6 mb-4 text-brand-gold" />
                <h3 className="text-2xl font-serif font-bold mb-3">{t('products.portrait.title')}</h3>
                <p className="text-muted-fg mb-6 grow">{t('products.portrait.desc')}</p>
                <Link href="/gallery" className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 transition-colors mt-auto">
                  {t('products.portrait.link')} <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="py-24 lg:py-32 bg-muted/50 border-y border-border">
         <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div className="max-w-2xl">
                <h2 className="text-sm font-medium uppercase tracking-widest text-brand-gold mb-4">{t('pricing.title_small')}</h2>
                <h3 className="text-4xl lg:text-5xl font-bold font-serif mb-6">{t('pricing.title')}</h3>
              </div>
              <Link href="/packages" className="inline-flex items-center text-sm font-medium uppercase tracking-widest border border-border px-6 py-3 hover:bg-background transition-colors mt-6 md:mt-0 bg-background md:bg-transparent">
                {t('pricing.view_all')} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-border bg-muted p-8 flex flex-col relative w-full h-full">
                <div className="mb-2 text-muted-fg text-xs uppercase tracking-widest font-semibold">{t('pricing.pack1.type')}</div>
                <div className="text-3xl font-serif font-bold mb-4">{t('pricing.pack1.title')}</div>
                <div className="text-4xl font-serif text-brand-gold mb-6">$79</div>
                <p className="text-muted-fg mb-8 text-sm grow">{t('pricing.pack1.desc')}</p>
                <Link href="/packages" className="w-full block text-center rounded-none border border-brand-gold text-brand-gold px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-colors">{t('action.learn_more')}</Link>
              </div>

              <div className="border border-brand-gold/50 bg-brand-gold/5 p-8 flex flex-col relative transform md:-translate-y-4 shadow-xl">
                <div className="absolute top-0 right-0 bg-brand-gold text-brand-dark px-3 py-1 text-[10px] uppercase tracking-widest font-bold">{t('action.best_seller')}</div>
                <div className="mb-2 text-brand-gold text-xs uppercase tracking-widest font-semibold">{t('pricing.pack2.type')}</div>
                <div className="text-3xl font-serif font-bold mb-4">{t('pricing.pack2.title')}</div>
                <div className="text-4xl font-serif text-brand-gold mb-6">$499</div>
                <p className="text-muted-fg mb-8 text-sm grow">{t('pricing.pack2.desc')}</p>
                <Link href="/packages" className="w-full block text-center rounded-none bg-brand-gold border border-brand-gold text-brand-dark px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-transparent hover:text-brand-gold transition-colors">{t('action.learn_more')}</Link>
              </div>

              <div className="border border-border bg-muted p-8 flex flex-col relative w-full h-full">
                <div className="mb-2 text-muted-fg text-xs uppercase tracking-widest font-semibold">{t('pricing.pack3.type')}</div>
                <div className="text-3xl font-serif font-bold mb-4">{t('pricing.pack3.title')}</div>
                <div className="text-4xl font-serif text-brand-gold mb-6">$1499<span className="text-lg opacity-70">+</span></div>
                <p className="text-muted-fg mb-8 text-sm grow">{t('pricing.pack3.desc')}</p>
                <Link href="/packages" className="w-full block text-center rounded-none border border-brand-gold text-brand-gold px-4 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-colors">{t('action.build_package')}</Link>
              </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 overflow-hidden border-t border-brand-gold/10 bg-brand-gold text-brand-dark">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-black"></div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
           <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-brand-dark">{t('cta.title')}</h2>
           <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto text-brand-dark font-medium">{t('cta.desc')}</p>
           <Link href="/questionnaire" className="inline-flex items-center justify-center rounded-none bg-brand-dark text-brand-gold px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-brand-dark/90 hover:scale-[1.02] transition-all">
             {t('action.start')}
           </Link>
        </div>
      </section>
    </div>
  );
}
