import { z } from 'zod';
import { jsonError, assertSameOrigin } from '@/lib/api/security';
import { getClientIp, rateLimit } from '@/lib/rate-limit/memory';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { normalizeEmailOrder, sendOrderEmail } from '@/lib/email/sendEmail';

const bodySchema = z.object({
  orderReference: z.string().trim().min(4).max(80),
  email: z.string().trim().email().max(180),
});

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) return jsonError('Invalid request origin.', 403);

  const ip = getClientIp(request);
  const limit = rateLimit({ key: `resend:${ip}`, limit: 5, windowMs: 10 * 60_000 });
  if (!limit.allowed) return jsonError('Too many resend attempts. Please try again later.', 429);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError('Enter a valid order reference and email address.');

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_reference', parsed.data.orderReference)
    .ilike('customer_email', parsed.data.email.toLowerCase())
    .maybeSingle();

  if (error) return jsonError('Unable to find this order right now.', 500);
  if (!data) return jsonError('No order matched that reference and email.', 404);

  const result = await sendOrderEmail({
    order: normalizeEmailOrder(data),
    type: 'order_confirmation',
  });

  if (!result.ok) {
    return Response.json({
      ok: true,
      warning: 'Order found, but email could not be sent immediately. We logged the issue.',
    });
  }

  return Response.json({ ok: true });
}
