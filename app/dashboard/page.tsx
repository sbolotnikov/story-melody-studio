'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type DashboardOrder = {
  id: string;
  projectType?: string;
  status?: string;
  paid?: boolean;
  createdAt?: { toDate?: () => Date };
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

type DashboardProduct = {
  id: string;
  title?: string;
  price?: string | number;
  description?: string;
};

type DashboardUser = {
  id: string;
  email?: string;

  phone?: string;
  role?: string;
  createdAt?: { toDate?: () => Date };
};

type DashboardProfile = {
  name?: string;
  phone?: string;
  image?: string;
  role?: string;
};

export default function Dashboard() {
  const auth = useAuth();
  const user = auth?.user;
  const profile = auth?.profile as DashboardProfile | undefined;
  const loading = auth?.loading;
  const updateProfile = auth?.updateProfile;
  const resetPassword = auth?.resetPassword;

  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [phoneInput, setPhoneInput] = useState('');
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [filterArchived, setFilterArchived] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {},
  );

  const [profileData, setProfileData] = useState(() => ({
    name: user?.name || '',
    phone: user?.phone || '',
    image: user?.image || '',
  }));
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const fetchData = useCallback(async () => {
    if (!user || loading) return;
    try {
      if (profile?.role === 'admin') {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          fetch('/api/orders').then((r) => r.json().catch(() => [])),
          fetch('/api/users').then((r) => r.json().catch(() => [])),
          fetch('/api/products').then((r) => r.json().catch(() => [])),
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
      console.error('Failed to load data', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [user, profile, loading]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || loading) return;
      await fetchData();
    };

    void loadDashboardData();
  }, [fetchData]);

  if (loading || isLoadingData) {
    return (
      <div className="grow flex items-center justify-center p-24 text-muted-fg font-semibold uppercase tracking-widest text-xs">
        Loading...
      </div>
    );
  }

  if (!user) {
    redirect('/auth');
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateProfile) return;
    setIsSavingProfile(true);
    setProfileMessage('');
    try {
      const profileUpdate: { name: string; phone: string; image?: string } =
        {
          name: profileData.name.trim(),
          phone: profileData.phone.trim(),
          ...(profileData.image.trim()
            ? { image: profileData.image.trim() }
            : {}),
        };
      await updateProfile(profileUpdate);
      // Reflect saved values in the local form state so UI updates immediately
      setProfileData(prev => ({ ...prev, ...profileUpdate }));
      setProfileMessage('Profile updated successfully');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setProfileMessage('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email || !resetPassword) return;
    try {
      await resetPassword(user.email);
      setProfileMessage('Password reset email sent');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setProfileMessage('Failed to send reset email');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayOrder = async (orderId: string) => {
    if (profile?.role !== 'admin') {
      alert('This is a mock payment for testing. Your order is now paid!');
    }
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paid: true }),
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchiveOrder = async (orderId: string, archived: boolean) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived }),
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (profile && !profile.phone && profile.role !== 'admin') {
    return (
      <div className="grow flex items-center justify-center py-24 px-4 bg-background">
        <div className="w-full max-w-md border border-border bg-muted p-8 shadow-2xl relative">
          <h2 className="text-2xl font-serif font-bold mb-4">
            Complete Profile
          </h2>
          <p className="text-sm text-muted-fg mb-6">
            We need your phone number to communicate with you about your
            customized gifts and questionnaires.
          </p>
          <form onSubmit={handleSavePhone} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">
                Phone Number
              </label>
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
              {isSavingPhone ? 'Saving...' : 'Save Phone Number'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="grow flex flex-col py-16 px-4 max-w-7xl mx-auto w-full">
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12 border-b border-border pb-6">
        {profile?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
      </h1>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-serif font-bold mb-6">
            Profile Settings
          </h2>
          <form
            className="max-w-2xl border border-border bg-background p-6 space-y-4"
            onSubmit={handleUpdateProfile}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
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
                <p className="text-xs text-muted-fg mt-2">Paste an image URL above to preview your avatar.</p>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                      placeholder="Your Phone"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-fg mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={profileData.image}
                    onChange={(e) =>
                      setProfileData({ ...profileData, image: e.target.value })
                    }
                    className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border mt-6">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="bg-brand-gold text-brand-dark px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
              >
                {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={handleResetPassword}
                className="border border-border text-foreground px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                Reset Password
              </button>
            </div>
            {profileMessage && (
              <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mt-4">
                {profileMessage}
              </p>
            )}
          </form>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold">Orders</h2>
            {profile?.role === 'admin' && (
              <div className="flex gap-4">
                <button
                  onClick={() => setFilterArchived(!filterArchived)}
                  className="text-xs font-semibold uppercase tracking-widest text-muted-fg hover:text-foreground"
                >
                  {filterArchived ? 'Show Active' : 'Show Archived'}
                </button>
              </div>
            )}
          </div>
          {orders.filter((o) =>
            profile?.role === 'admin' ? !!o.archived === filterArchived : true,
          ).length === 0 ? (
            <div className="p-8 border border-border bg-muted/30 text-center text-muted-fg font-medium">
              No orders found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders
                .filter((o) =>
                  profile?.role === 'admin'
                    ? !!o.archived === filterArchived
                    : true,
                )
                .map((order) => (
                  <div
                    key={order.id}
                    className="p-6 border border-border bg-background shadow-sm flex flex-col gap-6"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="grow">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
                            {order.projectType}
                          </span>
                          <span
                            className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-500/10 text-green-500' : order.status === 'In production' ? 'bg-blue-500/10 text-blue-500' : order.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-muted text-muted-fg'}`}
                          >
                            {order.status || 'New'}
                          </span>
                          <span
                            className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${order.paid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                          >
                            {order.paid ? 'Paid' : 'Unpaid'}
                          </span>
                          <span className="text-xs text-muted-fg ml-auto">
                            {order.createdAt?.toDate
                              ? order.createdAt.toDate().toLocaleDateString()
                              : 'Just now'}
                          </span>
                        </div>
                        <div className="text-lg font-bold mb-2">
                          {order.occasion || 'General Questionnaire'}
                        </div>
                        <div className="text-sm text-foreground/80 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-border pb-4">
                          <div>
                            <strong>Date:</strong> {order.date || 'TBD'}
                          </div>
                          <div>
                            <strong>Language:</strong>{' '}
                            {order.language || 'English'}
                          </div>
                          {profile?.role === 'admin' && (
                            <>
                              <div className="text-brand-gold">
                                <strong>Email:</strong>{' '}
                                {order.email ||
                                  users.find((u) => u.id === order.userId)
                                    ?.email ||
                                  'N/A'}
                              </div>
                              <div className="text-brand-gold">
                                <strong>Phone:</strong>{' '}
                                {order.phone ||
                                  users.find((u) => u.id === order.userId)
                                    ?.phone ||
                                  'N/A'}
                              </div>
                            </>
                          )}
                        </div>
                        {/* Summary for admin */}
                        {profile?.role === 'admin' && (
                          <div className="text-xs text-muted-fg space-y-1 mb-4">
                            {order.hero && (
                              <p>
                                <strong>Hero:</strong> {order.hero}
                              </p>
                            )}
                            {order.story && (
                              <p>
                                <strong>Story:</strong> {order.story}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 min-w-35 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 justify-center">
                        {profile?.role === 'admin' && (
                          <select
                            value={order.status || 'New'}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value)
                            }
                            className="text-xs font-semibold uppercase tracking-widest bg-background border border-border p-2 focus:outline-none focus:border-brand-gold"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In production">In production</option>
                            <option value="Completed">Completed</option>
                          </select>
                        )}

                        {!order.paid && profile?.role !== 'admin' && (
                          <button
                            onClick={() => handlePayOrder(order.id)}
                            className="text-xs font-bold uppercase tracking-widest bg-brand-gold text-brand-dark hover:bg-brand-gold/90 transition-colors py-3 px-4 text-center"
                          >
                            Pay Now
                          </button>
                        )}

                        {!order.paid && profile?.role === 'admin' && (
                          <button
                            onClick={() => handlePayOrder(order.id)}
                            className="text-xs font-bold uppercase tracking-widest border border-green-500 text-green-500 hover:bg-green-500/10 transition-colors py-2 px-4 text-center"
                          >
                            Mark Paid
                          </button>
                        )}

                        {profile?.role === 'admin' ? (
                          <button
                            onClick={() =>
                              setExpandedOrders((prev) => ({
                                ...prev,
                                [order.id]: !prev[order.id],
                              }))
                            }
                            className="text-xs font-semibold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 transition-colors py-2 text-center border border-brand-gold/20 hover:border-brand-gold"
                          >
                            {expandedOrders[order.id]
                              ? 'Hide Details'
                              : 'View Details'}
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                setExpandedOrders((prev) => ({
                                  ...prev,
                                  [order.id]: !prev[order.id],
                                }))
                              }
                              className="text-xs font-semibold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 transition-colors py-2 text-center border border-brand-gold/20 hover:border-brand-gold mt-1"
                            >
                              {expandedOrders[order.id]
                                ? 'Hide Details'
                                : 'View Details'}
                            </button>
                            <Link
                              href={`/questionnaire?orderId=${order.id}`}
                              className="text-xs font-semibold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 transition-colors py-2 text-center border border-brand-gold/20 hover:border-brand-gold mt-1"
                            >
                              Edit Questionnaire
                            </Link>
                          </>
                        )}

                        {profile?.role === 'admin' && (
                          <button
                            onClick={() =>
                              handleArchiveOrder(order.id, !order.archived)
                            }
                            className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-brand-gold transition-colors py-2 text-center"
                          >
                            {order.archived ? 'Unarchive' : 'Archive'}
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-xs font-semibold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors py-2 text-center"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {expandedOrders[order.id] && (
                      <div className="border-t border-border pt-4 mt-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4">
                          Questionnaire Responses:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm bg-muted/20 p-4 border border-border">
                          {Object.entries(
                            order.answersData
                              ? JSON.parse(order.answersData)
                              : {},
                          ).map(([key, val]) =>
                            val ? (
                              <div key={key} className="wrap-break-words">
                                <div className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-1">
                                  {key}
                                </div>
                                <div className="text-foreground/90">
                                  {String(val)}
                                </div>
                              </div>
                            ) : null,
                          )}
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
            <h2 className="text-2xl font-serif font-bold mb-6">Users</h2>
            {users.length === 0 ? (
              <div className="p-8 border border-border bg-muted/30 text-center text-muted-fg font-medium">
                No users found.
              </div>
            ) : (
              <div className="overflow-x-auto border border-border bg-background">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">
                        Email
                      </th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">
                        Phone
                      </th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">
                        Role
                      </th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">
                        Joined
                      </th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-widest text-xs">
                        Orders
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const userOrdersCount = orders.filter(
                        (o) => o.userId === u.id,
                      ).length;
                      return (
                        <tr
                          key={u.id}
                          className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4 font-mono text-xs">
                            {u.phone || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${u.role === 'admin' ? 'bg-brand-gold/20 text-brand-gold' : 'bg-muted text-muted-fg'}`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-fg">
                            {u.createdAt?.toDate
                              ? u.createdAt.toDate().toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {userOrdersCount}
                          </td>
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
              <h2 className="text-2xl font-serif font-bold">Products</h2>
              <button className="text-xs font-semibold uppercase tracking-widest text-brand-dark bg-brand-gold px-4 py-2 hover:bg-brand-gold/90 transition-colors">
                Add Product
              </button>
            </div>
            {products.length === 0 ? (
              <div className="p-8 border border-border bg-muted/30 text-center text-muted-fg font-medium">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-6 border border-border bg-background shadow-sm flex flex-col"
                  >
                    <h3 className="text-xl font-serif font-bold mb-2">
                      {prod.title}
                    </h3>
                    <div className="text-2xl text-brand-gold font-serif mb-4">
                      {prod.price}
                    </div>
                    <p className="text-sm text-muted-fg mb-6 grow">
                      {prod.description}
                    </p>
                    <button className="mt-auto text-xs font-semibold uppercase tracking-widest text-foreground border border-border px-4 py-2 hover:bg-muted text-center transition-colors">
                      Edit Product
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
