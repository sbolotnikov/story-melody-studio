"use client";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import { useEffect } from "react";
import Image, { StaticImageData } from 'next/image';
import { ShareModal } from "../../../components/ShareModal";
const birthdayImg = "/images/birthday_hero.jpg";
const weddingImg = "/images/wedding_hero.jpg";
const anniversaryImg = "/images/anniversary_hero.jpg";
const danceImg = "/images/dance_hero.jpg";
const retirementImg = "/images/retirement_hero.jpg";

const occasionsKeys = ["birthdays", "weddings", "anniversaries", "dance", "retirements"];

// Use a flexible type for imported images to avoid StaticImageData type errors
type ImageType = string | StaticImageData;
const imageMap: Record<string, string> = {
  birthdays: birthdayImg,
  weddings: weddingImg,
  anniversaries: anniversaryImg,
  dance: danceImg,
  retirements: retirementImg,
};

export default function OccasionDetail() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  useEffect(() => {
    if (!id || !occasionsKeys.includes(id)) {
      router.replace("/occasions");
      return;
    }
    if (id && occasionsKeys.includes(id)) {
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language, id, router]);

  if (!id || !occasionsKeys.includes(id)) {
    return null;
  }

  return (
    <div className="grow flex flex-col pt-16 pb-24 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl lg:text-6xl font-serif font-bold leading-tight">{t(`occasions.${id}.title`)}</h1>
          <p className="text-lg text-muted-fg leading-relaxed">
            {t(`occasions.${id}.desc`)}
          </p>
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href={`/questionnaire?projectType=${id}`}
              className="inline-flex items-center justify-center border border-brand-gold bg-brand-gold text-brand-dark px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-brand-gold/90 transition-colors shadow-sm"
            >
              {t('action.start')}
            </Link>
            <ShareModal
              title={`${t(`occasions.${id}.title`)} | ${t('nav.occasions')} | StoryMelody Studio`}
              description={t(`occasions.${id}.desc`)}
              imageSrc={imageMap[id]}
              buttonLabel={t('action.share')}
              className="py-4 text-sm"
            />
          </div>
          <div className="pt-8 flex items-center gap-4 text-sm font-semibold uppercase tracking-widest text-muted-fg">
            <Link href="/occasions" className="hover:text-brand-gold transition-colors">
              {t('occasions.back')}
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-4/3 sm:aspect-video lg:aspect-square relative overflow-hidden bg-muted">
            <Image
              src={imageMap[id!] as ImageType}
              alt={t(`occasions.${id}.title`)}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 border border-border/20 z-10 pointer-events-none mix-blend-overlay"></div>
          </div>
          {/* Decal */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 border border-brand-gold bg-background flex flex-col justify-center items-center z-20">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-muted-fg leading-tight text-center">Story<br/>Melody<br/>Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
