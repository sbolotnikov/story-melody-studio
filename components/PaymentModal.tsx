'use client';

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import type * as Square from "@square/web-sdk";

interface PaymentModalProps {
  isOpen: boolean;
  order: { id: string | number };
  onWait: (isWaiting: boolean) => void;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export function PaymentModal({
  isOpen,
  order,
  onClose,
  onWait,
  onSuccess,
}: PaymentModalProps) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  if (!isOpen || !order) return null;

  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

  const handleToken = async (tokenResult: Square.TokenResult) => {
    if (tokenResult.status !== "OK") {
      const errorMessage =
        "errors" in tokenResult
          ? tokenResult.errors.map((error) => error.message).join(" ")
          : "Card tokenization was cancelled or could not be completed.";

      setPaymentError(errorMessage);
      return;
    }

    onWait(true);
    setPaymentError("");

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: tokenResult.token,
          orderId: String(order.id),
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Payment could not be processed.");
      }

      setPaymentSuccess(true);
      await onSuccess();
      setTimeout(() => {
        setPaymentSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Payment failed", error);
      setPaymentError(error instanceof Error ? error.message : "Payment could not be processed.");
    } finally {
      onWait(false);
    }
  };

  return (
    <div id="payment-gate" className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-brand-gold/40 w-full max-w-sm shadow-2xl p-8 flex flex-col relative overflow-hidden text-left">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-gold/10 rounded-full blur-xl" />

        <h3 className="text-2xl font-serif font-bold text-foreground mb-1 text-center">
          Secure Payment
        </h3>
        <p className="text-center text-[10px] text-muted-fg uppercase tracking-widest mb-6">
          StoryMelody Official Checkout
        </p>

        <AnimatePresence mode="wait">
          {paymentSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center text-foreground"
            >
              <CheckCircle className="w-16 h-16 text-green-500 fill-green-500/10 mb-4 animate-bounce" />
              <h4 className="text-xl font-serif font-bold text-foreground">Payment Secured!</h4>
              <p className="text-xs text-muted-fg uppercase tracking-widest font-semibold mt-2">
                Your order is now in production
              </p>
            </motion.div>
          ) : (
            <div key="form" className="space-y-6">
              {applicationId && locationId ? (
                <PaymentForm
                  applicationId={applicationId}
                  locationId={locationId}
                  cardTokenizeResponseReceived={handleToken}
                >
                  <CreditCard />
                </PaymentForm>
              ) : (
                <p className="text-xs font-semibold text-red-500 text-center">
                  Square payment settings are not configured.
                </p>
              )}

              {paymentError && (
                <p className="text-xs font-semibold text-red-500 text-center" role="alert">
                  {paymentError}
                </p>
              )}

              <div className="pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full border border-border text-foreground hover:bg-muted py-3 text-xs font-bold uppercase tracking-widest text-center rounded-sm transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
