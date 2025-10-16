import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' as any });

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const currency = cookies.get('mky_currency')?.value === 'EUR' ? 'EUR' : 'GBP';
    const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
    const cartId = cookies.get('mky_cart_id')?.value || '';
    if (!cartId) return new Response(JSON.stringify({ error: 'no_cart' }), { status: 400 });
    const { data: cart } = await supabase.from('carts').select('total_cents,currency').eq('id', cartId).single();
    const amount = Math.max(cart?.total_cents || 0, 0);
    if (amount <= 0) return new Response(JSON.stringify({ error: 'zero_amount' }), { status: 400 });
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase() as any,
      automatic_tax: { enabled: true },
    });
    return new Response(JSON.stringify({ clientSecret: intent.client_secret }), { status: 200 });
  } catch (e:any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};



