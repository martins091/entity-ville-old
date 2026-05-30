import * as React from 'react';
import OrderConfirmation from './templates/OrderConfirmation';
import AdminNewOrder from './templates/AdminNewOrder';
import PaymentVerified from './templates/PaymentVerified';
import StatusUpdate from './templates/StatusUpdate';
import TransferNotified from './templates/TransferNotified';
import { emailConfig, getResendClient } from './client';
import type { EmailOrder, EmailType } from './types';
import { getSupabaseServerClient } from '@/lib/supabase/server';

type SendOrderEmailInput = {
  order: EmailOrder;
  type: EmailType;
  message?: string;
};

const subjects: Record<EmailType, string> = {
  order_confirmation: 'Your Entity Ville order confirmation',
  new_order_admin: 'New Entity Ville order received',
  transfer_notified: 'We received your transfer notice',
  payment_verified: 'Your payment has been verified',
  status_update: 'Order status update from Entity Ville',
  custom_message: 'Message from Entity Ville about your order',
};

const sentColumns: Partial<Record<EmailType, string>> = {
  order_confirmation: 'confirmation_sent',
  transfer_notified: 'transfer_notified_sent',
  payment_verified: 'verified_sent',
  status_update: 'ready_sent',
};

function templateFor({ order, type, message }: SendOrderEmailInput) {
  if (type === 'order_confirmation') return <OrderConfirmation order={order} />;
  if (type === 'new_order_admin') return <AdminNewOrder order={order} />;
  if (type === 'transfer_notified') return <TransferNotified order={order} />;
  if (type === 'payment_verified') return <PaymentVerified order={order} />;
  return <StatusUpdate order={order} message={message || 'Your order status has been updated.'} />;
}

export async function logEmail({
  order,
  type,
  status,
  providerMessageId,
  errorMessage,
  recipientEmail,
}: {
  order: EmailOrder;
  type: EmailType;
  status: 'sent' | 'failed';
  providerMessageId?: string;
  errorMessage?: string;
  recipientEmail?: string;
}) {
  const supabase = getSupabaseServerClient();

  await supabase.from('email_logs').insert({
    order_id: order.id,
    order_reference: order.order_reference,
    recipient_email: recipientEmail || order.customer_email,
    type,
    status,
    provider_message_id: providerMessageId || null,
    error_message: errorMessage || null,
    sent_at: status === 'sent' ? new Date().toISOString() : null,
  });

  const column = sentColumns[type];
  if (status === 'sent' && column) {
    await supabase.from('orders').update({ [column]: true }).eq('id', order.id);
  }
}

export async function sendOrderEmail(input: SendOrderEmailInput) {
  const recipientEmail = input.type === 'new_order_admin'
    ? emailConfig.adminOrderEmail
    : input.order.customer_email;

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: emailConfig.from,
      to: recipientEmail,
      replyTo: emailConfig.replyTo,
      subject: subjects[input.type],
      react: templateFor(input) as React.ReactElement,
    });

    if (result.error) {
      await logEmail({
        order: input.order,
        type: input.type,
        status: 'failed',
        errorMessage: result.error.message,
        recipientEmail,
      });
      return { ok: false, error: result.error.message };
    }

    await logEmail({
      order: input.order,
      type: input.type,
      status: 'sent',
      providerMessageId: result.data?.id,
      recipientEmail,
    });

    return { ok: true, id: result.data?.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email failed to send.';

    try {
      await logEmail({
        order: input.order,
        type: input.type,
        status: 'failed',
        errorMessage: message,
        recipientEmail,
      });
    } catch (logError) {
      console.error('Unable to log email failure', logError);
    }

    return { ok: false, error: message };
  }
}

export function normalizeEmailOrder(row: Record<string, any>): EmailOrder {
  return {
    id: row.id,
    order_reference: row.order_reference,
    customer_name: row.customer_name,
    customer_email: row.customer_email,
    customer_phone: row.customer_phone,
    shipping_address: row.shipping_address,
    shipping_city: row.shipping_city,
    shipping_state: row.shipping_state,
    shipping_zip: row.shipping_zip,
    order_notes: row.order_notes,
    items: Array.isArray(row.items) ? row.items : [],
    total: Number(row.total || 0),
    status: row.status,
  };
}
