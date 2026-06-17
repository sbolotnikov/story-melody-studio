'use client';
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import Image from "next/image";

export default function Dashboard() {
  type Order = {
    id: string;
    archived?: boolean;
    projectType?: string;
    status?: string;
    paid?: boolean;
    createdAt?: string | Date;
    occasion?: string;
    date?: string;
    language?: string;
    email?: string;
    phone?: string;
    userId?: string;
    hero?: string;
    story?: string;
    answersData?: string;
  };

  type UserItem = {
    id: string;
    email?: string;
    phone?: string;
    role?: string;
    createdAt?: string | Date;
  };

  type Product = {
    id: string;
    title?: string;
    price?: string | number;
    description?: string;
  };
  const auth = useAuth();
  const { t } = useTranslation();
  const { user, profile, loading, updateProfile, resetPassword, updateUserPassword } = auth ?? {};

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [phoneInput, setPhoneInput] = useState("");
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [filterArchived, setFilterArchived] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    image: "",
    currentPassword: "",
    password: "",
    confirmPassword: ""
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    if (!profile) return;

    const timeoutId = window.setTimeout(() => {
      setProfileData({
        name: profile.name || "",
        phone: profile.phone || "",
        image: profile.image || "",
        currentPassword: "",
        password: "",
        confirmPassword: ""
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [profile]);

  const fetchData = useCallback(async () => {
    if (!user || loading) return;
    try {
      if (profile?.role === 'admin') {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          fetch("/api/orders").then(r => r.json().catch(() => [])),
          fetch("/api/users").then(r => r.json().catch(() => [])),
          fetch("/api/products").then(r => r.json().catch(() => []))
        ]);
        setOrders(Array.isArray(ordersRes) ? ordersRes : []);
        setUsers(Array.isArray(usersRes) ? usersRes : []);
        setProducts(Array.isArray(productsRes) ? productsRes : []);
      } else {
        const res = await fetch(`/api/orders?userId=${user.id}`);
        const data = await res.json().catch(() => []);
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setIsLoadingData(false);
    }
  }, [user, profile, loading]);

  useEffect(() => {
    // Avoid calling setState synchronously inside the effect body —
    // schedule the data fetch to run after the current render frame.
    if (!user || loading) return;
    void Promise.resolve().then(() => fetchData());
  }, [fetchData, user, loading]);

  if (!auth) {
    redirect("/auth");
    return null;
  }

  if (loading || isLoadingData) {
    return <div className="grow flex items-center justify-center p-24 text-muted-fg font-semibold uppercase tracking-widest text-xs">Loading...</div>;
  }

  if (!user) {
    return redirect("/auth");
  }

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || typeof updateProfile !== 'function') return;
    setIsSavingPhone(true);
    try {
      await updateProfile({ phone: phoneInput.trim() });
    } finally {
      setIsSavingPhone(false);
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

    try {
      // If user provided a new password, require currentPassword if available
      if (profileData.password) {
        if (typeof updateUserPassword !== 'function') {
          throw new Error('updateUserPassword is not available');
        }
        await updateUserPassword(profileData.password,  undefined);
      }

      if (typeof updateProfile !== 'function') {
        throw new Error('updateProfile is not available');
      }

      await updateProfile({
        name: profileData.name.trim(),
        phone: profileData.phone.trim(),
        image: profileData.image.trim(),
      });
      setProfileMessage("Profile updated successfully");
      setProfileData(prev => ({ ...prev, currentPassword: "", password: "", confirmPassword: "" }));
      setTimeout(() => setProfileMessage(""), 3000);
    } catch (err: unknown) {
      console.error(err);
      const getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) return error.message;
        if (typeof error === "object" && error !== null) {
          const errObj = error as Record<string, unknown>;
          if (typeof errObj.message === "string") return errObj.message;
          if (typeof errObj.error === "string") return errObj.error;
        }
        return "Failed to update profile";
      };
      const msg = getErrorMessage(err);
      if (msg === 'auth/requires-recent-login') {
        setProfileMessage("Please re-authenticate (logout and log back in) to update your password");
      } else {
        setProfileMessage(msg);
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      if (typeof resetPassword !== 'function') throw new Error('resetPassword not available');
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

  const handlePayOrder = async (orderId: string) => {
    if (profile?.role !== 'admin') {
      alert("This is a mock payment for testing. Your order is now paid!");
    }
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: true })
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
            <div className="w-full shrink-0 flex items-center justify-center gap-6">
                {/* Avatar preview */}
                {profileData.image ? (
                  <div className="w-28 h-28 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
                    <img
                      src={profileData.image}
                      alt={profileData.name || 'Avatar'}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full flex items-center justify-center bg-muted border border-border text-muted-fg font-semibold">
                    {profileData.name ? profileData.name.split(' ').map(s=>s[0]).slice(0,2).join('') : 'U'}
                  </div>
                )}
                {/* <p className="text-xs text-muted-fg mt-2">Paste an image URL above to preview your avatar.</p> */}
              </div>
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
                value={profileData.image}
                onChange={(e) => setProfileData({...profileData, image: e.target.value})}
                className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('dash.new_pass')}</label>
                <input
                  type="password"
                  value={profileData.password}
                  onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                  className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="New password"
                />
              </div>
              <div className="flex flex-col items-start justify-between">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">{t('dash.confirm_pass')}</label>
                <input
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                  className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="Confirm new password"
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
              
              {/* <button
                type="button"
                onClick={handleResetPassword}
                className="border border-border text-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                {t('dash.reset_pass')}
              </button> */}
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
              {orders.filter(o => profile?.role === 'admin' ? !!o.archived === filterArchived : true).map(order => (
                <div key={order.id} className="p-6 border border-border bg-background shadow-sm flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                  <div className="grow">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">{order.projectType}</span>
                      <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-500/10 text-green-500' : order.status === 'In production' ? 'bg-blue-500/10 text-blue-500' : order.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-muted text-muted-fg'}`}>
                         {t(`dash.status_${(order.status || 'new').toLowerCase().replace(' ', '_')}`) || order.status || t('dash.status_new')}
                      </span>
                      <span className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${order.paid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                         {order.paid ? t('dash.paid') : t('dash.unpaid')}
                      </span>
                      <span className="text-xs text-muted-fg ml-auto">
                        {
                            order.createdAt
                            ? (typeof (order.createdAt as unknown as { toDate?: () => Date })?.toDate === 'function'
                              ? (order.createdAt as unknown as { toDate: () => Date }).toDate().toLocaleDateString()
                              : (order.createdAt instanceof Date
                                ? (order.createdAt as Date).toLocaleDateString()
                                : new Date(order.createdAt as string).toLocaleDateString()))
                            : 'Just now'
                        }
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
                    
                    {!order.paid && profile?.role !== 'admin' && (
                       <button
                         onClick={() => handlePayOrder(order.id)}
                         className="text-xs font-bold uppercase tracking-widest bg-brand-gold text-brand-dark hover:bg-brand-gold/90 transition-colors py-3 px-4 text-center"
                       >
                         {t('dash.payment')}
                       </button>
                    )}

                    {!order.paid && profile?.role === 'admin' && (
                       <button
                         onClick={() => handlePayOrder(order.id)}
                         className="text-xs font-bold uppercase tracking-widest border border-green-500 text-green-500 hover:bg-green-500/10 transition-colors py-2 px-4 text-center"
                       >
                         {t('dash.mark_paid')}
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
                             <div className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-1">{key}</div>
                             <div className="text-foreground/90">{String(val)}</div>
                           </div>
                           ) : null
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              ))}
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
                          <td className="px-6 py-4 text-muted-fg">
                            {(u.createdAt && (u.createdAt as unknown as { toDate?: () => Date })?.toDate)
                              ? (u.createdAt as unknown as { toDate: () => Date }).toDate().toLocaleDateString()
                              : 'N/A'}
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
              <button className="text-xs font-semibold uppercase tracking-widest text-brand-dark bg-brand-gold px-4 py-2 hover:bg-brand-gold/90 transition-colors">
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
                    <div className="text-2xl text-brand-gold font-serif mb-4">{prod.price}</div>
                    <p className="text-sm text-muted-fg mb-6 grow">{prod.description}</p>
                    <button className="mt-auto text-xs font-semibold uppercase tracking-widest text-foreground border border-border px-4 py-2 hover:bg-muted text-center transition-colors">
                      {t('dash.edit_product')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}