import Image from 'next/image';
import type { ReactNode } from 'react';

interface EditorialHeroProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  detail?: ReactNode;
  fullHeight?: boolean;
  imageClassName?: string;
  railWidthClassName?: string;
  contentWidthClassName?: string;
}

export function EditorialHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  actions,
  detail,
  fullHeight = false,
  imageClassName = 'object-cover object-center',
  railWidthClassName = 'lg:w-[56%]',
  contentWidthClassName = 'lg:max-w-[50%]',
}: EditorialHeroProps) {
  return (
    <section
      className={`relative isolate flex w-full items-end overflow-hidden lg:items-stretch ${
        fullHeight
          ? 'min-h-[calc(100svh-5rem)]'
          : 'min-h-145 lg:min-h-[68svh] xl:min-h-[72svh]'
      }`}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className={imageClassName}
      />

      <div className="absolute inset-0 bg-linear-to-t from-background via-background/5 to-black/10 lg:bg-linear-to-r lg:from-background/40 lg:via-transparent lg:to-black/10" />

      <div
        className={`absolute inset-y-0 left-0 hidden border-r border-brand-gold/30 bg-background/76 backdrop-blur-md lg:block ${railWidthClassName}`}
        style={{
          clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)',
        }}
      />
      <div
        className={`absolute inset-y-0 left-0 hidden bg-linear-to-r from-brand-gold/8 via-transparent to-brand-gold/12 lg:block ${railWidthClassName}`}
        style={{
          clipPath: 'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14 lg:items-center lg:px-8 lg:py-12">
        <div
          className={`relative w-full bg-background/84 px-6 py-8 text-left backdrop-blur-xl sm:px-9 sm:py-10 lg:bg-transparent lg:p-0 lg:pr-12 lg:backdrop-blur-none ${contentWidthClassName}`}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-brand-gold via-brand-gold/50 to-transparent lg:hidden" />

          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-14 shrink-0 bg-brand-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
              {eyebrow}
            </p>
          </div>

          <h1 className="font-serif text-5xl font-bold leading-[0.94] sm:text-6xl lg:text-7xl xl:text-8xl">
            {title}
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            {description}
          </p>

          {(actions || detail) && (
            <div className="mt-9 flex flex-wrap items-center gap-5">
              {actions}
              {detail && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-fg">
                  {detail}
                </span>
              )}
            </div>
          )}

          <div className="absolute -bottom-12 left-6 hidden h-12 w-px bg-linear-to-b from-brand-gold/70 to-transparent lg:block" />
        </div>
      </div>
    </section>
  );
}
