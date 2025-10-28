import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

// Uses service role on the server; ensure these env vars are set
const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body?.email || '').toString().trim();
    const userId = (body?.userId || null) as string | null;
    const cartId = cookies.get('mky_cart_id')?.value || '';
    if (!cartId) return new Response(JSON.stringify({ error: 'no_cart' }), { status: 400 });

    // Recompute cart totals for safety
    await supabase.rpc('recompute_cart_totals', { p_cart_id: cartId });

    const { data, error } = await supabase.rpc('order_from_cart', {
      p_cart_id: cartId,
      p_email: email || null,
      p_user_id: userId,
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });

    const orderId = data as string;
    // Optionally clear cart cookie here; we keep it for post-payment handling
    return new Response(JSON.stringify({ orderId }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'order_failed' }), { status: 500 });
  }
};


