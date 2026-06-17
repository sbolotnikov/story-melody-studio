'use client';
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Link from 'next/link';
import bcrypt from 'bcryptjs';
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {  Receipt, Mail, Plus, Trash2, X, CreditCard, CheckCircle, FileText} from "lucide-react";
import { generateInvoicePDF } from "../../utils/generateInvoicePdf";
import { ProductFormModal } from "../../components/ProductFormModal";
import { PaymentModal } from "../../components/PaymentModal";
import { EmailComposerModal } from "../../components/EmailComposerModal";

type Order = {
  id: string;
  projectType?: string;
  status?: string;
  paid?: boolean;
  createdAt?: string;
  occasion?: string;
  date?: string;
  language?: string;
  email?: string;
  phone?: string;
  userId?: string;
  hero?: string;
  story?: string;
  archived?: boolean;
  answersData?: string;
};

type Product = {
  id: string;
  title: string;
  price: string;
  description?: string;
};

type Invoice = {
  id: string;
  orderId: string;
  productsJson?: string;
  discount?: number;
  paidDate?: string;
};

type User = {
  id: string;
  email?: string;
  phone?: string;
  role?: string;
  createdAt?: string;
};

type InvoiceItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
};

const renderAnswerValue = (val: string) => {
  if (!val) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = val.split(urlRegex);
  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gold hover:underline break-all font-semibold inline-block"
              >
                {part}
              </a>
            );
          }
          return <span key={index} className="whitespace-pre-wrap">{part}</span>;
        })}
      </>
    );
  }
  return <span className="whitespace-pre-wrap">{val}</span>;
};

export default function Dashboard() {
  const auth = useAuth();
  const user = auth?.user;
  const profile = auth?.profile;
  const loading = auth?.loading;
  const updateProfile = auth?.updateProfile;
  const resetPassword = auth?.resetPassword;
  const updateUserPassword = auth?.updateUserPassword;
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [phoneInput, setPhoneInput] = useState("");
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [filterArchived, setFilterArchived] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // --- Billing & Invoicing State ---
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [invoiceProducts, setInvoiceProducts] = useState<InvoiceItem[]>([]);
  const [generalDiscount, setGeneralDiscount] = useState<number>(0);
  const [isSavingInvoice, setIsSavingInvoice] = useState(false);

  // Selector / Input items for current row additions
  const [chosenProductId, setChosenProductId] = useState("");
  const [rowCustomName, setRowCustomName] = useState("");
  const [rowCustomPrice, setRowCustomPrice] = useState("");
  const [rowQty, setRowQty] = useState<number>(1);
  const [rowDiscount, setRowDiscount] = useState<number>(0);

  // Email simulation composer states
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  

  // Payment states (PayPal & Square card dialog)
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<Invoice | null>(null);
  const [, setPaymentSuccess] = useState(false);
  const [, setCardDetails] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [, setPaypalDetails] = useState({ email: "", password: "" });

  // Product Catalog management states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Null means adding new
  const [, setProductFormTitle] = useState("");
  const [, setProductFormPrice] = useState("");
  const [, setProductFormDesc] = useState("");
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [, setPaymentError] = useState("");

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    avatarUrl: "",
    password: "",
    confirmPassword: ""
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    if (profile) {
      Promise.resolve().then(() => {
        setProfileData({
          name: profile.name || "",
          phone: profile.phone || "",
          avatarUrl: profile.image || "",
          password: "",
          confirmPassword: ""
        });
      });
    }
  }, [profile]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user || loading) return;
      try {
        if (profile?.role === 'admin') {
          const [ordersRes, usersRes, productsRes, invoicesRes] = await Promise.all([
            fetch("/api/orders").then(r => r.json().catch(() => [])),
            fetch("/api/users").then(r => r.json().catch(() => [])),
            fetch("/api/products").then(r => r.json().catch(() => [])),
            fetch("/api/invoices").then(r => r.json().catch(() => []))
          ]);
          if (isMounted) {
            setOrders(Array.isArray(ordersRes) ? ordersRes : []);
            setUsers(Array.isArray(usersRes) ? usersRes : []);
            setProducts(Array.isArray(productsRes) ? productsRes : []);
            setInvoices(Array.isArray(invoicesRes) ? invoicesRes : []);
          }
        } else {
          const [ordersRes, invoicesRes] = await Promise.all([
            fetch(`/api/orders?userId=${user.id}`).then(r => r.json().catch(() => [])),
            fetch("/api/invoices").then(r => r.json().catch(() => []))
          ]);
          if (isMounted) {
            setOrders(Array.isArray(ordersRes) ? ordersRes : []);
            setInvoices(Array.isArray(invoicesRes) ? invoicesRes : []);
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, profile, loading]);

  if (loading || isLoadingData) {
    return <div className="grow flex items-center justify-center p-24 text-muted-fg font-semibold uppercase tracking-widest text-xs">Loading...</div>;
  }

  if (!user) {
    return redirect("/auth");
  }

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || !updateProfile) return;
    setIsSavingPhone(true);
    try {
      await updateProfile({ phone: phoneInput.trim() });
    } finally {
      setIsSavingPhone(false);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormTitle("");
    setProductFormPrice("");
    setProductFormDesc("");
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductFormTitle(prod.title || "");
    setProductFormPrice(prod.price || "");
    setProductFormDesc(prod.description || "");
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${prodId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchData();
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product.");
    }
  };

  const handleSaveProduct = async (productData: { title: string; price: string; description: string }) => {
    if (!productData.title.trim() || !productData.price) {
      alert("Please fill in title and price.");
      return;
    }
    setIsSavingProduct(true);
    try {
      const payload = {
        title: productData.title.trim(),
        price: productData.price,
        description: productData.description.trim()
      };
      
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setProductModalOpen(false);
        await fetchData();
      } else {
        alert("Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage("");
    
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      setProfileMessage("Passwords do not match");
      setIsSavingProfile(false);
      return;
    }

    if (!updateProfile) {
      setProfileMessage("Profile update not available");
      setIsSavingProfile(false);
      return;
    }

    try {
      let passwordHash;
      if (profileData.password) {
        // Encrypt with bcryptjs as requested before sending to the backend/storing
        passwordHash = bcrypt.hashSync(profileData.password, 10);
        // Also update actual authentication password if they are using Firebase Auth email/pass
        if (updateUserPassword) {
          await updateUserPassword(profileData.password);
        }
      }

      await updateProfile({
        name: profileData.name.trim(),
        phone: profileData.phone.trim(),
        image: profileData.avatarUrl.trim(),
        ...(passwordHash ? { passwordHash } : {})
      });
      setProfileMessage("Profile updated successfully");
      setProfileData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      setTimeout(() => setProfileMessage(""), 3000);
    } catch (error) {
      console.error(error);
      const err = error as { code?: string; message?: string } | undefined;
      if (err?.code === 'auth/requires-recent-login') {
        setProfileMessage("Please re-authenticate (logout and log back in) to update your password");
      } else {
        setProfileMessage("Failed to update profile");
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email || !resetPassword) return;
    try {
      await resetPassword(user.email);
      setProfileMessage("Password reset email sent");
      setTimeout(() => setProfileMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setProfileMessage("Failed to send reset email");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

 

  const handleArchiveOrder = async (orderId: string, archived: boolean) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived })
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Invoice Managers ---
  const handleOpenInvoiceManager = (order: Order) => {
    setSelectedOrderForInvoice(order);
    const existing = invoices.find(inv => inv.orderId === order.id);
    if (existing) {
      setInvoiceProducts(JSON.parse(existing.productsJson || "[]"));
      setGeneralDiscount(existing.discount || 0);
    } else {
      // Intelligently pre-populate standard products if it's the first time
      const prepopulated: InvoiceItem[] = [];
      const pType = order.projectType || "";
      const isBaseLang = (order.language || "English") === "English";

      if (pType.includes("Song") || pType.includes("Film") || pType.includes("Legacy")) {
        const songProduct = products.find(p => p.title.toLowerCase().includes(isBaseLang ? "base language" : "none listed language") && p.title.toLowerCase().includes("song"));
        if (songProduct) {
          prepopulated.push({
            id: songProduct.id,
            name: songProduct.title,
            price: parseFloat(songProduct.price),
            quantity: 1,
            discount: 0,
            total: parseFloat(songProduct.price)
          });
        }
      }

      if (pType.includes("Video") || pType.includes("Film") || pType.includes("Legacy")) {
        const videoProduct = products.find(p => p.title.toLowerCase().includes(isBaseLang ? "base language" : "none-base language") && p.title.toLowerCase().includes("video"));
        if (videoProduct) {
          prepopulated.push({
            id: videoProduct.id,
            name: videoProduct.title,
            price: parseFloat(videoProduct.price),
            quantity: 1,
            discount: 0,
            total: parseFloat(videoProduct.price)
          });
        }
      }

      if (pType.includes("Portrait") || pType.includes("Film") || pType.includes("Legacy")) {
        const portraitProduct = products.find(p => p.title.toLowerCase().includes("portrait"));
        if (portraitProduct) {
          prepopulated.push({
            id: portraitProduct.id,
            name: portraitProduct.title,
            price: parseFloat(portraitProduct.price),
            quantity: 1,
            discount: 0,
            total: parseFloat(portraitProduct.price)
          });
        }
      }

      setInvoiceProducts(prepopulated);
      setGeneralDiscount(0);
    }

    // Reset current row item selectors
    setChosenProductId("");
    setRowCustomName("");
    setRowCustomPrice("");
    setRowQty(1);
    setRowDiscount(0);
  };

  const handleAddProductToInvoice = () => {
    let name = "";
    let price = 0;
    let prodId = "custom";

    if (chosenProductId && chosenProductId !== "custom") {
      const selectedProduct = products.find(p => p.id === chosenProductId);
      if (selectedProduct) {
        prodId = selectedProduct.id;
        name = selectedProduct.title;
        price = parseFloat(selectedProduct.price);
      }
    } else {
      if (!rowCustomName.trim() || !rowCustomPrice) {
        alert("Please enter a name and price for the custom product.");
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

  const handleSaveInvoice = async () => {
    if (!selectedOrderForInvoice) return;
    setIsSavingInvoice(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrderForInvoice.id,
          discount: generalDiscount,
          productsJson: JSON.stringify(invoiceProducts)
        })
      });
      if (res.ok) {
        await fetchData();
        setSelectedOrderForInvoice(null);
      } else {
        alert("Failed to save invoice.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving invoice.");
    } finally {
      setIsSavingInvoice(false);
    }
  };

  // --- Payment Execution ---
  const handleOpenPaymentDialog = (order: Order, invoice: Invoice) => {
    setActivePaymentOrder(order);
    setActivePaymentInvoice(invoice);
    setPaymentSuccess(false);
    setPaymentError("");
    setCardDetails({ number: "", expiry: "", cvc: "", name: "" });
    setPaypalDetails({ email: "", password: "" });
  };

  

  if (profile && !profile.phone && profile.role !== 'admin') {
    return (
      <div className="grow flex items-center justify-center py-24 px-4 bg-background">
        <div className="w-full max-w-md border border-border bg-card p-8 shadow-2xl relative">
          <h2 className="text-2xl font-serif font-bold mb-4">{t('q.phone_prompt')}</h2>
          <p className="text-sm text-muted-fg mb-6">
            {t('q.phone_desc')}
          </p>
          <form onSubmit={handleSavePhone} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('dash.phone')}</label>
              <input
                type="tel"
                required
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-background border border-border p-4 text-sm text-foreground focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <button
              type="submit"
              disabled={isSavingPhone}
              className="w-full bg-brand-gold text-brand-dark px-6 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
            >
              {isSavingPhone ? t('q.saving') : t('q.save_phone')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="grow flex flex-col py-16 px-4 max-w-7xl mx-auto w-full">
      <Helmet>
        <title>{profile?.role === 'admin' ? t('dash.admin_title') : t('dash.my_title')} - StoryMelody</title>
      </Helmet>
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12 border-b border-border pb-6">
        {profile?.role === 'admin' ? t('dash.admin_title') : t('dash.my_title')}
      </h1>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-serif font-bold mb-6">{t('dash.settings')}</h2>
          <form className="max-w-2xl border border-border bg-background p-6 space-y-4" onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('dash.name')}</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('dash.phone')}</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('dash.avatar')}</label>
              <input
                type="url"
                value={profileData.avatarUrl}
                onChange={(e) => setProfileData({...profileData, avatarUrl: e.target.value})}
                className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('dash.new_pass')}</label>
                <input
                  type="password"
                  value={profileData.password}
                  onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                  className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('dash.confirm_pass')}</label>
                <input
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                  className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {profileMessage && (
              <p className={`text-xs font-semibold uppercase tracking-widest ${profileMessage.includes("success") ? "text-green-500" : "text-red-500"}`}>
                {profileMessage}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border mt-6">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="bg-brand-gold text-brand-dark px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
              >
                {isSavingProfile ? t('q.saving') : t('dash.save')}
              </button>
              
              <button
                type="button"
                onClick={handleResetPassword}
                className="border border-border text-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                {t('dash.reset_pass')}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold">{t('dash.orders')}</h2>
            {profile?.role === 'admin' && (
              <div className="flex gap-4">
                 <button onClick={() => setFilterArchived(!filterArchived)} className="text-xs font-semibold uppercase tracking-widest text-muted-fg hover:text-foreground">
                    {filterArchived ? t('dash.show_active') : t('dash.show_archived')}
                 </button>
              </div>
            )}
          </div>
          {orders.filter(o => profile?.role === 'admin' ? !!o.archived === filterArchived : true).length === 0 ? (
            <div className="p-8 border border-border bg-muted/30 text-center text-muted-fg font-medium">
              {t('dash.no_orders')}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.filter(o => profile?.role === 'admin' ? !!o.archived === filterArchived : true).map(order => {
                const orderInvoice = invoices.find(inv => inv.orderId === order.id);
                let invoiceProductsList: InvoiceItem[] = [];
                let invoiceSubtotal = 0;
                let invoiceDiscountsSum = 0;
                let invoiceGrandTotal = 0;
                if (orderInvoice) {
                  try {
                    invoiceProductsList = JSON.parse(orderInvoice.productsJson || "[]");
                    invoiceSubtotal = invoiceProductsList.reduce((sum, it) => sum + (parseFloat(String(it.price)) * parseInt(String(it.quantity), 10)), 0);
                    invoiceDiscountsSum = invoiceProductsList.reduce((sum, it) => sum + parseFloat(String(it.discount || 0)), 0) + parseFloat(String(orderInvoice.discount || 0));
                    invoiceGrandTotal = Math.max(0, invoiceSubtotal - invoiceDiscountsSum);
                  } catch(e) {
                    console.error("Failed to parse invoice json", e);
                  }
                }

                return (
                  <div key={order.id} className="p-6 border border-border bg-background shadow-sm flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row gap-6">
                    <div className="grow">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">{order.projectType}</span>
                        <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-500/10 text-green-500' : order.status === 'In production' ? 'bg-blue-500/10 text-blue-500' : order.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-muted text-muted-fg'}`}>
                           {t(`dash.status_${(order.status || 'new').toLowerCase().replace(' ', '_')}`) || order.status || t('dash.status_new')}
                        </span>
                        {order.paid && (
                          <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest bg-green-500/10 text-green-500">
                             {t('dash.paid')}
                          </span>
                        )}
                        {orderInvoice && (
                          <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-widest bg-yellow-500/10 text-yellow-600 flex items-center gap-1`}>
                            <Receipt className="w-2.5 h-2.5" />
                            Invoice prepared (${invoiceGrandTotal})
                          </span>
                        )}
                        <span className="text-xs text-muted-fg ml-auto">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <div className="text-lg font-bold mb-2">{order.occasion || 'General Questionnaire'}</div>
                      <div className="text-sm text-foreground/80 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-border pb-4">
                        <div><strong>{t('dash.date')}:</strong> {order.date || 'TBD'}</div>
                        <div><strong>{t('q.language.title')}:</strong> {order.language || 'English'}</div>
                        {profile?.role === 'admin' && (
                          <>
                            <div className="text-brand-gold"><strong>{t('dash.email')}:</strong> {order.email || users.find(u => u.id === order.userId)?.email || 'N/A'}</div>
                            <div className="text-brand-gold"><strong>{t('dash.phone')}:</strong> {order.phone || users.find(u => u.id === order.userId)?.phone || 'N/A'}</div>
                          </>
                        )}
                      </div>
                      
                      {/* Customer Side / Shared view of prepared invoices */}
                      {orderInvoice && (
                        <div className="mb-4 bg-muted/25 border border-border p-4">
                          <div className="flex items-center gap-1.5 mb-3 border-b border-border/80 pb-2 text-xs font-bold uppercase tracking-widest text-brand-gold">
                            <Receipt className="w-4 h-4" />
                            Custom Statement & Invoice
                          </div>
                          
                          <div className="space-y-1 text-xs mb-3 font-mono">
                            {invoiceProductsList.map((p, idx) => (
                              <div key={idx} className="flex justify-between items-center text-foreground/90 py-1 border-b border-border/30 last:border-0">
                                <span>{p.name} (×{p.quantity})</span>
                                <span className="font-semibold">${parseFloat(String(p.price)) * Number(p.quantity)}</span>
                              </div>
                            ))}
                            {invoiceDiscountsSum > 0 && (
                              <div className="flex justify-between text-green-500 py-1">
                                <span>Discounts Applied:</span>
                                <span>-${invoiceDiscountsSum}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm font-bold pt-2 border-t border-border text-foreground">
                              <span>Total Due:</span>
                              <span className="text-brand-gold font-serif text-base">${invoiceGrandTotal}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] font-sans border-t border-border/40 pt-4 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                const doc = generateInvoicePDF(order, orderInvoice);
                                doc.save(`StoryMelody_Invoice_SM-INV-${orderInvoice.id || order.id}.pdf`);
                              }}
                              className="border border-border/80 text-foreground hover:bg-muted hover:text-brand-gold px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Download PDF Invoice
                            </button>
                            {orderInvoice.paidDate ? (
                              <p className="text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5 fill-green-500/10 text-green-500" />
                                ✓ Paid on {orderInvoice.paidDate}
                              </p>
                            ) : (
                              <div className="flex items-center gap-4">
                                <p className="text-muted-fg uppercase tracking-wider font-semibold">
                                  Status: Unpaid / Awaiting Settlement
                                </p>
                                {profile?.role !== 'admin' && (
                                  <button
                                    onClick={() => handleOpenPaymentDialog(order, orderInvoice)}
                                    className="bg-brand-gold text-brand-dark px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/90 transition-all shadow-md flex items-center gap-1"
                                  >
                                    <CreditCard className="w-3 h-3" />
                                    Pay Statement (${invoiceGrandTotal})
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Summary for admin */}
                      {profile?.role === 'admin' && (
                        <div className="text-xs text-muted-fg space-y-1 mb-4">
                           {order.hero && <p><strong>{t('dash.order_hero')}:</strong> {order.hero}</p>}
                           {order.story && <p><strong>{t('dash.order_story')}:</strong> {order.story}</p>}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-35 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 justify-center">
                      {profile?.role === 'admin' && (
                        <select 
                          value={order.status || 'New'}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="text-xs font-semibold uppercase tracking-widest bg-background border border-border p-2 focus:outline-none focus:border-brand-gold"
                        >
                          <option value="New">{t('dash.status_new')}</option>
                          <option value="Contacted">{t('dash.status_contacted')}</option>
                          <option value="In production">{t('dash.status_production')}</option>
                          <option value="Completed">{t('dash.status_completed')}</option>
                        </select>
                      )}
                      

                      {profile?.role === 'admin' && (
                         <button
                           onClick={() => handleOpenInvoiceManager(order)}
                           className="text-xs font-bold uppercase tracking-widest bg-brand-gold text-brand-dark hover:bg-brand-gold/90 transition-colors py-2.5 px-4 text-center flex items-center justify-center gap-1 border border-brand-gold"
                         >
                           <Receipt className="w-3.5 h-3.5" />
                           {orderInvoice ? "Edit Invoice" : "Create Invoice"}
                         </button>
                      )}
                      
                      {profile?.role === 'admin' ? (
                         <button
                           onClick={() => setExpandedOrders(prev => ({...prev, [order.id]: !prev[order.id]}))}
                           className="text-xs font-semibold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 transition-colors py-2 text-center border border-brand-gold/20 hover:border-brand-gold"
                         >
                           {expandedOrders[order.id] ? t('dash.hide_details') : t('dash.view_details')}
                         </button>
                      ) : (
                        <>
                         <button
                           onClick={() => setExpandedOrders(prev => ({...prev, [order.id]: !prev[order.id]}))}
                           className="text-xs font-semibold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 transition-colors py-2 text-center border border-brand-gold/20 hover:border-brand-gold mt-1"
                         >
                           {expandedOrders[order.id] ? t('dash.hide_details') : t('dash.view_details')}
                         </button>
                          <Link
                            href={`/questionnaire?orderId=${order.id}`}
                            className="text-xs font-semibold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 transition-colors py-2 text-center border border-brand-gold/20 hover:border-brand-gold mt-1"
                          >
                            {t('dash.edit_q')}
                          </Link>
                        </>
                      )}
                      
                      {profile?.role === 'admin' && (
                         <button
                           onClick={() => handleArchiveOrder(order.id, !order.archived)}
                           className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-brand-gold transition-colors py-2 text-center"
                         >
                           {order.archived ? t('dash.unarchive') : t('dash.archive')}
                         </button>
                      )}

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-xs font-semibold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors py-2 text-center"
                      >
                        {t('dash.delete')}
                      </button>
                    </div>
                    </div>
                    
                    {expandedOrders[order.id] && (
                      <div className="border-t border-border pt-4 mt-2">
                         <h4 className="text-xs font-bold uppercase tracking-widest mb-4">{t('dash.responses')}:</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm bg-muted/20 p-4 border border-border">
                           {Object.entries(order.answersData ? JSON.parse(order.answersData) : {})
                            .map(([key, val]) => (
                             val ? (
                             <div key={key} className="wrap-break-words">
                               <div className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-1">
                                 {t(`q.${key}.title`) || key}
                               </div>
                               <div className="text-foreground/90">{renderAnswerValue(String(val))}</div>
                             </div>
                             ) : null
                           ))}
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {profile?.role === 'admin' && (
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6">{t('dash.users')}</h2>
            {users.length === 0 ? (
              <div className="p-8 border border-border bg-muted/30 text-center text-muted-fg font-medium">
                {t('dash.no_users')}
              </div>
            ) : (
              <div className="overflow-x-auto border border-border bg-background">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">{t('dash.email')}</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">{t('dash.phone')}</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">{t('dash.role')}</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">{t('dash.joined')}</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">{t('dash.orders')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      const userOrdersCount = orders.filter(o => o.userId === u.id).length;
                      return (
                        <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4 font-mono text-xs">{u.phone || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${u.role === 'admin' ? 'bg-brand-gold/20 text-brand-gold' : 'bg-muted text-muted-fg'}`}>
                               {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-fg border-b border-border">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 font-semibold">{userOrdersCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {profile?.role === 'admin' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold">{t('dash.products')}</h2>
              <button 
                onClick={handleOpenAddProduct}
                className="text-xs font-semibold uppercase tracking-widest text-brand-dark bg-brand-gold px-4 py-2 hover:bg-brand-gold/90 transition-colors"
              >
                {t('dash.add_product')}
              </button>
            </div>
            {products.length === 0 ? (
              <div className="p-8 border border-border bg-muted/30 text-center text-muted-fg font-medium">
                {t('dash.no_products')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map(prod => (
                  <div key={prod.id} className="p-6 border border-border bg-background shadow-sm flex flex-col">
                    <h3 className="text-xl font-serif font-bold mb-2">{prod.title}</h3>
                    <div className="text-2xl text-brand-gold font-serif mb-4">${prod.price}</div>
                    <p className="text-sm text-muted-fg mb-6 grow">{prod.description}</p>
                    <div className="mt-auto flex gap-2">
                      <button 
                        onClick={() => handleOpenEditProduct(prod)}
                        className="grow text-xs font-semibold uppercase tracking-widest text-foreground border border-border px-4 py-2 hover:bg-muted text-center transition-colors"
                      >
                        {t('dash.edit_product')}
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-xs font-semibold uppercase tracking-widest text-red-500 border border-red-500/30 px-3 py-2 hover:bg-red-500/10 text-center transition-colors flex items-center justify-center"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ======================================================== */}
      {/* OVERLAY I: INVOICE BUILDER & MANAGER DIALOG (ADMIN) */}
      {/* ======================================================== */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border border-border w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/15">
              <div>
                <h3 className="text-xl font-serif font-bold text-foreground">
                  Invoice Statement Compiler
                </h3>
                <p className="text-xs text-muted-fg mt-1">
                  Draft product breakdown and billing for order: <span className="text-brand-gold font-bold font-mono">{selectedOrderForInvoice.id.substring(0, 8)}</span> (Occasion: {selectedOrderForInvoice.occasion})
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrderForInvoice(null)} 
                className="text-muted-fg hover:text-foreground p-2"
              >
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
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.title} (${p.price})
                          </option>
                        ))}
                        <option value="custom">-- Create Custom Service Surcharge --</option>
                      </select>
                    </div>

                    {/* Custom text row */}
                    {chosenProductId === "custom" && (
                      <div className="grid grid-cols-1 gap-3 animate-fade-in">
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

                    {/* Add trigger */}
                    <button
                      type="button"
                      onClick={handleAddProductToInvoice}
                      className="w-full bg-foreground text-background py-2 text-xs font-bold uppercase tracking-widest hover:bg-foreground/90 transition-colors"
                    >
                      Insert Into Invoice Ledger
                    </button>
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
                      Statement #SM-INV-{selectedOrderForInvoice.id.substring(0, 6).toUpperCase()}
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
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-dashed border-border/60 last:border-0 group">
                          <span className="w-3/5 text-foreground truncate font-semibold">
                            {item.name}
                          </span>
                          <span className="w-1/5 text-center text-muted-fg">
                            {item.quantity}
                          </span>
                          <span className="w-1/5 text-right font-mono flex items-center justify-end gap-1 font-semibold text-foreground">
                            ${item.total}
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
                        ${invoiceProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                      </span>
                    </div>
                    
                    {invoiceProducts.reduce((sum, item) => sum + (item.discount || 0), 0) + generalDiscount > 0 && (
                      <div className="flex justify-between text-green-500 font-semibold">
                        <span>DISCOUNTS:</span>
                        <span>
                          -${invoiceProducts.reduce((sum, item) => sum + (item.discount || 0), 0) + generalDiscount}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between pt-2 border-t border-dashed border-foreground/30 text-sm font-bold text-foreground">
                      <span>GRAND TOTAL DUE:</span>
                      <span className="text-brand-gold font-serif text-lg">
                        ${Math.max(0, invoiceProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0) - (invoiceProducts.reduce((sum, item) => sum + (item.discount || 0), 0) + generalDiscount))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email composer triggering and save hooks */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEmailComposer(true)}
                    className="border border-brand-gold text-brand-gold hover:bg-brand-gold/5 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" /> Simulate Email Invoice
                  </button>
                  <button
                    type="button"
                    disabled={isSavingInvoice || invoiceProducts.length === 0}
                    onClick={handleSaveInvoice}
                    className="bg-brand-gold text-brand-dark py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <X className="w-4 h-4 hidden rotate-45" /> Save Statement Ledger
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* OVERLAY II: EMAIL SIMULATOR COMPOSER modal */}
      {/* ======================================================== */}
      <EmailComposerModal
        isOpen={showEmailComposer}
        order={selectedOrderForInvoice}
        invoices={invoices}
        invoiceProducts={invoiceProducts}
        generalDiscount={generalDiscount}
        onClose={() => setShowEmailComposer(false)}
      />

      {/* ======================================================== */}
      {/* OVERLAY III: MERCHANT PLATFORM SECURE PAY SANDBOX */}
      {/* ======================================================== */}
      {activePaymentOrder && activePaymentInvoice && (
        <PaymentModal
          isOpen={true}
          order={activePaymentOrder}
          invoice={{ ...activePaymentInvoice, productsJson: activePaymentInvoice.productsJson ?? '' }}
          onClose={() => { setActivePaymentOrder(null); setActivePaymentInvoice(null); }}
          onSuccess={fetchData}
        />
      )}

      {/* ======================================================== */}
      {/* OVERLAY IV: ADMIN PRODUCT CATALOG MANAGER (ADD/EDIT) */}
      {/* ======================================================== */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
        isSaving={isSavingProduct}
      />
    </div>
  );
}
// Fallback global fetchData used by handlers elsewhere in this file.
// Component-level fetchData (inside useEffect) handles state updates when mounted.
// Here we provide a simple implementation that triggers a full reload so
// the component re-mounts and fetches fresh data. Returns a Promise for await.
export async function fetchData(): Promise<void> {
  // Try a soft reload first
  try {
    // Use history/state replace to avoid adding extra entry in history
    window.location.reload();
    return Promise.resolve();
  } catch (err) {
    console.error('Failed to reload page for data refresh', err);
    return Promise.resolve();
  }
}

function redirect(arg0: string) {
  throw new Error("Function not implemented.");
}

