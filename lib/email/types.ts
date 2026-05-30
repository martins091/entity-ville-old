export type EmailType =
  | 'order_confirmation'
  | 'new_order_admin'
  | 'transfer_notified'
  | 'payment_verified'
  | 'status_update'
  | 'custom_message';

export type EmailOrderItem = {
  name: string;
  price?: number;
  quantity: number;
};

export type EmailOrder = {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  shipping_address: string;
  shipping_city?: string | null;
  shipping_state?: string | null;
  shipping_zip?: string | null;
  order_notes?: string | null;
  items: EmailOrderItem[];
  total: number;
  status: string;
};
