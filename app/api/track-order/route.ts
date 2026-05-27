import { z } from 'zod';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getClientIp, rateLimit } from '@/lib/rate-limit/memory';
import { jsonError } from '@/lib/api/security';

const bodySchema = z.object({
  orderReference: z.string().trim().min(4).max(80),
  email: z.string().trim().email().max(180),
});

const cache = new Map<string, { expiresAt: number; data: unknown }>();

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit({ key: `track:${ip}`, limit: 20, windowMs: 60_000 });
  if (!limit.allowed) return jsonError('Too many attempts. Please try again shortly.', 429);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError('Enter a valid order reference and email address.');

  const orderReference = parsed.data.orderReference;
  const email = parsed.data.email.toLowerCase();
  const cacheKey = `${orderReference}:${email}`;
  const cached = cache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return Response.json({ ok: true, order: cached.data, cached: true });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_reference,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_zip,
      order_notes,
      items,
      total,
      status,
      created_at,
      verified_at,
      email_logs (
        id,
        type,
        status,
        sent_at,
        error_message,
        created_at
      )
    `)
    .eq('order_reference', orderReference)
    .ilike('customer_email', email)
    .maybeSingle();

  if (error) return jsonError('Unable to check this order right now.', 500);
  if (!data) return jsonError('No order matched that reference and email.', 404);

  cache.set(cacheKey, { data, expiresAt: Date.now() + 5 * 60_000 });

  return Response.json({ ok: true, order: data });
}
