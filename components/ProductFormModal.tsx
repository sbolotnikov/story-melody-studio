'use client';
import React, { useRef } from "react";
import { Sparkles } from "lucide-react";

type Product = {
  id?: string;
  title?: string;
  price?: number | string;
  description?: string;
};

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  onSave: (product: { title: string; price: string; description: string }) => Promise<void>;
  isSaving: boolean;
}

export function ProductFormModal({
  isOpen,
  onClose,
  editingProduct,
  onSave,
  isSaving
}: ProductFormModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: titleRef.current?.value ?? "",
      price: priceRef.current?.value ?? "",
      description: descriptionRef.current?.value ?? ""
    });
  };

  return (
    <div id="product-form-modal" className="fixed inset-0 bg-background/95 backdrop-blur-md z-60 flex items-center justify-center p-4">
      <div className="bg-background border border-border w-full max-w-md shadow-2xl p-8 flex flex-col relative text-left">
        <h3 className="text-2xl font-serif font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-gold" />
          {editingProduct ? "Revise Product Details" : "Publish New Creative Product"}
        </h3>
        <p className="text-sm text-muted-fg mb-6">
          {editingProduct 
            ? "Modify the product name, baseline pricing, or package descriptions here." 
            : "Draft and list a new core creative package or milestone product for billing invoices."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">Product Title</label>
            <input
              type="text"
              required
              ref={titleRef}
              defaultValue={editingProduct?.title ?? ""}
              className="w-full bg-background border border-border p-2.5 text-sm"
              placeholder="e.g. Deluxe Fine Art Portrait"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">Unit Pricing ($)</label>
            <input
              type="number"
              step="0.01"
              required
              ref={priceRef}
              defaultValue={editingProduct?.price ?? ""}
              className="w-full bg-background border border-border p-2.5 text-sm"
              placeholder="e.g. 299.00"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">Description / Spec Sheet</label>
            <textarea
              rows={4}
              required
              ref={descriptionRef}
              defaultValue={editingProduct?.description ?? ""}
              className="w-full bg-background border border-border p-3 text-sm mb-3"
              placeholder="Specify clear revision limits: e.g. Includes custom orchestral arrangement & 2 revisions."
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 border border-border text-foreground hover:bg-muted py-3 text-xs font-bold uppercase tracking-widest text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-1/2 bg-brand-gold text-brand-dark py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold/90 transition disabled:opacity-50 text-center font-serif"
            >
              {isSaving ? "Publishing..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
