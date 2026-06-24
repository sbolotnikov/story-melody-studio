"use client";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import { useEffect } from "react";
import { ShareModal } from "../../../components/ShareModal";
import { EditorialHero } from "../../../components/EditorialHero";
const birthdayImg = "/images/birthday_hero.jpg";
const weddingImg = "/images/wedding_hero.jpg";
const anniversaryImg = "/images/anniversary_hero.jpg";
const danceImg = "/images/dance_hero.jpg";
const retirementImg = "/images/retirement_hero.jpg";

const occasionsKeys = ["birthdays", "weddings", "anniversaries", "dance", "retirements"];

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
    <div className="grow flex w-full flex-col">
      <EditorialHero
        imageSrc={imageMap[id]}
        imageAlt={t(`occasions.${id}.title`)}
        eyebrow={t('nav.occasions')}
        title={t(`occasions.${id}.title`)}
        description={t(`occasions.${id}.desc`)}
        fullHeight
        imageClassName="object-cover object-[68%_center] lg:object-center"
        railWidthClassName="lg:w-[58%]"
        contentWidthClassName="lg:max-w-[52%]"
        actions={
          <>
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
          </>
        }
        detail={
          <span className="flex items-center gap-3">
            <Link href="/occasions" className="hover:text-brand-gold transition-colors">
              {t('occasions.back')}
            </Link>
          </span>
        }
      />
    </div>
  );
}
