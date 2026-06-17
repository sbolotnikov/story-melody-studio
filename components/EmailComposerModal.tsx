'use client';
import { useState, useEffect, useMemo } from "react";
import { Mail, FileText } from "lucide-react";
import { generateInvoicePDF } from "../utils/generateInvoicePdf";

interface Order {
  id: string | number;
  email?: string;
  hero?: string;
}

interface Invoice {
  orderId?: string | number;
  id?: string | number;
}

interface InvoiceProduct {
  name?: string;
  price?: string | number;
  quantity?: string | number;
  discount?: string | number;
}

interface EmailComposerModalProps {
  isOpen: boolean;
  order: Order | null;
  invoices: Invoice[];
  invoiceProducts: InvoiceProduct[];
  generalDiscount: number;
  onClose: () => void;
}

export function EmailComposerModal({
  isOpen,
  order,
  invoices,
  invoiceProducts,
  generalDiscount,
  onClose
}: EmailComposerModalProps) {
  const activeInvoiceId = invoices.find(inv => inv.orderId === order?.id)?.id || order?.id || "N/A";

  const defaultEmailTo = order?.email || "";
  const defaultEmailSubject = order
    ? `StoryMelody Studio: Invoice Statement Issued for order #${String(order.id).substring(0, 8)}`
    : "";

  const defaultEmailBody = useMemo(() => {
    if (!order) return "";

    const invoiceTotal = invoiceProducts.reduce(
      (sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)),
      0
    );
    const invoiceDiscounts =
      invoiceProducts.reduce((sum, item) => sum + Number(item.discount || 0), 0) +
      generalDiscount;
    const finalAmount = Math.max(0, invoiceTotal - invoiceDiscounts);

    const itemsList = invoiceProducts
      .map(
        (p) =>
          `  * ${p.name || "Custom element"} - Qty: ${p.quantity || 1} x $${Number(
            p.price || 0
          ).toFixed(2)} (-$${Number(p.discount || 0).toFixed(2)} discount)`
      )
      .join("\n");

    return `Dear ${order.hero || "Valued Patron"},\n\n` +
      `We have drafted and issued an official Statement Invoice SM-INV-${activeInvoiceId} for your personalized StoryMelody order.\n\n` +
      `Summary of Creative Items:\n` +
      `${itemsList}\n\n` +
      `-----------------------------------------\n` +
      `Subtotal Amount: $${invoiceTotal.toFixed(2)}\n` +
      `Total Discounts Applied: -$${invoiceDiscounts.toFixed(2)}\n` +
      `Final Statement Balance: $${finalAmount.toFixed(2)}\n` +
      `-----------------------------------------\n\n` +
      `Please log into your StoryMelody Dashboard to securely fulfill this surcharge balance. Once fulfilled, your milestone projects immediately transition into active arrangements or fine-art production phases.\n\n` +
      `If you have any questions, feel free to respond directly to this statement thread.\n\n` +
      `Harmonious regards,\n` +
      `StoryMelody Production Staff`;
  }, [order, invoiceProducts, generalDiscount, activeInvoiceId]);

  const [emailTo, setEmailTo] = useState(defaultEmailTo);
  const [emailSubject, setEmailSubject] = useState(defaultEmailSubject);
  const [emailBody, setEmailBody] = useState(defaultEmailBody);
  const [isSending, setIsSending] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  useEffect(() => {
    if (!isOpen || !order) return;

    const timer = setTimeout(() => {
      setEmailTo(defaultEmailTo);
      setEmailSubject(defaultEmailSubject);
      setEmailBody(defaultEmailBody);
      setResultMsg("");
    }, 0);

    return () => clearTimeout(timer);
  }, [defaultEmailTo, defaultEmailBody, defaultEmailSubject, isOpen, order]);

  if (!isOpen || !order) return null;

  const handleSendEmail = async () => {
    setIsSending(true);
    setResultMsg("");
    try {
      const existingInvoice = {
        productsJson: JSON.stringify(invoiceProducts),
        discount: generalDiscount,
        id: activeInvoiceId
      };
      const doc = generateInvoicePDF(order, existingInvoice);
      const pdfBase64 = doc.output("datauristring");
      const pdfAttachedName = `StoryMelody_Invoice_SM-INV-${existingInvoice.id}.pdf`;

      const res = await fetch(`/api/invoices/${order.id}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: emailTo,
          emailSubject: emailSubject,
          emailBody: emailBody,
          pdfAttachedName: pdfAttachedName,
          pdfBase64: pdfBase64
        })
      });

      if (res.ok) {
        setResultMsg("✓ Simulation Successful: Invoice receipt and PDF statement emailed to customer! (Logs printed to terminal console)");
        setTimeout(() => {
          onClose();
          setResultMsg("");
        }, 3000);
      } else {
        setResultMsg("Failed to simulated-send email.");
      }
    } catch (err) {
      console.error(err);
      setResultMsg("Error executing email simulation.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = () => {
    const existingInvoice = {
      productsJson: JSON.stringify(invoiceProducts),
      discount: generalDiscount,
      id: activeInvoiceId
    };
    const doc = generateInvoicePDF(order, existingInvoice);
    doc.save(`StoryMelody_Invoice_SM-INV-${activeInvoiceId}.pdf`);
  };

  return (
    <div id="email-comp" className="fixed inset-0 bg-background/95 backdrop-blur-md z-60 flex items-center justify-center p-4">
      <div className="bg-background border border-border w-full max-w-2xl shadow-2xl p-8 flex flex-col relative text-left">
        <h3 className="text-2xl font-serif font-bold mb-2 flex items-center gap-2">
          <Mail className="w-6 h-6 text-brand-gold" />
          Invoice Email Simulator Workspace
        </h3>
        <p className="text-sm text-muted-fg mb-6">
          StoryMelody does not require SMTP credentials to test emails. Simulate sending this prepared quote directly to the customer&apos;s portal and verify the plaintext template below.
        </p>

        <div className="space-y-4 grow mb-6">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">To Responding Customer</label>
            <input
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              className="w-full bg-background border border-border p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">Email Subject Header</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full bg-background border border-border p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">Email HTML Body (Precompiled)</label>
            <textarea
              rows={8}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full bg-background border border-border p-3 text-xs font-mono mb-3"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1.5">Attachments (Emailed in PDF format)</label>
            <div className="flex items-center justify-between bg-muted/25 border border-border/80 p-3 rounded-sm gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-foreground/80 truncate">
                <FileText className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="truncate">StoryMelody_Invoice_SM-INV-{String(activeInvoiceId).substring(0, 6).toUpperCase()}.pdf</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="text-brand-gold hover:underline text-[10px] font-bold uppercase tracking-wider shrink-0"
              >
                Download PDF File
              </button>
            </div>
          </div>
        </div>

        {resultMsg && (
          <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider mb-4">
            {resultMsg}
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 border border-border text-foreground py-3 text-xs font-bold uppercase tracking-widest hover:bg-muted transition"
          >
            Close Editor
          </button>
          <button
            type="button"
            disabled={isSending}
            onClick={handleSendEmail}
            className="w-1/2 bg-brand-gold text-brand-dark py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold/90 transition disabled:opacity-50 font-serif"
          >
            {isSending ? "Transmitting..." : "Send Simulated Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
