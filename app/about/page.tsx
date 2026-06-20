'use client';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ShareModal } from '../../components/ShareModal';
import { Helmet } from "react-helmet-async";
const logoImg = '/images/storymelody_logo_1780521281759.png';
const heroImg = '/images/storymelody_hero.jpg';

type TranslationType = {
  title: string;
  headline: string;
  content: string;
};

export default function About() {
  const { i18n } = useTranslation();

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
    <div className="grow flex flex-col">
      <Helmet>
        <title>{about.title} - StoryMelody</title>
        <meta name="description" content={about.headline} />
        <meta
          property="og:title"
          content={`${about.title} - StoryMelody`}
        />
        <meta property="og:description" content={about.headline} />
        <meta
          property="og:image"
          content={process.env.NEXTAUTH_URL+heroImg}
        />
      </Helmet>
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-32 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-12 lg:gap-8 items-center flex flex-col lg:grid lg:grid-cols-2">
          <div className="space-y-8 relative z-10 w-full text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              {about.title}
            </h1>
            <h2 className="text-3xl font-serif text-brand-gold italic mb-6">
              &ldquo;{about.headline}&rdquo;
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {about.content}
            </p>
          </div>

          <div className="relative w-full aspect-square mt-12 lg:mt-0 max-w-md lg:max-w-none mx-auto">
            <div className="absolute inset-0 bg-linear-to-tr from-brand-gold/20 to-transparent blur-3xl rounded-full" />
            <div className="relative h-full w-full rounded-2xl overflow-hidden border border-border/50 shadow-2xl p-2 bg-background/50 backdrop-blur-sm">
              <Image
                src={heroImg}
                alt="StoryMelody Hero"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 bg-background flex justify-center">
        <ShareModal
          title="Share StoryMelody Studio"
          description="Share our story with your friends and family."
          imageSrc={logoImg}
        />
      </div>
    </div>
  );
}
