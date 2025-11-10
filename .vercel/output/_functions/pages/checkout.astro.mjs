/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_-wwrRlvc.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Crtkq0Sq.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { r as readCurrency, l as loadCart, f as formatPrice } from '../chunks/cart_BMq2GZXG.mjs';
import '@stripe/stripe-js';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

function CheckoutClient() {
  const [clientSecret, setClientSecret] = useState(null);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("GBP");
  const [email, setEmail] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  useEffect(() => {
    (async () => {
      setCurrency(readCurrency());
      const data = await loadCart();
      const total = data?.cart?.total_cents || 0;
      setAmount(total);
    })();
  }, []);
  async function confirmOrder() {
    setPlacing(true);
    try {
      const cartId = (await import('../chunks/cart_BMq2GZXG.mjs').then(n => n.c)).getCartId?.();
      if (cartId) document.cookie = `mky_cart_id=${cartId}; Path=/; Max-Age=31536000`;
      const place = await fetch("/api/place-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email })
      });
      const placeJ = await place.json();
      if (!place.ok) throw new Error(placeJ.error || "order_failed");
      setOrderId(placeJ.orderId);
      const pi = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId: placeJ.orderId })
      });
      const piJ = await pi.json();
      if (!pi.ok) throw new Error(piJ.error || "payment_intent_failed");
      setClientSecret(piJ.clientSecret || null);
    } catch (e) {
      alert(e.message || "Checkout failed");
    } finally {
      setPlacing(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "card p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-2 text-neutral-600", children: "Amount" }),
    /* @__PURE__ */ jsx("div", { className: "text-xl font-semibold", children: formatPrice(amount, currency) }),
    !clientSecret && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 max-w-md", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          placeholder: "Email (for order confirmation)",
          className: "border p-2 rounded",
          value: email,
          onChange: (e) => setEmail(e.target.value)
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "btn btn-primary", disabled: placing || amount <= 0, onClick: confirmOrder, children: placing ? "Confirming…" : "Confirm Order" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 text-neutral-600", children: "Stripe Elements form will render on clientSecret." }),
    clientSecret ? /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-neutral-700", children: [
      "Payment intent created. Integrate Elements CardElement here for order ",
      orderId?.slice(0, 8),
      "."
    ] }) : /* @__PURE__ */ jsx("div", { className: "mt-4 text-sm text-neutral-700", children: "Add items to cart and confirm to begin payment." })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Checkout \u2014 Maison MKY" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl font-semibold mb-6">Checkout</h1> ${renderComponent($$result2, "CheckoutClient", CheckoutClient, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/CheckoutClient.tsx", "client:component-export": "default" })} ` })} `;
}, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/pages/checkout/index.astro", void 0);

const $$file = "/Users/ehabriaz/Desktop/ε/mky/apps/storefront/src/pages/checkout/index.astro";
const $$url = "/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
