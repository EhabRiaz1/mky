/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_-wwrRlvc.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Crtkq0Sq.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { r as readCurrency, e as ensureCart, l as loadCart, f as formatPrice, a as removeItem } from '../chunks/cart_BMq2GZXG.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

function CartClient() {
  const [state, setState] = useState({ cart: null, items: [] });
  const [currency, setCurrency] = useState(readCurrency());
  useEffect(() => {
    (async () => {
      await ensureCart(currency);
      const data = await loadCart();
      if (data) setState(data);
    })();
  }, [currency]);
  const total = state.cart?.total_cents || 0;
  return /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [
    /* @__PURE__ */ jsx("div", { className: "md:col-span-2 space-y-4", children: state.items.map((it) => /* @__PURE__ */ jsxs("div", { className: "card p-4 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: it.title || "Item" }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-neutral-600", children: [
          "Qty: ",
          it.quantity
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-sm", children: formatPrice(it.unit_price_cents, currency) }),
      /* @__PURE__ */ jsx("button", { className: "btn btn-outline", onClick: async () => {
        await removeItem(it.id);
        const data = await loadCart();
        if (data) setState(data);
      }, children: "Remove" })
    ] }, it.id)) }),
    /* @__PURE__ */ jsxs("aside", { className: "card p-4 h-fit", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "text-neutral-600", children: "Total" }),
        /* @__PURE__ */ jsx("div", { className: "font-semibold", children: formatPrice(total, currency) })
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/checkout", className: "btn btn-primary w-full mt-4 text-center", children: "Checkout" })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Cart \u2014 Maison MKY" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl font-semibold mb-6">Your Cart</h1> ${renderComponent($$result2, "CartClient", CartClient, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/CartClient.tsx", "client:component-export": "default" })} ` })} `;
}, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/pages/cart/index.astro", void 0);

const $$file = "/Users/ehabriaz/Desktop/ε/mky/apps/storefront/src/pages/cart/index.astro";
const $$url = "/cart";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
