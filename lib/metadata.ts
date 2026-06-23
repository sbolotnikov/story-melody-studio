import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const supportedLocales = ['en', 'es', 'fr', 'ru', 'it', 'pl', 'de'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

const localeNames: Record<SupportedLocale, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  ru: 'ru_RU',
  it: 'it_IT',
  pl: 'pl_PL',
  de: 'de_DE',
};

const metadataTranslations: Record<
  SupportedLocale,
  Record<string, string>
> = {
  en: {
    'nav.about': 'About',
    'nav.packages': 'Packages',
    'nav.occasions': 'Occasions',
    'nav.gallery': 'Gallery',
    'faq.title': 'FAQ & How it Works',
    'seo.home_desc': 'Personalized songs, cinematic music videos, and custom portraits.',
    'seo.about_desc': 'Meet the creators turning personal memories into timeless art.',
    'seo.packages_desc': 'Explore our personalized packages and pricing, crafted for every moment.',
    'occasions.main_desc': 'Discover personalized music and art for every celebration.',
    'gallery.desc': 'Explore our portfolio of unique personalized creations.',
    'nav.faq_desc': 'Everything you need to know about custom songs, videos, and personalized gifts.',
    'q.share_desc': 'Share your story to begin a personalized song, video, or portrait.',
    'q.page_title': 'Questionnaire',
    'reviews.page_title': 'Customer Reviews & Testimonials - StoryMelody',
    'reviews.intro_desc': 'Read reviews from clients who turned their stories into original music and art.',
    'occasions.birthdays.title': 'Birthdays',
    'occasions.birthdays.desc': 'Celebrate their personality and memories with an unforgettable custom song.',
    'occasions.weddings.title': 'Weddings',
    'occasions.weddings.desc': 'Tell your unique love story through a custom wedding song.',
    'occasions.anniversaries.title': 'Anniversaries',
    'occasions.anniversaries.desc': 'Celebrate your journey together with a personalized musical keepsake.',
    'occasions.dance.title': 'Dance Competitions',
    'occasions.dance.desc': 'Stand out with an original track tailored to your choreography.',
    'occasions.retirements.title': 'Retirements',
    'occasions.retirements.desc': 'Honor a remarkable career with a personalized musical tribute.',
  },
  es: {
    'nav.about': 'Nosotros',
    'nav.packages': 'Paquetes',
    'nav.occasions': 'Ocasiones',
    'nav.gallery': 'Galería',
    'faq.title': 'Preguntas frecuentes y cómo funciona',
    'seo.home_desc': 'Canciones personalizadas, videos musicales cinematográficos y retratos únicos.',
    'seo.about_desc': 'Conoce a los creadores que convierten recuerdos personales en arte eterno.',
    'seo.packages_desc': 'Explora nuestros paquetes personalizados y precios para cada ocasión.',
    'occasions.main_desc': 'Descubre música y arte personalizados para cada celebración.',
    'gallery.desc': 'Explora nuestro portafolio de creaciones personalizadas.',
    'nav.faq_desc': 'Todo lo que necesitas saber sobre canciones, videos y regalos personalizados.',
    'q.share_desc': 'Comparte tu historia para comenzar una canción, video o retrato personalizado.',
    'q.page_title': 'Cuestionario',
    'reviews.page_title': 'Opiniones y testimonios de clientes - StoryMelody',
    'reviews.intro_desc': 'Lee opiniones de clientes que transformaron sus historias en música y arte.',
    'occasions.birthdays.title': 'Cumpleaños',
    'occasions.birthdays.desc': 'Celebra su personalidad y recuerdos con una canción personalizada inolvidable.',
    'occasions.weddings.title': 'Bodas',
    'occasions.weddings.desc': 'Cuenta tu historia de amor con una canción de boda personalizada.',
    'occasions.anniversaries.title': 'Aniversarios',
    'occasions.anniversaries.desc': 'Celebra vuestro camino juntos con un recuerdo musical personalizado.',
    'occasions.dance.title': 'Competiciones de baile',
    'occasions.dance.desc': 'Destaca con una canción original adaptada a tu coreografía.',
    'occasions.retirements.title': 'Jubilaciones',
    'occasions.retirements.desc': 'Honra una carrera extraordinaria con un homenaje musical personalizado.',
  },
  fr: {
    'nav.about': 'À propos',
    'nav.packages': 'Forfaits',
    'nav.occasions': 'Occasions',
    'nav.gallery': 'Galerie',
    'faq.title': 'FAQ et fonctionnement',
    'seo.home_desc': 'Chansons personnalisées, clips cinématographiques et portraits sur mesure.',
    'seo.about_desc': 'Découvrez les créateurs qui transforment vos souvenirs en œuvres intemporelles.',
    'seo.packages_desc': 'Découvrez nos forfaits personnalisés et nos tarifs pour chaque occasion.',
    'occasions.main_desc': 'Découvrez une musique et un art personnalisés pour chaque célébration.',
    'gallery.desc': 'Explorez notre galerie de créations personnalisées uniques.',
    'nav.faq_desc': 'Tout savoir sur les chansons, vidéos et cadeaux personnalisés.',
    'q.share_desc': 'Partagez votre histoire pour créer une chanson, une vidéo ou un portrait personnalisé.',
    'q.page_title': 'Questionnaire',
    'reviews.page_title': 'Avis et témoignages clients - StoryMelody',
    'reviews.intro_desc': 'Découvrez les avis de clients ayant transformé leurs histoires en musique et en art.',
    'occasions.birthdays.title': 'Anniversaires',
    'occasions.birthdays.desc': 'Célébrez sa personnalité et ses souvenirs avec une chanson unique.',
    'occasions.weddings.title': 'Mariages',
    'occasions.weddings.desc': 'Racontez votre histoire d’amour avec une chanson de mariage personnalisée.',
    'occasions.anniversaries.title': 'Anniversaires de mariage',
    'occasions.anniversaries.desc': 'Célébrez votre parcours avec un souvenir musical personnalisé.',
    'occasions.dance.title': 'Compétitions de danse',
    'occasions.dance.desc': 'Démarquez-vous avec un morceau original adapté à votre chorégraphie.',
    'occasions.retirements.title': 'Départs à la retraite',
    'occasions.retirements.desc': 'Honorez une belle carrière avec un hommage musical personnalisé.',
  },
  ru: {
    'nav.about': 'О нас',
    'nav.packages': 'Пакеты',
    'nav.occasions': 'Поводы',
    'nav.gallery': 'Галерея',
    'faq.title': 'Вопросы и как это работает',
    'seo.home_desc': 'Персональные песни, кинематографические видео и авторские портреты.',
    'seo.about_desc': 'Познакомьтесь с авторами, превращающими личные воспоминания в вечное искусство.',
    'seo.packages_desc': 'Выберите персональный пакет и стоимость для вашего события.',
    'occasions.main_desc': 'Персональная музыка и искусство для любого праздника.',
    'gallery.desc': 'Посмотрите галерею наших уникальных персональных проектов.',
    'nav.faq_desc': 'Всё о персональных песнях, видео и особенных подарках.',
    'q.share_desc': 'Поделитесь историей, чтобы начать создание персональной песни, видео или портрета.',
    'q.page_title': 'Анкета',
    'reviews.page_title': 'Отзывы клиентов - StoryMelody',
    'reviews.intro_desc': 'Читайте отзывы клиентов, превративших свои истории в музыку и искусство.',
    'occasions.birthdays.title': 'Дни рождения',
    'occasions.birthdays.desc': 'Подарите незабываемую песню о характере и дорогих воспоминаниях.',
    'occasions.weddings.title': 'Свадьбы',
    'occasions.weddings.desc': 'Расскажите вашу историю любви в персональной свадебной песне.',
    'occasions.anniversaries.title': 'Годовщины',
    'occasions.anniversaries.desc': 'Отпразднуйте совместный путь с персональным музыкальным подарком.',
    'occasions.dance.title': 'Танцевальные конкурсы',
    'occasions.dance.desc': 'Выделитесь с оригинальным треком, созданным для вашей хореографии.',
    'occasions.retirements.title': 'Выход на пенсию',
    'occasions.retirements.desc': 'Отметьте выдающуюся карьеру персональным музыкальным посвящением.',
  },
  it: {
    'nav.about': 'Chi siamo',
    'nav.packages': 'Pacchetti',
    'nav.occasions': 'Occasioni',
    'nav.gallery': 'Galleria',
    'faq.title': 'FAQ e come funziona',
    'seo.home_desc': 'Canzoni personalizzate, video musicali cinematografici e ritratti su misura.',
    'seo.about_desc': 'Conosci i creatori che trasformano i ricordi personali in arte senza tempo.',
    'seo.packages_desc': 'Scopri i nostri pacchetti personalizzati e i prezzi per ogni occasione.',
    'occasions.main_desc': 'Scopri musica e arte personalizzate per ogni celebrazione.',
    'gallery.desc': 'Esplora la nostra galleria di creazioni personalizzate.',
    'nav.faq_desc': 'Tutto ciò che serve sapere su canzoni, video e regali personalizzati.',
    'q.share_desc': 'Condividi la tua storia per creare una canzone, un video o un ritratto personalizzato.',
    'q.page_title': 'Questionario',
    'reviews.page_title': 'Recensioni e testimonianze - StoryMelody',
    'reviews.intro_desc': 'Leggi le recensioni di chi ha trasformato la propria storia in musica e arte.',
    'occasions.birthdays.title': 'Compleanni',
    'occasions.birthdays.desc': 'Celebra personalità e ricordi con una canzone personalizzata indimenticabile.',
    'occasions.weddings.title': 'Matrimoni',
    'occasions.weddings.desc': 'Racconta la vostra storia d’amore con una canzone di matrimonio personalizzata.',
    'occasions.anniversaries.title': 'Anniversari',
    'occasions.anniversaries.desc': 'Celebra il vostro cammino con un ricordo musicale personalizzato.',
    'occasions.dance.title': 'Gare di ballo',
    'occasions.dance.desc': 'Distinguiti con un brano originale creato per la tua coreografia.',
    'occasions.retirements.title': 'Pensionamenti',
    'occasions.retirements.desc': 'Onora una carriera straordinaria con un tributo musicale personalizzato.',
  },
  pl: {
    'nav.about': 'O nas',
    'nav.packages': 'Pakiety',
    'nav.occasions': 'Okazje',
    'nav.gallery': 'Galeria',
    'faq.title': 'FAQ i jak to działa',
    'seo.home_desc': 'Personalizowane piosenki, filmowe teledyski i portrety na zamówienie.',
    'seo.about_desc': 'Poznaj twórców, którzy zmieniają osobiste wspomnienia w ponadczasową sztukę.',
    'seo.packages_desc': 'Poznaj nasze personalizowane pakiety i ceny na każdą okazję.',
    'occasions.main_desc': 'Odkryj personalizowaną muzykę i sztukę na każdą uroczystość.',
    'gallery.desc': 'Zobacz galerię naszych wyjątkowych personalizowanych projektów.',
    'nav.faq_desc': 'Wszystko o personalizowanych piosenkach, filmach i prezentach.',
    'q.share_desc': 'Podziel się historią, aby stworzyć personalizowaną piosenkę, film lub portret.',
    'q.page_title': 'Kwestionariusz',
    'reviews.page_title': 'Opinie i referencje klientów - StoryMelody',
    'reviews.intro_desc': 'Przeczytaj opinie klientów, którzy zmienili swoje historie w muzykę i sztukę.',
    'occasions.birthdays.title': 'Urodziny',
    'occasions.birthdays.desc': 'Uczcij osobowość i wspomnienia niezapomnianą piosenką na zamówienie.',
    'occasions.weddings.title': 'Wesela',
    'occasions.weddings.desc': 'Opowiedz swoją historię miłosną w personalizowanej piosence ślubnej.',
    'occasions.anniversaries.title': 'Rocznice',
    'occasions.anniversaries.desc': 'Uczcijcie wspólną drogę wyjątkową muzyczną pamiątką.',
    'occasions.dance.title': 'Turnieje taneczne',
    'occasions.dance.desc': 'Wyróżnij się oryginalnym utworem dopasowanym do choreografii.',
    'occasions.retirements.title': 'Emerytury',
    'occasions.retirements.desc': 'Uhonoruj niezwykłą karierę personalizowanym muzycznym hołdem.',
  },
  de: {
    'nav.about': 'Über uns',
    'nav.packages': 'Pakete',
    'nav.occasions': 'Anlässe',
    'nav.gallery': 'Galerie',
    'faq.title': 'FAQ und Ablauf',
    'seo.home_desc': 'Personalisierte Songs, filmische Musikvideos und individuelle Porträts.',
    'seo.about_desc': 'Lernen Sie die Kreativen kennen, die Erinnerungen in zeitlose Kunst verwandeln.',
    'seo.packages_desc': 'Entdecken Sie unsere personalisierten Pakete und Preise für jeden Anlass.',
    'occasions.main_desc': 'Entdecken Sie personalisierte Musik und Kunst für jede Feier.',
    'gallery.desc': 'Entdecken Sie unsere Galerie einzigartiger personalisierter Kreationen.',
    'nav.faq_desc': 'Alles über personalisierte Songs, Videos und besondere Geschenke.',
    'q.share_desc': 'Teilen Sie Ihre Geschichte für einen persönlichen Song, ein Video oder Porträt.',
    'q.page_title': 'Fragebogen',
    'reviews.page_title': 'Kundenbewertungen und Erfahrungsberichte - StoryMelody',
    'reviews.intro_desc': 'Lesen Sie Bewertungen von Kunden, die ihre Geschichten in Musik und Kunst verwandelt haben.',
    'occasions.birthdays.title': 'Geburtstage',
    'occasions.birthdays.desc': 'Feiern Sie Persönlichkeit und Erinnerungen mit einem unvergesslichen Song.',
    'occasions.weddings.title': 'Hochzeiten',
    'occasions.weddings.desc': 'Erzählen Sie Ihre Liebesgeschichte mit einem persönlichen Hochzeitssong.',
    'occasions.anniversaries.title': 'Jahrestage',
    'occasions.anniversaries.desc': 'Feiern Sie Ihren gemeinsamen Weg mit einem musikalischen Erinnerungsstück.',
    'occasions.dance.title': 'Tanzwettbewerbe',
    'occasions.dance.desc': 'Heben Sie sich mit einem Song hervor, der zu Ihrer Choreografie passt.',
    'occasions.retirements.title': 'Ruhestand',
    'occasions.retirements.desc': 'Würdigen Sie eine besondere Karriere mit einem persönlichen Musiktribut.',
  },
};

const siteUrl = (
  process.env.NEXTAUTH_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://story-melody-studio.vercel.app'
).replace(/\/$/, '');

export function getLocale(value?: string | string[]): SupportedLocale {
  const locale = (Array.isArray(value) ? value[0] : value)?.toLowerCase();
  return supportedLocales.includes(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : 'en';
}

export async function getRequestLocale(value?: string | string[]) {
  const queryLocale = (Array.isArray(value) ? value[0] : value)?.toLowerCase();
  if (supportedLocales.includes(queryLocale as SupportedLocale)) {
    return queryLocale as SupportedLocale;
  }

  return getLocale((await cookies()).get('storymelody-language')?.value);
}

export function translate(locale: SupportedLocale, key: string, fallback: string) {
  return metadataTranslations[locale][key] || metadataTranslations.en[key] || fallback;
}

export function localizedUrl(path: string, locale: SupportedLocale) {
  const url = new URL(path, siteUrl);
  url.searchParams.set('lng', locale);
  return url.toString();
}

export function createLocalizedMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: SupportedLocale;
  path: string;
  title: string;
  description: string;
  image: string;
}): Metadata {
  const canonical = localizedUrl(path, locale);
  const imageUrl = new URL(image, siteUrl).toString();
  const languageAlternates = Object.fromEntries(
    supportedLocales.map((language) => [
      language,
      localizedUrl(path, language),
    ]),
  );
  const alternateLocales = supportedLocales
    .filter((language) => language !== locale)
    .map((language) => localeNames[language]);

  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        ...languageAlternates,
        'x-default': localizedUrl(path, 'en'),
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'StoryMelody Studio',
      title,
      description,
      url: canonical,
      locale: localeNames[locale],
      alternateLocale: alternateLocales,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export type MetadataSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;
