import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const stripe = new Stripe("", { apiVersion: "2024-06-20" });
const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const orderId = (body?.orderId || "").toString();
    if (!orderId) return new Response(JSON.stringify({ error: "order_required" }), { status: 400 });
    const currency = cookies.get("mky_currency")?.value === "EUR" ? "EUR" : "GBP";
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: order, error: oErr } = await supabase.from("orders").select("id,total_cents,currency,email").eq("id", orderId).single();
    if (oErr || !order) return new Response(JSON.stringify({ error: "order_not_found" }), { status: 404 });
    const amount = Math.max(order.total_cents || 0, 0);
    if (amount <= 0) return new Response(JSON.stringify({ error: "zero_amount" }), { status: 400 });
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: (order.currency || currency).toLowerCase(),
      automatic_tax: { enabled: true },
      metadata: { order_id: order.id }
    });
    await supabase.from("payments").insert({
      order_id: order.id,
      provider: "stripe",
      status: intent.status,
      amount_cents: amount,
      currency: order.currency || currency,
      intent_id: intent.id
    });
    return new Response(JSON.stringify({ clientSecret: intent.client_secret, intentId: intent.id }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
