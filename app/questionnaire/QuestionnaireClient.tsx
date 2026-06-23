'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShareModal } from '../../components/ShareModal';
const shareImage = '/images/storymelody_hero.jpg';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

type FormValue = string | number | boolean | null | undefined | FileList;
type FormState = Record<string, FormValue>;

type StepOption = { label: string; value: string };
type StepType = 'radio' | 'text' | 'date' | 'textarea' | 'select' | 'file';
type Step = {
  id: string;
  title: string;
  type: StepType;
  placeholder?: string;
  options?: StepOption[];
};

const getSteps = (t: TFunction): Step[] => [
  {
    id: 'projectType',
    title: t('q.projectType.title'),
    type: 'radio',
    options: [
      { label: t('q.projectType.opt1'), value: 'Song Only' },
      { label: t('q.projectType.opt2'), value: 'Song + Video' },
      {
        label: t('q.projectType.opt3'),
        value: 'Legacy Film (Song + Video + Portrait)',
      },
    ],
  },
  {
    id: 'occasion',
    title: t('q.occasion.title'),
    type: 'text',
    placeholder: t('q.occasion.placeholder'),
  },
  { id: 'date', title: t('q.date.title'), type: 'date' },
  {
    id: 'language',
    title: t('q.language.title'),
    type: 'select',
    options: [
      { label: t('q.language.opt1'), value: 'English' },
      { label: t('q.language.opt2'), value: 'Russian' },
      { label: t('q.language.opt3'), value: 'Italian' },
      { label: t('q.language.opt4'), value: 'Polish' },
      { label: t('q.language.opt5'), value: 'German' },
      { label: t('q.language.opt6'), value: 'French' },
      { label: t('q.language.opt_other'), value: 'Other' },
    ],
  },
  {
    id: 'hero',
    title: t('q.hero.title'),
    type: 'textarea',
    placeholder: t('q.hero.placeholder'),
  },
  {
    id: 'story',
    title: t('q.story.title'),
    type: 'textarea',
    placeholder: t('q.story.placeholder'),
  },
  {
    id: 'personality',
    title: t('q.personality.title'),
    type: 'textarea',
    placeholder: t('q.personality.placeholder'),
  },
  {
    id: 'hobbies',
    title: t('q.hobbies.title'),
    type: 'textarea',
    placeholder: t('q.hobbies.placeholder'),
  },
  {
    id: 'people',
    title: t('q.people.title'),
    type: 'textarea',
    placeholder: t('q.people.placeholder'),
  },
  {
    id: 'achievements',
    title: t('q.achievements.title'),
    type: 'textarea',
    placeholder: t('q.achievements.placeholder'),
  },
  {
    id: 'tone',
    title: t('q.tone.title'),
    type: 'radio',
    options: [
      { label: t('q.tone.opt1'), value: 'Emotional & Touching' },
      { label: t('q.tone.opt2'), value: 'Funny & Lighthearted' },
      { label: t('q.tone.opt3'), value: 'Epic & Cinematic' },
      { label: t('q.tone.opt4'), value: 'Romantic' },
    ],
  },
  {
    id: 'musicStyle',
    title: t('q.musicStyle.title'),
    type: 'text',
    placeholder: t('q.musicStyle.placeholder'),
  },
  {
    id: 'structure',
    title: t('q.structure.title'),
    type: 'radio',
    options: [
      { label: t('q.structure.opt1'), value: 'Standard (Verse-Chorus)' },
      {
        label: t('q.structure.opt2'),
        value: 'Storytelling (No repetitive chorus)',
      },
      { label: t('q.structure.opt3'), value: 'Uptempo dance track' },
    ],
  },
  {
    id: 'exclusions',
    title: t('q.exclusions.title'),
    type: 'textarea',
    placeholder: t('q.exclusions.placeholder'),
  },
  { id: 'materials', title: t('q.materials.title'), type: 'file' },
  {
    id: 'videoOpts',
    title: t('q.videoOpts.title'),
    type: 'textarea',
    placeholder: t('q.videoOpts.placeholder'),
  },
  {
    id: 'portraitOpts',
    title: t('q.portraitOpts.title'),
    type: 'textarea',
    placeholder: t('q.portraitOpts.placeholder'),
  },
];

export default function Questionnaire() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingOrder, setIsLoadingOrder] = useState(!!orderId);
  const router = useRouter();
  const auth = useAuth();
  const { user, profile } = auth ?? {};
  const { t } = useTranslation();
  const STEPS = getSteps(t);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          const parsedAnswers = data.answersData
            ? JSON.parse(data.answersData)
            : {};
          setFormData({ ...data, ...parsedAnswers });
        } else {
          setErrorMsg('Order not found.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleNext = async (isNew = false) => {
    if (currentStepIndex === STEPS.length - 1) {
      if (!user && !formData.phone) {
        setErrorMsg(t('q.req_phone'));
        return;
      }
      setIsSubmitting(true);
      setErrorMsg('');
      try {
        const standardFields = [
          'projectType',
          'occasion',
          'date',
          'language',
          'email',
          'phone',
          'status',
          'paid',
          'archived',
          'id',
          'userId',
          'createdAt',
          'updatedAt',
        ];
        const answersDataObj: Record<string, FormValue> = {};
        const payload: Record<string, FormValue> = {};

        for (const [key, value] of Object.entries(formData)) {
          if (standardFields.includes(key)) {
            payload[key] = value;
          } else {
            answersDataObj[key] = value;
          }
        }

        payload.answersData = JSON.stringify(answersDataObj);

        if (orderId && !isNew) {
          payload.id = orderId;
        }

        if (user) {
          payload.userId = user.id;
          if (!payload.email) payload.email = user.email || '';
          if (!payload.phone) payload.phone = profile?.phone || '';
        }

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Failed to save order');
        setCurrentStepIndex((prev) => prev + 1);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStepIndex < STEPS.length) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const updateField = (id: string, value: FormValue) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isCompleted = currentStepIndex === STEPS.length;
  const progress = isCompleted
    ? 100
    : Math.round((currentStepIndex / STEPS.length) * 100);

  if (isLoadingOrder) {
    return (
      <div className="grow flex items-center justify-center py-24 px-4 bg-background">
        <div className="text-muted-fg font-semibold uppercase tracking-widest text-sm">
          Loading Order...
        </div>
      </div>
    );
  }

  const renderStep = () => {
    if (isCompleted) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 bg-brand-gold text-brand-dark rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Check size={40} />
          </div>
          <h2 className="text-4xl font-serif font-bold mb-4">
            {t('q.all_set')}
          </h2>
          <p className="text-lg text-muted-fg mb-8 max-w-lg mx-auto">
            {t('q.all_set_desc')}
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center rounded-none bg-brand-gold px-8 py-4 text-xs font-bold text-brand-dark transition-all hover:bg-brand-gold/90 uppercase tracking-widest"
          >
            {t('q.return_home')}
          </button>
        </motion.div>
      );
    }

    const step = STEPS[currentStepIndex];

    return (
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="mb-2 text-brand-gold text-xs font-semibold uppercase tracking-widest">
          {t('q.step')} {currentStepIndex + 1} {t('q.of')} {STEPS.length}
        </div>
        <h2 className="text-3xl font-serif font-bold mb-8">{step.title}</h2>

        {step.type === 'radio' && (
          <div className="space-y-4">
            {step.options?.map((opt: StepOption) => (
              <label
                key={opt.value}
                className={`flex items-center p-6 border cursor-pointer transition-colors ${
                  formData[step.id] === opt.value
                    ? 'border-brand-gold bg-brand-gold/5'
                    : 'border-border bg-background hover:border-brand-gold/50'
                }`}
              >
                <input
                  type="radio"
                  name={step.id}
                  value={opt.value}
                  checked={formData[step.id] === opt.value}
                  onChange={(e) => updateField(step.id, e.target.value)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${
                    formData[step.id] === opt.value
                      ? 'border-brand-gold'
                      : 'border-muted-fg'
                  }`}
                >
                  {formData[step.id] === opt.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                  )}
                </div>
                <span className="font-medium text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {step.type === 'text' && (
          <input
            type="text"
            value={String(formData[step.id] ?? '')}
            onChange={(e) => updateField(step.id, e.target.value)}
            placeholder={step.placeholder}
            className="w-full p-4 bg-background border border-border text-foreground focus:outline-none focus:border-brand-gold transition-colors"
          />
        )}

        {step.type === 'date' && (
          <input
            type="date"
            value={String(formData[step.id] ?? '')}
            onChange={(e) => updateField(step.id, e.target.value)}
            className="w-full p-4 bg-background border border-border text-foreground focus:outline-none focus:border-brand-gold transition-colors"
          />
        )}

        {step.type === 'textarea' && (
          <textarea
            value={String(formData[step.id] ?? '')}
            onChange={(e) => updateField(step.id, e.target.value)}
            placeholder={step.placeholder}
            rows={6}
            className="w-full p-4 bg-background border border-border text-foreground focus:outline-none focus:border-brand-gold transition-colors resize-y"
          />
        )}

        {step.type === 'select' && (
          <select
            value={typeof formData[step.id] === 'string' ? (formData[step.id] as string) : ''}
            onChange={(e) => updateField(step.id, e.target.value)}
            className="w-full p-4 bg-background border border-border text-foreground focus:outline-none focus:border-brand-gold transition-colors appearance-none"
          >
            <option value="" disabled>
              Select an option
            </option>
            {step.options?.map((opt: StepOption) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {step.type === 'file' && (
          <div className="border-2 border-dashed border-border p-12 text-center hover:border-brand-gold/50 transition-colors cursor-pointer flex flex-col items-center">
            <Upload className="w-10 h-10 text-brand-gold mb-4" />
            <p className="text-foreground font-medium mb-2">
              Click to upload or drag & drop
            </p>
            <p className="text-sm text-muted-fg">
              ZIP, JPEG, PNG, MP4 (Max. 500MB)
            </p>
            <input type="file" multiple className="hidden" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="grow flex flex-col pt-16 pb-24 px-4 bg-muted/30">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl mx-auto mb-16 relative">
        <div className="h-1 bg-border w-full absolute top-1/2 -translate-y-1/2 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gold transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto grow flex flex-col justify-between min-h-125 border border-border bg-background p-8 md:p-16 shadow-2xl relative">
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10 flex gap-4">
          {orderId && user && (
            <Link
              href="/dashboard"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-muted-fg hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          )}
        </div>
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10">
          <ShareModal
            title="Share the Questionnaire"
            description="Working on a gift together? Share this questionnaire with your family or friends to gather stories."
            imageSrc={shareImage}
          />
        </div>
        <div className="grow pt-10 sm:pt-0">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {!isCompleted && (
          <div className="pt-12 mt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0 || isSubmitting}
              className={`inline-flex items-center px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-colors ${
                currentStepIndex === 0 || isSubmitting
                  ? 'opacity-30 cursor-not-allowed text-muted-fg'
                  : 'text-foreground hover:text-brand-gold'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('q.btn_back')}
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {errorMsg && (
                <div className="text-red-500 flex items-center text-xs font-semibold uppercase tracking-widest">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errorMsg}
                </div>
              )}

              {!user && currentStepIndex === STEPS.length - 1 ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="tel"
                    placeholder="Phone number to save"
                    value={typeof formData.phone === 'string' ? formData.phone : ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="p-3 border border-border text-xs bg-background focus:outline-none focus:border-brand-gold w-48"
                  />
                  <span className="text-muted-fg text-xs font-semibold uppercase">
                    OR
                  </span>
                  <Link
                    href="/auth"
                    className="inline-flex items-center justify-center rounded-none border border-brand-gold text-brand-gold px-8 py-3 text-xs font-bold transition-all hover:bg-brand-gold hover:text-brand-dark uppercase tracking-widest"
                  >
                    Sign In
                  </Link>
                </div>
              ) : null}

              {currentStepIndex === STEPS.length - 1 && orderId ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => handleNext(false)}
                    disabled={isSubmitting}
                    className={`inline-flex items-center justify-center rounded-none bg-brand-gold px-8 py-3 text-xs font-bold text-brand-dark transition-all uppercase tracking-widest ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-gold/90'}`}
                  >
                    {isSubmitting ? t('q.btn_saving') : t('q.btn_update')}
                  </button>
                  <button
                    onClick={() => handleNext(true)}
                    disabled={isSubmitting}
                    className={`inline-flex items-center justify-center rounded-none border border-brand-gold text-brand-gold px-8 py-3 text-xs font-bold transition-all uppercase tracking-widest ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-gold hover:text-brand-dark'}`}
                  >
                    {isSubmitting ? t('q.btn_saving') : t('q.btn_save_new')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNext(false)}
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center rounded-none bg-brand-gold px-8 py-3 text-xs font-bold text-brand-dark transition-all uppercase tracking-widest ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-gold/90'}`}
                >
                  {isSubmitting
                    ? t('q.btn_saving')
                    : currentStepIndex === STEPS.length - 1
                      ? t('q.btn_submit')
                      : t('q.btn_next')}
                  {currentStepIndex !== STEPS.length - 1 && (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
