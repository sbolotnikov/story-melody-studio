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
  railWidthClassName = 'lg:w-[52%]',
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
        className={`absolute inset-y-0 left-0 hidden lg:block ${railWidthClassName}`}
        style={{
          background:
            'linear-gradient(90deg, var(--bg-color) 0%, color-mix(in srgb, var(--bg-color) 96%, transparent) 58%, color-mix(in srgb, var(--bg-color) 72%, transparent) 74%, color-mix(in srgb, var(--bg-color) 30%, transparent) 88%, transparent 100%)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14 lg:items-center lg:px-8 lg:py-12">
        <div
          className={`relative w-full overflow-hidden rounded-[2rem] border border-white/15 bg-background/48 px-6 py-8 text-left shadow-2xl backdrop-blur-2xl sm:rounded-[2.5rem] sm:px-9 sm:py-10 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pr-12 lg:shadow-none lg:backdrop-blur-none ${contentWidthClassName}`}
        >
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
            <span className="h-px w-14 shrink-0 bg-[#8a641f] shadow-[0_1px_2px_rgba(255,255,255,0.45)] dark:bg-[#e2bd73] dark:shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#765313] drop-shadow-[0_1px_1px_rgba(255,255,255,0.75)] dark:text-[#f0cb80] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
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
