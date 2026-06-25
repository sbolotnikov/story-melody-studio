'use client';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ShareModal } from '../../components/ShareModal';
const heroImg = '/images/about.jpg';

type TranslationType = {
  title: string;
  headline: string;
  content: string;
};

export default function About() {
  const { t, i18n } = useTranslation();

  // Inline translations since those keys don't exist yet
  const getAboutTranslation = (lang: string): TranslationType => {
    switch (lang) {
      case 'ru':
        return {
          title: 'О нас',
          headline: 'Преданность вашим историям',
          content:
            'StoryMelody Studio — это команда энтузиастов и творцов, стремящихся превратить ваши личные воспоминания в вечные шедевры. Мы считаем, что каждая жизнь — это уникальная история, заслуживающая своего саундтрека, визуального оформления и художественного воплощения. Мы стремимся создавать вашу историю со всей страстью, качеством и заботой, гарантируя, что каждый созданный нами продукт глубоко отзовется в ваших сердцах.',
        };
      case 'it':
        return {
          title: 'Chi Siamo',
          headline: 'Impegnati per la tua storia',
          content:
            "StoryMelody Studio è un team appassionato di creatori dedicati a trasformare i tuoi ricordi personali in capolavori senza tempo. Crediamo che ogni vita sia una storia unica che merita la sua colonna sonora, la sua visualizzazione e la sua rappresentazione artistica. Ci impegniamo a creare la tua storia con incondizionata passione, qualità e cura, assicurandoci che ogni opera d'arte risuoni profondamente.",
        };
      case 'pl':
        return {
          title: 'O nas',
          headline: 'Zobowiązani Twojej Historii',
          content:
            'StoryMelody Studio to pełen pasji zespół twórców poświęcających się przekształcaniu Twoich osobistych wspomnień w ponadczasową sztukę. Wierzymy, że każde życie to unikalna historia zasługująca na swoją ścieżkę dźwiękową, oprawę wizualną. Angażujemy się w tworzenie Twojej historii z najwyższą jakością i troską, aby każde nasze dzieło głęboko rezonowało z Tobą i Twoimi bliskimi.',
        };
      case 'de':
        return {
          title: 'Über uns',
          headline: 'Engagiert für Ihre Geschichte',
          content:
            'StoryMelody Studio ist ein leidenschaftliches Team von Schöpfern, das sich darauf spezialisiert hat, Ihre persönlichen Erinnerungen in zeitlose Kunstwerke zu verwandeln. Wir glauben, dass jedes Leben eine einzigartige Geschichte ist, die ihren eigenen Soundtrack und ihre visuelle Darstellung verdient. Wir engagieren uns dafür, Ihre Geschichte mit Qualität und Sorgfalt zum Leben zu erwecken.',
        };
      case 'fr':
        return {
          title: 'À propos',
          headline: 'Engagés envers votre histoire',
          content:
            "StoryMelody Studio est une équipe passionnée de créateurs déterminés à transformer vos souvenirs en chefs-d'œuvre intemporels. Nous croyons que chaque vie est une histoire unique méritant sa propre bande-son et sa représentation visuelle. Nous sommes profondément engagés à raconter votre histoire avec qualité et soin.",
        };
      case 'es':
        return {
          title: 'Nosotros',
          headline: 'Comprometidos con tu historia',
          content:
            'StoryMelody Studio es un equipo apasionado de creadores dedicados a transformar tus recuerdos en una obra de arte. Creemos que cada vida es una historia única que merece su propia banda sonora y visualización. Nos comprometemos a crear tu historia cuidando de la calidad en cada detalle.',
        };
      default:
        return {
          // en
          title: 'About Us',
          headline: 'Committed to Make Your Story',
          content:
            'StoryMelody Studio is a passionate team of creators dedicated to turning your personal memories into timeless masterpieces. We believe that every life is a unique story deserving of its own soundtrack, visual display, and artistic representation. We are deeply committed to making your story with relentless passion, unyielding quality, and utmost care, ensuring that every piece of art we craft resonates deeply with you and your loved ones.',
        };
    }
  };

  const about = getAboutTranslation(i18n.language);

  return (
    <div className="grow flex w-full flex-col">
      <section className="relative isolate flex min-h-[calc(100svh-5rem)] w-full items-end overflow-hidden lg:items-stretch">
        <Image
          src={heroImg}
          alt="A StoryMelody artist transforming memories into music, film, and portrait art"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] lg:object-center"
        />

        <div className="absolute inset-0 bg-linear-to-t from-background via-background/5 to-black/10 lg:bg-linear-to-r lg:from-background/40 lg:via-transparent lg:to-black/10" />

        <div
          className="absolute inset-y-0 left-0 hidden w-[54%] lg:block"
          style={{
            background:
              'linear-gradient(90deg, var(--bg-color) 0%, color-mix(in srgb, var(--bg-color) 96%, transparent) 58%, color-mix(in srgb, var(--bg-color) 72%, transparent) 74%, color-mix(in srgb, var(--bg-color) 30%, transparent) 88%, transparent 100%)',
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end px-4 pb-10 pt-32 sm:px-6 sm:pb-14 lg:items-center lg:px-8 lg:py-12">
          <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/15 bg-background/48 px-6 py-8 text-left shadow-2xl backdrop-blur-2xl sm:rounded-[2.5rem] sm:px-9 sm:py-10 lg:max-w-[52%] lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pr-12 lg:shadow-none lg:backdrop-blur-none">
            <div
              className="pointer-events-none absolute inset-0 lg:hidden"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 38%, color-mix(in srgb, var(--bg-color) 18%, transparent) 68%, color-mix(in srgb, var(--bg-color) 42%, transparent) 100%)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-16 blur-lg lg:hidden"
              style={{
                background:
                  'conic-gradient(from 270deg at 50% 0%, transparent 0deg, color-mix(in srgb, var(--bg-color) 46%, transparent) 42deg, color-mix(in srgb, var(--bg-color) 96%, transparent) 90deg, color-mix(in srgb, var(--bg-color) 46%, transparent) 138deg, transparent 180deg)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-[10%] top-0 h-8 opacity-55 blur-md lg:hidden"
              style={{
                background:
                  'conic-gradient(from 270deg at 50% 0%, transparent 0deg, color-mix(in srgb, #c5a059 20%, transparent) 70deg, color-mix(in srgb, #c5a059 30%, transparent) 90deg, color-mix(in srgb, #c5a059 20%, transparent) 110deg, transparent 180deg)',
              }}
            />

            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-14 bg-[#8a641f] shadow-[0_1px_2px_rgba(255,255,255,0.45)] dark:bg-[#e2bd73] dark:shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#765313] drop-shadow-[0_1px_1px_rgba(255,255,255,0.75)] dark:text-[#f0cb80] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {t('about.hero.eyebrow')}
              </p>
            </div>

            <h1 className="font-serif text-5xl font-bold leading-[0.92] sm:text-6xl lg:text-7xl xl:text-8xl">
              {about.title}
            </h1>

            <h2 className="mt-6 max-w-xl font-serif text-2xl font-medium italic leading-tight text-[#765313] drop-shadow-[0_1px_1px_rgba(255,255,255,0.75)] sm:text-3xl dark:text-[#f0cb80] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              &ldquo;{about.headline}&rdquo;
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-base xl:text-lg">
              {about.content}
            </p>

            <div className="mt-8 flex items-center gap-5">
              <ShareModal
                title="Share StoryMelody Studio"
                description="Share our story with your friends and family."
                imageSrc={heroImg}
                className="border-brand-gold/50 bg-background/45 backdrop-blur-sm"
              />
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-fg sm:block">
                {t('about.hero.tagline')}
              </span>
            </div>

            <div className="absolute -bottom-12 left-6 hidden h-12 w-px bg-linear-to-b from-brand-gold/70 to-transparent lg:block" />
          </div>
        </div>
      </section>
    </div>
  );
}
