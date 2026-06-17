'use client';

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Order {
  id: string | number;
}

interface Invoice {
  orderId: string | number;
  discount?: number;
  productsJson: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  order: Order;
  invoice: Invoice;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export function PaymentModal({
  isOpen,
  order,
  invoice,
  onClose,
  onSuccess
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [paypalDetails, setPaypalDetails] = useState({ email: "", password: "" });

  if (!isOpen || !order || !invoice) return null;

  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock validation
    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
        setPaymentError("Please fill out all card details.");
        return;
      }
    } else {
      if (!paypalDetails.email || !paypalDetails.password) {
        setPaymentError("Please fill out your PayPal account details.");
        return;
      }
    }

    setIsProcessingPayment(true);
    setPaymentError("");

    try {
      // 1. Mark Invoice as paid on current date
      const today = new Date().toLocaleDateString();
      await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: invoice.orderId,
          discount: invoice.discount,
          productsJson: invoice.productsJson,
          paidDate: today
        })
      });

      // 2. Mark Order as paid and transition its status to 'In production'
      await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paid: true,
          status: "In production"
        })
      });

      // Show success micro-animation
      setPaymentSuccess(true);
      await onSuccess();
      
      setTimeout(() => {
        setPaymentSuccess(false);
        onClose();
      }, 3000);

    } catch (err) {
      console.error("Payment failed", err);
      setPaymentError("An error occurred during payment processing. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div id="payment-gate" className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-brand-gold/40 w-full max-w-sm shadow-2xl p-8 flex flex-col relative overflow-hidden text-left">
        {/* Background glowing token */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-gold/10 rounded-full blur-xl" />

        <h3 className="text-2xl font-serif font-bold text-foreground mb-1 text-center">
          Secure Surcharge Gateway
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
                Marking order as: Paid / In Production
              </p>
            </motion.div>
          ) : (
            <form key="form" onSubmit={handleExecutePayment} className="space-y-6">
              {/* Selector tabs */}
              <div className="grid grid-cols-2 gap-2 border border-border p-1 bg-muted/25 rounded-md">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`py-2 text-[10px] font-bold uppercase tracking-wider transition-all rounded-md ${
                    paymentMethod === "card" 
                      ? "bg-background text-brand-gold shadow-sm border border-brand-gold/20" 
                      : "text-muted-fg hover:text-foreground"
                  }`}
                >
                  💳 Square Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`py-2 text-[10px] font-bold uppercase tracking-wider transition-all rounded-md ${
                    paymentMethod === "paypal" 
                      ? "bg-background text-yellow-600 shadow-sm border border-yellow-500/20" 
                      : "text-muted-fg hover:text-foreground"
                  }`}
                >
                  💰 PayPal Express
                </button>
              </div>

              {paymentMethod === "card" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      className="w-full bg-background border border-border p-2.5 text-sm"
                      placeholder="e.g. Samuel Bolotnikov"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, "")})}
                      className="w-full bg-background border border-border p-2.5 text-sm font-mono tracking-widest"
                      placeholder="4111 8111 1111 1111"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">Expiration</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        className="w-full bg-background border border-border p-2.5 text-sm font-mono text-center"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">Security Code</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value.replace(/\D/g, "")})}
                        className="w-full bg-background border border-border p-2.5 text-sm font-mono text-center"
                        placeholder="CVV"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">PayPal Account Email</label>
                    <input
                      type="email"
                      required
                      value={paypalDetails.email}
                      onChange={(e) => setPaypalDetails({...paypalDetails, email: e.target.value})}
                      className="w-full bg-background border border-border p-2.5 text-sm mb-1"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">PayPal Account Password</label>
                    <input
                      type="password"
                      required
                      value={paypalDetails.password}
                      onChange={(e) => setPaypalDetails({...paypalDetails, password: e.target.value})}
                      className="w-full bg-background border border-border p-2.5 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {paymentError && (
                <p className="text-xs font-semibold text-red-500 uppercase tracking-widest text-center">
                  {paymentError}
                </p>
              )}

              <div className="flex gap-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 border border-border text-foreground hover:bg-muted py-3 text-xs font-bold uppercase tracking-widest text-center rounded-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-2/3 bg-brand-gold text-brand-dark py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold/90 transition disabled:opacity-50 text-center rounded-sm shadow-md font-serif"
                >
                  {isProcessingPayment ? "Securing payment..." : "Authorize Surcharge"}
                </button>
              </div>
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
