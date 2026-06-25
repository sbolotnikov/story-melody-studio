'use client';
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, CheckCircle, MessageSquare, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { ShareModal } from "../../components/ShareModal";
import { EditorialHero } from "../../components/EditorialHero";

const reviewsShareImage = "/images/reviews_sm.jpg";

interface Review {
  id: string;
  orderId?: string | null;
  userName: string;
  rating: number;
  comment: string;
  isConfirmed: boolean;
  createdAt: string;
}

interface Order {
  id: string;
  status: string;
  occasion?: string;
  createdAt: string;
}

export default function Reviews() {
  const auth = useAuth();
  const user = auth?.user;
  const profile = auth?.profile;
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);

  // Form State
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserOrders = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/orders?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        // Only allow linking completed orders that are not already reviewed
        const completed = data.filter((o: Order) => o.status === "Completed");
        setUserOrders(completed);
      }
    } catch (err) {
      console.error("Failed to load user orders:", err);
    }
  }, [user]);

  useEffect(() => {
    // Defer calling fetchReviews to avoid synchronous setState within effect
    const id = setTimeout(() => {
      fetchReviews();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!user) return;

    const id = setTimeout(() => {
      fetchUserOrders();
      setUserName(profile?.name || user.email?.split("@")[0] || "");
    }, 0);

    return () => clearTimeout(id);
  }, [user, profile, fetchUserOrders]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      setErrorMsg(t("reviews.form_err_fields"));
      return;
    }

    setIsSubmitLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // If orderId is selected, the review is automatically verified/confirmed
      const isConfirmed = !!selectedOrderId;

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrderId || null,
          userName: userName.trim(),
          rating,
          comment: comment.trim(),
          isConfirmed
        })
      });

      if (res.ok) {
        setSuccessMsg(t("reviews.form_success"));
        setComment("");
        setSelectedOrderId("");
        setRating(5);
        setShowForm(false);
        await fetchReviews();
        // Refresh completed orders in case the just-reviewed one is excluded now
        await fetchUserOrders();
      } else {
        setErrorMsg(t("reviews.form_err_failed"));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(t("reviews.form_err_ajax"));
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const filteredReviews = filterVerifiedOnly 
    ? reviews.filter(r => r.isConfirmed) 
    : reviews;

  // Calculate rating stats
  const totalCount = reviews.length;
  const averageRating = totalCount > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1) 
    : "5.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div id="reviews-page" className="grow bg-background w-full flex flex-col">
      <EditorialHero
        imageSrc={reviewsShareImage}
        imageAlt={t('reviews.loved_by_clients')}
        eyebrow={t('reviews.testimonials')}
        title={t('reviews.loved_by_clients')}
        description={t('reviews.intro_desc')}
        imageClassName="object-cover object-[65%_center] lg:object-center"
        actions={
          <ShareModal
            title={t('reviews.page_title')}
            description={t('reviews.intro_desc')}
            imageSrc={reviewsShareImage}
            className="border-brand-gold/50 bg-background/45 backdrop-blur-sm"
          />
        }
        detail={t('reviews.confirmed_badge')}
      />

      <div className="mx-auto flex w-full max-w-7xl grow flex-col px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

      {/* Stats Summary & Writing controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Rating Score Card */}
        <div className="p-8 border border-border bg-card shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('reviews.average_rating')}</span>
          <div className="text-6xl font-serif font-bold text-foreground mb-4">{averageRating}</div>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-5 h-5 fill-brand-gold text-brand-gold`} />
            ))}
          </div>
          <span className="text-sm text-muted-fg">{t('reviews.based_on', { count: totalCount })}</span>
        </div>

        {/* Distribution Card */}
        <div className="p-8 border border-border bg-card shadow-sm flex flex-col justify-center">
          <div className="space-y-3">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-muted-fg">
                <span className="w-12">{t('reviews.stars_count', { count: dist.stars })}</span>
                <div className="grow h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-gold" 
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right">{dist.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction Card */}
        <div className="p-8 border border-brand-gold/30 bg-brand-gold/5 flex flex-col items-center justify-center text-center">
          <MessageSquare className="w-8 h-8 text-brand-gold mb-3" />
          <h3 className="text-lg font-serif font-bold mb-2">{t('reviews.share_story')}</h3>
          <p className="text-sm text-muted-fg mb-6">
            {t('reviews.share_desc')}
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="studio-action studio-primary-action px-6 py-3"
          >
            <Plus className="h-4 w-4" />
            <span>{t('reviews.write_btn')}</span>
          </button>
        </div>
      </div>

      {/* Review Submission Form container */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12 border border-brand-gold/40 bg-card p-8 shadow-md"
          >
            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center justify-between">
              <span>{t('reviews.write_title')}</span>
              <button onClick={() => setShowForm(false)} className="text-muted-fg hover:text-foreground">
                ✕
              </button>
            </h2>

            <form onSubmit={handleSubmitReview} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('reviews.form_name')}</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold"
                    placeholder={t('reviews.form_name_placeholder')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('reviews.form_rating')}</label>
                  <div className="flex gap-2 items-center h-11.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setRating(lvl)}
                        className="text-muted-fg hover:text-brand-gold transition-colors focus:outline-none"
                      >
                        <Star className={`w-8 h-8 ${lvl <= rating ? "fill-brand-gold text-brand-gold" : "text-muted/60"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {user && userOrders.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">
                    {t('reviews.form_verify_order')}
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold"
                  >
                    <option value="">{t('reviews.form_select_order_placeholder')}</option>
                    {userOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.occasion || "Music Project"} - {new Date(order.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-brand-gold mt-1 uppercase tracking-wider font-semibold">
                    {t('reviews.form_verify_hint')}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('reviews.form_feedback')}</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold"
                  placeholder={t('reviews.form_feedback_placeholder')}
                />
              </div>

              {errorMsg && <p className="text-xs font-semibold text-red-500 uppercase tracking-widest">{errorMsg}</p>}
              {successMsg && <p className="text-xs font-semibold text-green-500 uppercase tracking-widest">{successMsg}</p>}

              <button
                type="submit"
                disabled={isSubmitLoading}
                className="bg-brand-gold text-brand-dark px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
              >
                {isSubmitLoading ? t('reviews.form_submitting') : t('reviews.form_submit')}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List & Filters */}
      <div className="grow flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <span className="text-sm text-muted-fg font-medium">{t('reviews.showing_count', { count: filteredReviews.length })}</span>
          <button
            onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
            className={`text-xs font-semibold uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 border transition-colors ${
              filterVerifiedOnly 
                ? "border-brand-gold text-brand-gold bg-brand-gold/5" 
                : "border-border text-muted-fg hover:border-foreground"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {t('reviews.verified_only')}
          </button>
        </div>

        {isLoading ? (
          <div className="py-24 text-center text-muted-fg font-semibold uppercase tracking-widest text-xs">
            {t('reviews.loading')}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-16 border border-border bg-muted/20 text-center text-muted-fg">
            {t('reviews.no_reviews')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredReviews.map((review) => (
              <div 
                key={review.id} 
                className="p-6 border border-border bg-card shadow-sm flex flex-col relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-foreground">{review.userName}</h4>
                    <span className="text-[10px] text-muted-fg font-mono uppercase tracking-wider">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? "fill-brand-gold text-brand-gold" : "text-muted/20"}`} 
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed italic grow mb-6">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {review.isConfirmed && (
                  <div className="mt-auto pt-4 border-t border-border/60 flex items-center gap-1.5 text-brand-gold font-sans text-[10px] uppercase font-bold tracking-widest">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-gold fill-brand-gold/10" />
                    {t('reviews.confirmed_badge')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Default placeholder reviews seeded client-side if none exist yet under DB */}
      {!isLoading && reviews.length === 0 && (
        <div className="mt-12 text-center text-xs text-muted-fg">
          {t('reviews.be_first')}
        </div>
      )}
      </div>
    </div>
  );
}
