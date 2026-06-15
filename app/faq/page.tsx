'use client';
import { useTranslation } from "react-i18next";
import  Link  from "next/link";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, MessageSquare, CreditCard, Palette, PenTool, Gift, Users } from "lucide-react";

export default function FAQ() {
  const { t } = useTranslation();

  const journeySteps = [
    {
      icon: <PenTool className="w-6 h-6 text-brand-gold" />,
      title: t("faq.journey.step1.title"),
      desc: t("faq.journey.step1.desc"),
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-brand-gold" />,
      title: t("faq.journey.step2.title"),
      desc: t("faq.journey.step2.desc"),
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-brand-gold" />,
      title: t("faq.journey.step3.title"),
      desc: t("faq.journey.step3.desc"),
    },
    {
      icon: <CreditCard className="w-6 h-6 text-brand-gold" />,
      title: t("faq.journey.step4.title"),
      desc: t("faq.journey.step4.desc"),
    },
    {
      icon: <CreditCard className="w-6 h-6 text-brand-gold" />,
      title: t("faq.journey.step5.title"),
      desc: t("faq.journey.step5.desc"),
    },
    {
      icon: <Palette className="w-6 h-6 text-brand-gold" />,
      title: t("faq.journey.step6.title"),
      desc: t("faq.journey.step6.desc"),
    },
    {
      icon: <Users className="w-6 h-6 text-brand-gold" />,
      title: t("faq.journey.step7.title"),
      desc: t("faq.journey.step7.desc"),
    },
    {
      icon: <Gift className="w-6 h-6 text-brand-gold" />,
      title: t("faq.journey.step8.title"),
      desc: t("faq.journey.step8.desc"),
    }
  ];

  const faqCategories = [
    {
      name: t("faq.cat.general"),
      questions: [
        { q: t("faq.q.what_is"), a: t("faq.a.what_is") },
        { q: t("faq.q.how_works"), a: t("faq.a.how_works") },
        { q: t("faq.q.lyrics"), a: t("faq.a.lyrics") },
        { q: t("faq.q.ai"), a: t("faq.a.ai") },
      ]
    },
    {
      name: t("faq.cat.songs"),
      questions: [
        { q: t("faq.q.song_types"), a: t("faq.a.song_types") },
        { q: t("faq.q.specific_people"), a: t("faq.a.specific_people") },
        { q: t("faq.q.names"), a: t("faq.a.names") },
        { q: t("faq.q.style"), a: t("faq.a.style") },
        { q: t("faq.q.funny"), a: t("faq.a.funny") },
        { q: t("faq.q.emotional"), a: t("faq.a.emotional") },
        { q: t("faq.q.languages"), a: t("faq.a.languages") },
        { q: t("faq.q.other_language"), a: t("faq.a.other_language") },
        { q: t("faq.q.length"), a: t("faq.a.length") },
        { q: t("faq.q.receive_lyrics"), a: t("faq.a.receive_lyrics") },
      ]
    },
    {
      name: t("faq.cat.videos"),
      questions: [
        { q: t("faq.q.video_types"), a: t("faq.a.video_types") },
        { q: t("faq.q.use_photos"), a: t("faq.a.use_photos") },
        { q: t("faq.q.old_photos"), a: t("faq.a.old_photos") },
        { q: t("faq.q.upload_videos"), a: t("faq.a.upload_videos") },
        { q: t("faq.q.animate_people"), a: t("faq.a.animate_people") },
        { q: t("faq.q.video_lyrics"), a: t("faq.a.video_lyrics") },
        { q: t("faq.q.video_formats"), a: t("faq.a.video_formats") },
      ]
    },
    {
      name: t("faq.cat.portraits"),
      questions: [
        { q: t("faq.q.portrait_styles"), a: t("faq.a.portrait_styles") },
        { q: t("faq.q.character_sheet"), a: t("faq.a.character_sheet") },
        { q: t("faq.q.portrait_old_photos"), a: t("faq.a.portrait_old_photos") },
      ]
    },
    {
      name: t("faq.cat.ordering"),
      questions: [
        { q: t("faq.q.info_needed"), a: t("faq.a.info_needed") },
        { q: t("faq.q.no_details"), a: t("faq.a.no_details") },
        { q: t("faq.q.save_progress"), a: t("faq.a.save_progress") },
        { q: t("faq.q.google_drive"), a: t("faq.a.google_drive") },
        { q: t("faq.q.links_only"), a: t("faq.a.links_only") },
        { q: t("faq.q.contact_me"), a: t("faq.a.contact_me") },
        { q: t("faq.q.why_contact"), a: t("faq.a.why_contact") },
        { q: t("faq.q.pay_immediately"), a: t("faq.a.pay_immediately") },
        { q: t("faq.q.invoice"), a: t("faq.a.invoice") },
        { q: t("faq.q.phone_call"), a: t("faq.a.phone_call") },
        { q: t("faq.q.rough_idea"), a: t("faq.a.rough_idea") },
        { q: t("faq.q.custom"), a: t("faq.a.custom") },
        { q: t("faq.q.great_project"), a: t("faq.a.great_project") }
      ]
    },
    {
      name: t("faq.cat.delivery"),
      questions: [
        { q: t("faq.q.how_long"), a: t("faq.a.how_long") },
        { q: t("faq.q.changes"), a: t("faq.a.changes") },
        { q: t("faq.q.factual_mistake"), a: t("faq.a.factual_mistake") },
        { q: t("faq.q.rush"), a: t("faq.a.rush") },
      ]
    },
    {
      name: t("faq.cat.privacy"),
      questions: [
        { q: t("faq.q.private"), a: t("faq.a.private") },
        { q: t("faq.q.permission"), a: t("faq.a.permission") },
        { q: t("faq.q.public"), a: t("faq.a.public") },
        { q: t("faq.q.completely_private"), a: t("faq.a.completely_private") },
      ]
    },
    {
      name: t("faq.cat.accessibility"),
      questions: [
        { q: t("faq.q.accessible"), a: t("faq.a.accessible") },
        { q: t("faq.q.dark_mode"), a: t("faq.a.dark_mode") },
        { q: t("faq.q.phone"), a: t("faq.a.phone") },
      ]
    },
    {
      name: t("faq.cat.special"),
      questions: [
        { q: t("faq.q.dance"), a: t("faq.a.dance") },
        { q: t("faq.q.legacy"), a: t("faq.a.legacy") },
        { q: t("faq.q.unique_idea"), a: t("faq.a.unique_idea") },
      ]
    }
  ];

  return (
    <div className="grow bg-background">
      <Helmet>
        <title>{t("faq.title")} - StoryMelody</title>
        <meta name="description" content={t("faq.title")} />
        <meta property="og:title" content={`${t("faq.title")} - StoryMelody`} />
        <meta property="og:description" content={t("faq.title")} />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-display font-medium text-foreground tracking-tight">
            {t("faq.title")}
          </h1>
          <p className="text-xl text-muted-fg max-w-2xl mx-auto leading-relaxed">
            {t("nav.faq_desc")}
          </p>
        </div>
      </section>

      {/* Client Journey */}
      <section className="py-20 px-4 border-t border-border bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-medium text-foreground tracking-tight">
              {t("faq.journey.title")}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 relative">
            {journeySteps.map((step, index) => (
              <div key={index} className="bg-muted/30 p-8 border border-border flex flex-col gap-4">
                <div className="flex items-center gap-4">
                   <div className="bg-brand-gold/10 p-3 rounded-full shrink-0">
                      {step.icon}
                   </div>
                   <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
                </div>
                <p className="text-muted-fg leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/questionnaire" className="inline-flex items-center justify-center bg-brand-gold text-brand-black hover:bg-brand-gold/90 text-lg px-8 py-6 rounded-none font-medium transition-colors">
                 {t("action.start")}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 border-t border-border bg-muted/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-medium text-foreground tracking-tight">
              {t("faq.faq.title")}
            </h2>
          </div>

          <div className="space-y-12">
            {faqCategories.map((category, catIndex) => (
              <div key={catIndex}>
                <h3 className="text-2xl font-medium text-foreground mb-6 font-display">{category.name}</h3>
                <div className="w-full space-y-4">
                  {category.questions.map((item, qIndex) => (
                    <details key={qIndex} className="border border-border bg-background px-6 group marker:content-['']">
                      <summary className="text-left font-medium text-foreground hover:text-brand-gold py-6 cursor-pointer flex items-center justify-between outline-none">
                        {item.q}
                        <span className="text-brand-gold group-open:rotate-180 transition-transform duration-200">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </span>
                      </summary>
                      <div className="text-muted-fg leading-relaxed pb-6 text-sm">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
