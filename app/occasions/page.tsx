'use client';
import { useTranslation } from "react-i18next";
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import birthdayImg from "../../assets/images/birthday_hero_1780580660623.png";
import weddingImg from "../../assets/images/wedding_hero_1780580674632.png";
import anniversaryImg from "../../assets/images/anniversary_hero_1780580687961.png";
import danceImg from "../../assets/images/dance_hero_1780580701564.png";
import retirementImg from "../../assets/images/retirement_hero_1780580714256.png";

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
    <div className="grow flex flex-col py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">{t('nav.occasions')}</h1>
        <p className="text-lg text-muted-fg">
          {t('occasions.main_desc')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </div>
  );
}
