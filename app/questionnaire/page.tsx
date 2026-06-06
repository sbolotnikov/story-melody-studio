'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Upload, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShareModal } from "../../components/ShareModal";
import logoImg from "../../assets/images/storymelody_logo_1780521281759.png";
import { useAuth } from "../../contexts/AuthContext";

type FormValue = string | number | boolean | File | File[] | null | undefined | Record<string, unknown>;
type FormState = Record<string, FormValue>;

const STEPS = [
  { id: "projectType", title: "Project Type", type: "radio", options: ["Song Only", "Song + Video", "Legacy Film (Song + Video + Portrait)"] },
  { id: "occasion", title: "Occasion", type: "text", placeholder: "e.g., Birthday, Wedding, Anniversary..." },
  { id: "date", title: "Event Date", type: "date" },
  { id: "language", title: "Language", type: "select", options: ["English", "Russian", "Italian", "Polish", "German", "Other"] },
  { id: "hero", title: "Main Hero", type: "textarea", placeholder: "Who is this story about? Describe them briefly." },
  { id: "story", title: "Main Story", type: "textarea", placeholder: "How did you meet? What is the core narrative?" },
  { id: "personality", title: "Personality", type: "textarea", placeholder: "What are their character traits? Funny, strict but loving..." },
  { id: "hobbies", title: "Hobbies & Interests", type: "textarea", placeholder: "What do they love doing? Any funny habits?" },
  { id: "people", title: "People to Mention", type: "textarea", placeholder: "Names of children, friends, or pets to include." },
  { id: "achievements", title: "Events & Achievements", type: "textarea", placeholder: "Important life milestones, funny incidents..." },
  { id: "tone", title: "Tone of the Song", type: "radio", options: ["Emotional & Touching", "Funny & Lighthearted", "Epic & Cinematic", "Romantic"] },
  { id: "musicStyle", title: "Music Style", type: "text", placeholder: "e.g., Acoustic Pop, Cinematic Orchestral, Rock..." },
  { id: "structure", title: "Song Structure", type: "radio", options: ["Standard (Verse-Chorus)", "Storytelling (No repetitive chorus)", "Uptempo dance track"] },
  { id: "exclusions", title: "Exclusions", type: "textarea", placeholder: "What should we NOT mention or do?" },
  { id: "materials", title: "Photos / Materials", type: "file" },
  { id: "videoOpts", title: "Video Options", type: "textarea", placeholder: "Any specific visual direction? (Only for Video packages)" },
  { id: "portraitOpts", title: "Portrait Options", type: "textarea", placeholder: "Specific style for the portrait? (Only for Portrait packages)" },
];

export default function Questionnaire() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoadingOrder, setIsLoadingOrder] = useState(!!orderId);
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;
  const profile = auth?.profile;
  
  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          const parsedAnswers = data.answersData ? JSON.parse(data.answersData) : {};
          setFormData({ ...data, ...parsedAnswers });
        } else {
          setErrorMsg("Order not found.");
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
        setErrorMsg("Please provide your phone number to save your responses, or sign in.");
        return;
      }
      setIsSubmitting(true);
      setErrorMsg("");
      try {
        const standardFields = ['projectType', 'occasion', 'date', 'language', 'email', 'phone', 'status', 'paid', 'archived', 'id', 'userId', 'createdAt', 'updatedAt'];
        const answersDataObj: Record<string, FormValue> = {};
        const payload: Record<string, unknown> = {};
        
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
          if (!payload.email) payload.email = user.email || "";
          if (!payload.phone) payload.phone = profile?.phone || "";
        }
        
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Failed to save order");
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
  const progress = isCompleted ? 100 : Math.round((currentStepIndex / STEPS.length) * 100);

  if (isLoadingOrder) {
    return (
      <div className="flex-grow flex items-center justify-center py-24 px-4 bg-background">
        <div className="text-muted-fg font-semibold uppercase tracking-widest text-sm">Loading Order...</div>
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
          <h2 className="text-4xl font-serif font-bold mb-4">{`You're All Set!`}</h2>
          <p className="text-lg text-muted-fg mb-8 max-w-lg mx-auto">
            Thank you for sharing your story. Our creative team will review the details and reach out to you shortly to begin the magic.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center rounded-none bg-brand-gold px-8 py-4 text-xs font-bold text-brand-dark transition-all hover:bg-brand-gold/90 uppercase tracking-[0.1em]"
          >
            Return to Home
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
          Step {currentStepIndex + 1} of {STEPS.length}
        </div>
        <h2 className="text-3xl font-serif font-bold mb-8">{step.title}</h2>

        {step.type === "radio" && (
          <div className="space-y-4">
            {step.options?.map((opt) => (
              <label
                key={opt}
                className={`flex items-center p-6 border cursor-pointer transition-colors ${
                  formData[step.id] === opt
                    ? "border-brand-gold bg-brand-gold/5"
                    : "border-border bg-background hover:border-brand-gold/50"
                }`}
              >
                <input
                  type="radio"
                  name={step.id}
                  value={opt}
                  checked={formData[step.id] === opt}
                  onChange={(e) => updateField(step.id, e.target.value)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${
                    formData[step.id] === opt ? "border-brand-gold" : "border-muted-fg"
                  }`}
                >
                  {formData[step.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />}
                </div>
                <span className="font-medium text-foreground">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {step.type === "text" && (
          <input
            type="text"
            value={String(formData[step.id] ?? "")}
            onChange={(e) => updateField(step.id, e.target.value)}
            placeholder={step.placeholder}
            className="w-full p-4 bg-background border border-border text-foreground focus:outline-none focus:border-brand-gold transition-colors"
          />
        )}

        {step.type === "date" && (
          <input
            type="date"
            value={String(formData[step.id] ?? "")}
            onChange={(e) => updateField(step.id, e.target.value)}
            className="w-full p-4 bg-background border border-border text-foreground focus:outline-none focus:border-brand-gold transition-colors"
          />
        )}

        {step.type === "textarea" && (
          <textarea
            value={String(formData[step.id] ?? "")}
            onChange={(e) => updateField(step.id, e.target.value)}
            placeholder={step.placeholder}
            rows={6}
            className="w-full p-4 bg-background border border-border text-foreground focus:outline-none focus:border-brand-gold transition-colors resize-y"
          />
        )}

        {step.type === "select" && (
          <select
            value={String(formData[step.id] ?? "")}
            onChange={(e) => updateField(step.id, e.target.value)}
            className="w-full p-4 bg-background border border-border text-foreground focus:outline-none focus:border-brand-gold transition-colors appearance-none"
          >
            <option value="" disabled>Select an option</option>
            {step.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {step.type === "file" && (
          <div className="border-2 border-dashed border-border p-12 text-center hover:border-brand-gold/50 transition-colors cursor-pointer flex flex-col items-center">
            <Upload className="w-10 h-10 text-brand-gold mb-4" />
            <p className="text-foreground font-medium mb-2">Click to upload or drag & drop</p>
            <p className="text-sm text-muted-fg">ZIP, JPEG, PNG, MP4 (Max. 500MB)</p>
            <input type="file" multiple className="hidden" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex-grow flex flex-col pt-16 pb-24 px-4 bg-muted/30">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl mx-auto mb-16 relative">
        <div className="h-1 bg-border w-full absolute top-1/2 -translate-y-1/2 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gold transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col justify-between min-h-[500px] border border-border bg-background p-8 md:p-16 shadow-2xl relative">
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10 flex gap-4">
          {orderId && user && (
            <Link href="/dashboard" className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-muted-fg hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          )}
        </div>
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10">
          <ShareModal 
            title="Share the Questionnaire" 
            description="Working on a gift together? Share this questionnaire with your family or friends to gather stories." 
            imageSrc={logoImg} 
          />
        </div>
        <div className="flex-grow pt-10 sm:pt-0">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {!isCompleted && (
          <div className="pt-12 mt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0 || isSubmitting}
              className={`inline-flex items-center px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-colors ${
                currentStepIndex === 0 || isSubmitting ? "opacity-30 cursor-not-allowed text-muted-fg" : "text-foreground hover:text-brand-gold"
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
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
                    value={typeof formData.phone === 'string' ? formData.phone : ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="p-3 border border-border text-xs bg-background focus:outline-none focus:border-brand-gold w-48"
                  />
                  <span className="text-muted-fg text-xs font-semibold uppercase">OR</span>
                  <Link
                    href="/auth"
                    className="inline-flex items-center justify-center rounded-none border border-brand-gold text-brand-gold px-8 py-3 text-xs font-bold transition-all hover:bg-brand-gold hover:text-brand-dark uppercase tracking-[0.1em]"
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
                    className={`inline-flex items-center justify-center rounded-none bg-brand-gold px-8 py-3 text-xs font-bold text-brand-dark transition-all uppercase tracking-[0.1em] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-gold/90'}`}
                  >
                    {isSubmitting ? "Updating..." : "Update Existing"}
                  </button>
                  <button
                    onClick={() => handleNext(true)}
                    disabled={isSubmitting}
                    className={`inline-flex items-center justify-center rounded-none border border-brand-gold text-brand-gold px-8 py-3 text-xs font-bold transition-all uppercase tracking-[0.1em] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-gold hover:text-brand-dark'}`}
                  >
                    {isSubmitting ? "Saving..." : "Save as New"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNext(false)}
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center rounded-none bg-brand-gold px-8 py-3 text-xs font-bold text-brand-dark transition-all uppercase tracking-[0.1em] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-gold/90'}`}
                >
                  {isSubmitting ? "Saving..." : currentStepIndex === STEPS.length - 1 ? "Submit" : "Continue"}
                  {currentStepIndex !== STEPS.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
