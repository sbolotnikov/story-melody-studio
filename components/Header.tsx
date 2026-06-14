'use client';
import { Moon, Sun, ChevronDown, User, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";

const logoImg = "/images/storymelody_logo_1780521281759.png";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const { user, profile, logout = () => {} } = useAuth() ?? {};
  const currentAvatarSrc = user?.image || profile?.image;
  const [avatarBroken, setAvatarBroken] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'ru', label: 'Русский' },
    { code: 'it', label: 'Italiano' },
    { code: 'pl', label: 'Polski' },
    { code: 'de', label: 'Deutsch' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/90 border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image src={logoImg} alt="StoryMelody Logo" width={40} height={40} className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform hidden lg:block" />
              <div className="flex flex-col justify-center">
                <span className="font-serif text-lg sm:text-xl font-bold leading-none tracking-tight text-foreground">
                  Story<span className="text-brand-gold">Melody</span>
                </span>
                <span className="text-[0.55rem] sm:text-[0.65rem] font-sans font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-muted-fg mt-0.5 sm:mt-1">
                  Studio
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 justify-center items-center gap-4 lg:gap-8 text-[10px] lg:text-xs font-semibold uppercase tracking-widest text-muted-fg px-4">
            <Link href="/packages" className="hover:text-foreground transition-colors">{t('nav.packages')}</Link>
            <Link href="/occasions" className="hover:text-foreground transition-colors">{t('nav.occasions')}</Link>
            <Link href="/gallery" className="hover:text-foreground transition-colors">{t('nav.gallery')}</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">{t('nav.about')}</Link>
            <Link href="/faq" className="hover:text-foreground transition-colors">{t('nav.faq')}</Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-6 shrink-0">
            <div className="relative" ref={langMenuRef}>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 text-[10px] lg:text-xs font-semibold uppercase tracking-widest text-muted-fg hover:text-foreground transition-colors"
                aria-label="Select language"
              >
                <span>{currentLang.code}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-4 w-32 bg-background border border-border shadow-soft py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`block w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-muted transition-colors ${
                        i18n.language === lang.code ? "text-brand-gold" : "text-foreground"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative" ref={userMenuRef}>
              <Link
                href={user ? "#" : "/auth"}
                onClick={(e) => {
                  if (user) {
                    e.preventDefault();
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }
                }}
                className="p-1 text-muted-fg hover:text-foreground transition-colors rounded-full block"
                aria-label="User menu"
              >
                {/* Prefer rendering a circular avatar img when available; fall back to the User icon */}
                { (user?.image || profile?.image) && !avatarBroken ? (
                  <img
                    src={user?.image || profile?.image}
                    alt={user?.email || 'User avatar'}
                    onError={() => setAvatarBroken(true)}
                    className="w-8 h-8 rounded-full object-cover inline-block"
                  />
                ) : (
                  <User className="h-4 w-4" />
                ) }
              </Link>
              
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-4 w-48 bg-background border border-border shadow-soft py-1 z-50">
                  <div className="px-4 py-3 border-b border-border mb-1">
                    <p className="text-xs font-semibold truncate">{user.email}</p>
                    {profile?.role === 'admin' && (
                      <p className="text-[10px] uppercase tracking-wider text-brand-gold mt-1">Admin</p>
                    )}
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-muted transition-colors text-foreground"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-muted transition-colors text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 text-muted-fg hover:text-foreground transition-colors rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <Link
              href="/questionnaire"
              className="hidden sm:inline-flex items-center justify-center border border-brand-gold bg-transparent text-brand-gold px-3 py-2 lg:px-6 lg:py-3 text-[10px] lg:text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold hover:text-background transition-colors whitespace-nowrap"
            >
              {t('action.start')}
            </Link>
            
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-muted-fg hover:text-foreground transition-colors rounded-full"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 h-screen w-[80vw] max-w-sm bg-background border-l border-border shadow-2xl z-50 p-6 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col justify-center">
                  <span className="font-serif text-lg font-bold leading-none tracking-tight text-foreground">
                    Story<span className="text-brand-gold">Melody</span>
                  </span>
                  <span className="text-[0.55rem] font-sans font-semibold uppercase tracking-[0.25em] text-muted-fg mt-0.5">
                    Studio
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-muted-fg hover:text-foreground transition-colors rounded-full -mr-2"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-6 mt-7 text-sm font-semibold uppercase tracking-widest text-muted-fg">
                <Link href="/packages" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors block">{t('nav.packages')}</Link>
                <Link href="/occasions" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors block">{t('nav.occasions')}</Link>
                <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors block">{t('nav.gallery')}</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors block">{t('nav.about')}</Link>
                <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground transition-colors block">{t('nav.faq')}</Link>
                <Link
                  href="/questionnaire"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center border border-brand-gold bg-transparent text-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold hover:text-background transition-colors w-full mt-4"
                >
                  {t('action.start')}
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
