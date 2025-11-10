import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body?.email || "").toString().trim();
    const userId = body?.userId || null;
    const cartId = cookies.get("mky_cart_id")?.value || "";
    if (!cartId) return new Response(JSON.stringify({ error: "no_cart" }), { status: 400 });
    await supabase.rpc("recompute_cart_totals", { p_cart_id: cartId });
    const { data, error } = await supabase.rpc("order_from_cart", {
      p_cart_id: cartId,
      p_email: email || null,
      p_user_id: userId
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    const orderId = data;
    return new Response(JSON.stringify({ orderId }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "order_failed" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
