import { z } from 'zod';
import { assertAdminRequest, getSupabaseServerClient } from '@/lib/supabase/server';
import { jsonError, assertSameOrigin } from '@/lib/api/security';
import { getClientIp, rateLimit } from '@/lib/rate-limit/memory';
import { normalizeEmailOrder, sendOrderEmail } from '@/lib/email/sendEmail';
import type { EmailType } from '@/lib/email/types';

const bodySchema = z.object({
  type: z.enum(['order_confirmation', 'transfer_notified', 'payment_verified', 'status_update', 'custom_message']),
  orderReference: z.string().trim().min(4).max(80).optional(),
  orderId: z.string().uuid().optional(),
  email: z.string().trim().email().max(180).optional(),
  message: z.string().trim().max(2000).optional(),
});

const publicTypes = new Set<EmailType>(['order_confirmation', 'transfer_notified']);

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError('Invalid request origin.', 403);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError('Invalid email request.');

  const { type, orderReference, orderId, email, message } = parsed.data;
  const isPublicType = publicTypes.has(type);

  if (isPublicType) {
    const ip = getClientIp(request);
    const limit = rateLimit({ key: `public-email:${type}:${ip}`, limit: 8, windowMs: 10 * 60_000 });
    if (!limit.allowed) return jsonError('Too many email attempts. Please try again later.', 429);
  } else {
    const admin = await assertAdminRequest(request);
    if (!admin.ok) return jsonError(admin.error, 401);
  }

  const supabase = getSupabaseServerClient();
  let query = supabase.from('orders').select('*');

  if (orderId) query = query.eq('id', orderId);
  else if (orderReference) query = query.eq('order_reference', orderReference);
  else return jsonError('Missing order identifier.');

  if (isPublicType) {
    if (!email) return jsonError('Email is required.');
    query = query.ilike('customer_email', email.toLowerCase());
  }

  const { data, error } = await query.maybeSingle();
  if (error) return jsonError('Unable to load order for email.', 500);
  if (!data) return jsonError('Order not found.', 404);

  const order = normalizeEmailOrder(data);
  const shouldNotifyAdmin = type === 'order_confirmation' && !data.confirmation_sent;

  const result = await sendOrderEmail({
    order,
    type,
    message,
  });

  if (shouldNotifyAdmin) {
    await sendOrderEmail({
      order,
      type: 'new_order_admin',
    });
  }

  if (!result.ok) {
    return Response.json({
      ok: true,
      warning: 'Email could not be sent immediately. The failure was logged.',
    });
  }

  return Response.json({ ok: true });
}
