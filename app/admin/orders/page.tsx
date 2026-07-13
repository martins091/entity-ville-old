"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, FileText, Mail, MapPin, MessageSquare, Phone, RefreshCw, Search, Trash2 } from 'lucide-react';
import AdminFrame from '../AdminFrame';
import { requireAdminSession } from '@/lib/supabase/admin';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type OrderRow = {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string | null;
  order_notes: string | null;
  items: {
    name: string;
    price?: number;
    quantity: number;
  }[];
  total: number;
  status: string;
  admin_note: string | null;
  verified_at: string | null;
  created_at: string;
};

type NotificationRow = {
  id: string;
  order_id: string;
  type: string;
  message: string | null;
  created_at: string;
};

type EmailLogRow = {
  id: string;
  order_id: string | null;
  order_reference: string | null;
  recipient_email: string;
  type: string;
  status: string;
  sent_at: string | null;
  error_message: string | null;
  created_at: string;
};

const statusLabels: Record<string, string> = {
  awaiting_transfer: 'Awaiting transfer',
  transfer_notified: 'Transfer notified',
  verified: 'Verified',
};

function money(value: number) {
  return `₦${Number(value || 0).toLocaleString()}`;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLogRow[]>([]);
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const notificationMap = useMemo(() => {
    return notifications.reduce<Record<string, NotificationRow[]>>((acc, note) => {
      acc[note.order_id] = acc[note.order_id] || [];
      acc[note.order_id].push(note);
      return acc;
    }, {});
  }, [notifications]);

  const emailLogMap = useMemo(() => {
    return emailLogs.reduce<Record<string, EmailLogRow[]>>((acc, log) => {
      if (!log.order_id) return acc;
      acc[log.order_id] = acc[log.order_id] || [];
      acc[log.order_id].push(log);
      return acc;
    }, {});
  }, [emailLogs]);

  const visibleOrders = orders.filter((order) => {
    const hasTransferNotice = Boolean(notificationMap[order.id]?.length);
    const computedStatus = hasTransferNotice && order.status === 'awaiting_transfer'
      ? 'transfer_notified'
      : order.status;
    const matchesStatus = status === 'all' || computedStatus === status;
    const text = `${order.order_reference} ${order.customer_name} ${order.customer_email} ${order.customer_phone || ''} ${order.shipping_city} ${order.shipping_state}`.toLowerCase();
    return matchesStatus && text.includes(query.toLowerCase());
  });

  async function loadOrders() {
    setLoading(true);
    setMessage(null);

    const { supabase, isAdmin, error } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push('/admin/login');
      return;
    }

    const [
      { data: orderRows, error: ordersError },
      { data: notificationRows, error: notificationsError },
      { data: emailRows, error: emailError },
    ] =
      await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('order_notifications').select('*').order('created_at', { ascending: false }),
        supabase.from('email_logs').select('*').order('created_at', { ascending: false }),
      ]);

    if (ordersError || notificationsError || emailError) {
      setMessage(ordersError?.message || notificationsError?.message || emailError?.message || error || 'Unable to load orders.');
    } else {
      setOrders((orderRows || []) as OrderRow[]);
      setNotifications((notificationRows || []) as NotificationRow[]);
      setEmailLogs((emailRows || []) as EmailLogRow[]);
    }

    setLoading(false);
  }

  async function verifyOrder(order: OrderRow) {
    const { supabase, isAdmin } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push('/admin/login');
      return;
    }

    const { error } = await supabase
      .from('orders')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString(),
        admin_note: 'Payment verified. Customer should receive a confirmation phone call.',
      })
      .eq('id', order.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setOrders((current) =>
      current.map((entry) =>
        entry.id === order.id
          ? {
              ...entry,
              status: 'verified',
              verified_at: new Date().toISOString(),
              admin_note: 'Payment verified. Customer should receive a confirmation phone call.',
            }
          : entry
      )
    );

    await sendOrderEmail(order, 'payment_verified');
  }

  async function getAdminToken() {
    const { data } = await getSupabaseBrowserClient()?.auth.getSession() || { data: null };
    return data?.session?.access_token || null;
  }

  async function sendOrderEmail(order: OrderRow, type: 'payment_verified' | 'status_update' | 'custom_message') {
    const token = await getAdminToken();
    if (!token) {
      setMessage('Admin session expired. Please sign in again.');
      router.push('/admin/login');
      return;
    }

    const customMessage = customMessages[order.id];
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        orderId: order.id,
        message: type === 'custom_message' ? customMessage : undefined,
      }),
    });
    const data = await response.json();

    if (!response.ok || !data.ok) {
      setMessage(data.error || data.warning || 'Email request failed.');
      return;
    }

    setMessage(data.warning || 'Email sent.');
    if (type === 'custom_message') {
      setCustomMessages((current) => ({ ...current, [order.id]: '' }));
    }
    await loadOrders();
  }

  async function deleteOrder(order: OrderRow) {
    const confirmed = window.confirm(`Delete order ${order.order_reference}? This removes it from the admin list.`);
    if (!confirmed) return;

    const { supabase, isAdmin } = await requireAdminSession();
    if (!supabase || !isAdmin) {
      router.push('/admin/login');
      return;
    }

    try {
      // First, delete related notifications (due to foreign key constraints)
      const { error: notifError } = await supabase
        .from('order_notifications')
        .delete()
        .eq('order_id', order.id);
      
      if (notifError) {
        console.error('Error deleting notifications:', notifError);
        setMessage(`Failed to delete notifications: ${notifError.message}`);
        return;
      }

      // Delete related email logs
      const { error: emailError } = await supabase
        .from('email_logs')
        .delete()
        .eq('order_id', order.id);
      
      if (emailError) {
        console.error('Error deleting email logs:', emailError);
        setMessage(`Failed to delete email logs: ${emailError.message}`);
        return;
      }

      // Finally, delete the order
      const { error, data } = await supabase
        .from('orders')
        .delete()
        .eq('id', order.id)
        .select();

      if (error) {
        console.error('Delete error:', error);
        setMessage(`Delete failed: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        setMessage(`Order ${order.order_reference} may have already been deleted.`);
      } else {
        setMessage(`Successfully deleted ${order.order_reference}.`);
      }

      // Remove from local state
      setOrders((current) => current.filter((entry) => entry.id !== order.id));
      setNotifications((current) => current.filter((entry) => entry.order_id !== order.id));
      setEmailLogs((current) => current.filter((entry) => entry.order_id !== order.id));
      
    } catch (err) {
      console.error('Unexpected error during deletion:', err);
      setMessage('An unexpected error occurred while deleting the order.');
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <AdminFrame>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Admin orders</p>
          <h1 className="mt-2 text-3xl font-black">Bank transfer verification</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Orders appear here after checkout. When a customer clicks that they have transferred, the order is marked for verification.
          </p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-blue-700"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <section className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:grid-cols-[1fr,220px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by order, name, email, phone, city, or state"
            className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All statuses</option>
          <option value="awaiting_transfer">Awaiting transfer</option>
          <option value="transfer_notified">Transfer notified</option>
          <option value="verified">Verified</option>
        </select>
      </section>

      {message && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading orders...</div>
      ) : visibleOrders.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => {
            const notes = notificationMap[order.id] || [];
            const logs = emailLogMap[order.id] || [];
            const computedStatus = notes.length && order.status === 'awaiting_transfer'
              ? 'transfer_notified'
              : order.status;

            // Format full address
            const fullAddress = [order.shipping_address, order.shipping_city, order.shipping_state, order.shipping_zip]
              .filter(Boolean)
              .join(', ');

            return (
              <article key={order.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black">{order.order_reference}</h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        computedStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : computedStatus === 'transfer_notified'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {statusLabels[computedStatus] || computedStatus}
                      </span>
                    </div>
                    
                    {/* Customer contact info */}
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium text-slate-900">
                        {order.customer_name}
                      </p>
                      <p className="text-sm text-slate-600">
                        📧 {order.customer_email}
                      </p>
                      {order.customer_phone && (
                        <p className="text-sm text-slate-600 flex items-center gap-1">
                          <Phone size={14} /> {order.customer_phone}
                        </p>
                      )}
                    </div>

                    {/* Shipping address with map icon */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1 mb-1">
                        <MapPin size={12} /> Delivery Address
                      </p>
                      <p className="text-sm text-slate-700">{fullAddress}</p>
                    </div>

                    {/* Order notes if any */}
                    {order.order_notes && (
                      <div className="mt-3 pt-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1 mb-1">
                          <FileText size={12} /> Order Notes
                        </p>
                        <p className="text-sm text-slate-600 italic bg-slate-50 p-2 rounded">
                          "{order.order_notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-2xl font-black">{money(order.total)}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(order.created_at).toLocaleString()}</p>
                    <button
                      type="button"
                      onClick={() => deleteOrder(order)}
                      className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr,280px]">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-bold">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-semibold">{money((item.price || 0) * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => sendOrderEmail(order, 'payment_verified')}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <Mail size={18} />
                      Resend verification email
                    </button>
                    {notes.length > 0 && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                        📢 Customer has notified transfer.
                      </div>
                    )}
                    {computedStatus === 'verified' ? (
                      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                        <Phone size={18} />
                        Call customer to confirm approval.
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => verifyOrder(order)}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-bold text-white hover:bg-red-600"
                      >
                        <CheckCircle2 size={18} />
                        Verify transfer
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="mb-3 flex items-center gap-2 text-sm font-bold">
                      <MessageSquare size={16} />
                      Send custom email
                    </p>
                    <textarea
                      value={customMessages[order.id] || ''}
                      onChange={(event) =>
                        setCustomMessages((current) => ({ ...current, [order.id]: event.target.value }))
                      }
                      rows={3}
                      placeholder="Write a short message for this customer"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => sendOrderEmail(order, 'custom_message')}
                      disabled={!customMessages[order.id]?.trim()}
                      className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Mail size={16} />
                      Send message
                    </button>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="mb-3 text-sm font-bold">Email history</p>
                    {logs.length ? (
                      <div className="space-y-2">
                        {logs.slice(0, 5).map((log) => (
                          <div key={log.id} className="rounded-lg bg-slate-50 p-3 text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold">{log.type.replaceAll('_', ' ')}</span>
                              <span className={log.status === 'sent' ? 'text-emerald-700' : 'text-red-600'}>
                                {log.status}
                              </span>
                            </div>
                            <p className="mt-1 text-slate-500">
                              {new Date(log.sent_at || log.created_at).toLocaleString()}
                            </p>
                            {log.error_message && <p className="mt-1 text-red-600">{log.error_message}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No email logs yet.</p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AdminFrame>
  );
}