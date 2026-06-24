'use client';
import { useTranslation } from "react-i18next";
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { ShareModal } from "../../components/ShareModal";
import { EditorialHero } from "../../components/EditorialHero";
const occasionsImg = '/images/occasions_sm.jpg';
const birthdayImg = "/images/birthday_hero_1780580660623.png";
const weddingImg = "/images/wedding_hero_1780580674632.png";
const anniversaryImg = "/images/anniversary_hero_1780580687961.png";
const danceImg = "/images/dance_hero_1780580701564.png";
const retirementImg = "/images/retirement_hero_1780580714256.png";

const occasionsKeys = ["birthdays", "weddings", "anniversaries", "dance", "retirements"];

type ImageType = string | StaticImageData;
const imageMap: Record<string, ImageType> = {
  birthdays: birthdayImg,
  weddings: weddingImg,
  anniversaries: anniversaryImg,
  dance: danceImg,
  retirements: retirementImg,
};

export default function OccasionsList() {
  const { t } = useTranslation();

  return (
    <div className="grow flex w-full flex-col">
      <EditorialHero
        imageSrc={occasionsImg}
        imageAlt={t('occasions.birthdays.title')}
        eyebrow={t('occasions.explore')}
        title={t('nav.occasions')}
        description={t('occasions.main_desc')}
        imageClassName="object-cover object-[68%_center] lg:object-center"
        actions={
          <ShareModal
            title={`${t('nav.occasions')} | StoryMelody Studio`}
            description={t('occasions.main_desc')}
            imageSrc={occasionsImg}
            className="border-brand-gold/50 bg-background/45 backdrop-blur-sm"
          />
        }
        detail={t('hero.badge')}
      />

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {occasionsKeys.map((occId) => (
            <Link
              key={occId}
              href={`/occasions/${occId}`}
              className="group block border border-border bg-background hover:border-brand-gold transition-colors overflow-hidden"
            >
              <div className="aspect-4/3 bg-muted relative overflow-hidden">
                <Image
                  src={imageMap[occId]}
                  alt={t(`occasions.${occId}.title`)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-brand-gold transition-colors">{t(`occasions.${occId}.title`)}</h3>
                <p className="text-sm text-muted-fg line-clamp-3">
                  {t(`occasions.${occId}.desc`)}
                </p>
                <div className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-gold flex items-center">
                  {t('occasions.explore')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
