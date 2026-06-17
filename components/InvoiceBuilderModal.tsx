'use client';
import  { useState, useEffect } from "react";
import { X, Plus, Trash2, Mail } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number | string;
}

interface Order {
  id: string;
  projectType?: string;
  occasion?: string;
}

interface InvoiceRecord {
  orderId: string;
  discount?: number | string;
  productsJson?: string;
}

interface InvoiceProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

interface InvoiceBuilderModalProps {
  isOpen: boolean;
  order: Order | null;
  products: Product[];
  invoices: InvoiceRecord[];
  onClose: () => void;
  onSave: (invoiceProducts: InvoiceProduct[], generalDiscount: number) => Promise<void>;
  onSimulateEmail: (invoiceProducts: InvoiceProduct[], generalDiscount: number) => void;
  isSaving: boolean;
}

export function InvoiceBuilderModal({
  isOpen,
  order,
  products,
  invoices,
  onClose,
  onSave,
  onSimulateEmail,
  isSaving
}: InvoiceBuilderModalProps) {
  const [invoiceProducts, setInvoiceProducts] = useState<InvoiceProduct[]>([]);
  const [generalDiscount, setGeneralDiscount] = useState<number>(0);

  // Row additions
  const [chosenProductId, setChosenProductId] = useState("");
  const [rowCustomName, setRowCustomName] = useState("");
  const [rowCustomPrice, setRowCustomPrice] = useState("");
  const [rowQty, setRowQty] = useState<number>(1);
  const [rowDiscount, setRowDiscount] = useState<number>(0);

  useEffect(() => {
    const updateState = () => {
      let newInvoiceProducts: InvoiceProduct[] = [];
      let newGeneralDiscount = 0;

      if (order && isOpen) {
        const existing = invoices.find((inv) => inv.orderId === order.id);
        if (existing) {
          newGeneralDiscount = parseFloat(String(existing.discount || "0"));
          try {
            const parsed = JSON.parse(existing.productsJson || "[]");
            newInvoiceProducts = parsed;
          } catch (e) {
            console.error("Failed to parse invoice", e);
            newInvoiceProducts = [];
          }
        } else {
          newGeneralDiscount = 0;
          // Default to a product matching the order project type
          const matchingProduct = products.find(p => p.title.toLowerCase().includes(String(order.projectType || "").toLowerCase()));
          if (matchingProduct) {
            const matchingProductPrice = parseFloat(String(matchingProduct.price));
            newInvoiceProducts = [
              {
                id: `${matchingProduct.id}-${Date.now()}`,
                name: matchingProduct.title,
                price: matchingProductPrice,
                quantity: 1,
                discount: 0,
                total: matchingProductPrice
              }
            ];
          }
        }
      }

      setInvoiceProducts(newInvoiceProducts);
      setGeneralDiscount(newGeneralDiscount);
      setChosenProductId("");
      setRowCustomName("");
      setRowCustomPrice("");
      setRowQty(1);
      setRowDiscount(0);
    };

    updateState();
  }, [order, isOpen, invoices, products]);

  if (!isOpen || !order) return null;

  const handleAddProductToInvoice = () => {
    const prodId = chosenProductId;
    if (!prodId) return;

    let name = "";
    let price = 0;

    if (prodId !== "custom") {
      const selectedProduct = products.find((p) => p.id === prodId);
      if (!selectedProduct) return;
      name = selectedProduct.title;
      price = parseFloat(String(selectedProduct.price));
    } else {
      if (!rowCustomName.trim() || !rowCustomPrice) {
        alert("Please enter a custom product title and price.");
        return;
      }
      name = rowCustomName.trim();
      price = parseFloat(rowCustomPrice);
    }

    const itemTotal = (price * rowQty) - rowDiscount;
    const newRow = {
      id: `${prodId}-${Date.now()}`,
      name,
      price,
      quantity: rowQty,
      discount: rowDiscount,
      total: itemTotal
    };

    setInvoiceProducts([...invoiceProducts, newRow]);

    // Reset row controls
    setChosenProductId("");
    setRowCustomName("");
    setRowCustomPrice("");
    setRowQty(1);
    setRowDiscount(0);
  };

  const handleRemoveProductFromInvoice = (idx: number) => {
    setInvoiceProducts(invoiceProducts.filter((_, i) => i !== idx));
  };

  const calculatedSubtotal = invoiceProducts.reduce(
    (sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)),
    0
  );
  const calculatedRowDiscounts = invoiceProducts.reduce(
    (sum, item) => sum + Number(item.discount || 0),
    0
  );
  const totalInvoiceDiscount = calculatedRowDiscounts + generalDiscount;
  const grandInvoiceTotal = Math.max(0, calculatedSubtotal - totalInvoiceDiscount);

  return (
    <div id="invoice-builder-modal" className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background border border-border w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/15">
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground">
              Invoice Statement Compiler
            </h3>
            <p className="text-xs text-muted-fg mt-1">
              Draft product breakdown and billing for order:{" "}
              <span className="text-brand-gold font-bold font-mono">
                {order.id.substring(0, 8)}
              </span>{" "}
              (Occasion: {order.occasion})
            </p>
          </div>
          <button onClick={onClose} className="text-muted-fg hover:text-foreground p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split Content */}
        <div className="grow overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Catalog adder */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Item Line
              </h4>

              <div className="space-y-4 bg-muted/10 p-4 border border-border">
                {/* Choose Product catalog */}
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1.5">
                    Catalog Product
                  </label>
                  <select
                    value={chosenProductId}
                    onChange={(e) => {
                      setChosenProductId(e.target.value);
                      if (e.target.value !== "custom") {
                        setRowCustomName("");
                        setRowCustomPrice("");
                      }
                    }}
                    className="w-full bg-background border border-border p-2 text-sm focus:outline-none"
                  >
                    <option value="">-- Choose From Catalog Product list --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (${p.price})
                      </option>
                    ))}
                    <option value="custom">-- Create Custom Service Surcharge --</option>
                  </select>
                </div>

                {/* Custom text row */}
                {chosenProductId === "custom" && (
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">
                        Service Name
                      </label>
                      <input
                        type="text"
                        value={rowCustomName}
                        onChange={(e) => setRowCustomName(e.target.value)}
                        className="w-full bg-background border border-border p-2 text-sm"
                        placeholder="e.g. Express delivery fee"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">
                        Unit Price ($)
                      </label>
                      <input
                        type="number"
                        value={rowCustomPrice}
                        onChange={(e) => setRowCustomPrice(e.target.value)}
                        className="w-full bg-background border border-border p-2 text-sm"
                        placeholder="e.g. 50"
                      />
                    </div>
                  </div>
                )}

                {/* Quantity & Discount */}
                {chosenProductId && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={rowQty}
                        onChange={(e) => setRowQty(parseInt(e.target.value) || 1)}
                        className="w-full bg-background border border-border p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-fg mb-1">
                        Discount ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={rowDiscount}
                        onChange={(e) => setRowDiscount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-background border border-border p-2 text-sm"
                      />
                    </div>
                  </div>
                )}

                {chosenProductId && (
                  <button
                    type="button"
                    onClick={handleAddProductToInvoice}
                    className="w-full bg-foreground text-background py-2 text-xs font-bold uppercase tracking-widest hover:bg-foreground/90 transition-colors"
                  >
                    Insert Into Invoice Ledger
                  </button>
                )}
              </div>
            </div>

            {/* General Invoice Level Discount */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">
                General Invoice Surcharge Discount ($)
              </label>
              <input
                type="number"
                min="0"
                value={generalDiscount}
                onChange={(e) => setGeneralDiscount(parseFloat(e.target.value) || 0)}
                className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold font-mono"
                placeholder="Enter invoice-wide flat discount"
              />
            </div>
          </div>

          {/* Physical Invoice Receipt Preview */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="border border-foreground bg-card p-6 flex flex-col space-y-4 font-mono text-xs shadow-inner min-h-75">
              {/* Receipt Header */}
              <div className="text-center border-b border-dashed border-foreground/60 pb-4">
                <h5 className="font-serif font-bold text-base uppercase tracking-wider text-foreground">
                  StoryMelody Studio
                </h5>
                <p className="text-[10px] text-muted-fg uppercase tracking-widest mt-1">
                  MEMORIES TURNED INTO ART
                </p>
                <p className="text-[9px] text-muted-fg mt-2">
                  Statement #SM-INV-{order.id.substring(0, 6).toUpperCase()}
                </p>
              </div>

              {/* Receipt Items body */}
              <div className="grow space-y-2 py-4">
                <div className="flex justify-between font-bold border-b border-foreground/30 pb-1 text-foreground">
                  <span className="w-3/5 truncate">PRODUCT</span>
                  <span className="w-1/5 text-center">QTY</span>
                  <span className="w-1/5 text-right font-semibold">TOTAL</span>
                </div>

                {invoiceProducts.length === 0 ? (
                  <p className="text-center text-muted-fg italic py-8">
                    [Invoice sheet is currently empty]
                  </p>
                ) : (
                  invoiceProducts.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b border-dashed border-border/60 last:border-0 group"
                    >
                      <span className="w-3/5 text-foreground truncate font-semibold">
                        {item.name}
                      </span>
                      <span className="w-1/5 text-center text-muted-fg">
                        {item.quantity}
                      </span>
                      <span className="w-1/5 text-right font-mono flex items-center justify-end gap-1 font-semibold text-foreground">
                        ${item.total.toFixed(2)}
                        <button
                          type="button"
                          onClick={() => handleRemoveProductFromInvoice(idx)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Calculations */}
              <div className="border-t border-dashed border-foreground/60 pt-4 space-y-1.5 text-right">
                <div className="flex justify-between">
                  <span className="text-muted-fg">SUBTOTAL:</span>
                  <span className="font-semibold text-foreground">
                    ${calculatedSubtotal.toFixed(2)}
                  </span>
                </div>

                {totalInvoiceDiscount > 0 && (
                  <div className="flex justify-between text-green-500 font-semibold">
                    <span>DISCOUNTS:</span>
                    <span>-${totalInvoiceDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-dashed border-foreground/30 text-sm font-bold text-foreground">
                  <span>GRAND TOTAL DUE:</span>
                  <span className="text-brand-gold font-serif text-lg">
                    ${grandInvoiceTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Email composer triggering and save hooks */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                disabled={invoiceProducts.length === 0}
                onClick={() => onSimulateEmail(invoiceProducts, generalDiscount)}
                className="border border-brand-gold text-brand-gold hover:bg-brand-gold/5 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
              >
                <Mail className="w-4 h-4" /> Simulate Email Invoice
              </button>
              <button
                type="button"
                disabled={isSaving || invoiceProducts.length === 0}
                onClick={() => onSave(invoiceProducts, generalDiscount)}
                className="bg-brand-gold text-brand-dark py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md"
              >
                Save Statement Ledger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
