import { getSupabaseBrowserClient } from './client';

export type OrderItem = {
  id: string | number;
  name: string;
  price?: number;
  quantity: number;
  image?: string;
  slug?: string;
  size?: string;
  weight?: string;
  partNumber?: string;
  material?: string;
  requiresQuote?: boolean;
};

export type CustomerDetails = {
  name: string;
  email: string;
  phone: string; // Made required instead of optional
  address: string;
  city: string;
  state: string;
  zipCode?: string; // Optional field
  orderNotes?: string; // Optional field
};

export type StoredOrder = {
  id: string;
  order_reference: string;
  public_token: string;
  customer: CustomerDetails;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
};

function makeOrderReference() {
  return `ORD-${Date.now()}`;
}

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getLocalOrders() {
  return JSON.parse(localStorage.getItem('entityville.orders') || '[]') as StoredOrder[];
}

function saveLocalOrder(order: StoredOrder) {
  localStorage.setItem('entityville.orders', JSON.stringify([order, ...getLocalOrders()]));
  localStorage.setItem('entityville.orderId', order.id);
  localStorage.setItem('entityville.orderToken', order.public_token);
}

export async function createStorefrontOrder({
  customer,
  items,
  total,
}: {
  customer: CustomerDetails;
  items: OrderItem[];
  total: number;
}) {
  const order: StoredOrder = {
    id: makeId(),
    order_reference: makeOrderReference(),
    public_token: makeId(),
    customer,
    items,
    total,
    status: 'awaiting_transfer',
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { error } = await supabase.from('orders').insert({
      id: order.id,
      order_reference: order.order_reference,
      public_token: order.public_token,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: customer.address,
      shipping_city: customer.city,
      shipping_state: customer.state,
      shipping_zip: customer.zipCode || null,
      order_notes: customer.orderNotes || null,
      items,
      total,
      status: order.status,
    });

    if (error) {
      console.error('Unable to create Supabase order, using local fallback', error);
    }
  }

  saveLocalOrder(order);
  return order;
}

export function getStoredOrder(orderId: string | null) {
  if (!orderId) return null;
  return getLocalOrders().find((order) => order.id === orderId) || null;
}

export async function notifyTransfer(order: StoredOrder) {
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    await supabase
      .from('orders')
      .update({ status: 'transfer_notified' })
      .eq('id', order.id)
      .eq('public_token', order.public_token);

    const { error } = await supabase.from('order_notifications').insert({
      order_id: order.id,
      public_token: order.public_token,
      type: 'transfer_notified',
      message: `${order.customer.name} (${order.customer.phone}) says bank transfer has been made. Delivery to: ${order.customer.address}, ${order.customer.city}, ${order.customer.state}`,
    });

    if (error) {
      console.error('Unable to create transfer notification', error);
      throw error;
    }
  }

  const updatedOrders = getLocalOrders().map((entry) =>
    entry.id === order.id
      ? { ...entry, status: 'transfer_notified' }
      : entry
  );
  localStorage.setItem('entityville.orders', JSON.stringify(updatedOrders));
  localStorage.removeItem('entityville.orderId');
  localStorage.removeItem('entityville.orderToken');
}
