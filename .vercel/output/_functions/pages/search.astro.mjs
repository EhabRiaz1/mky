/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_-wwrRlvc.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Crtkq0Sq.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { g as getSupabase } from '../chunks/supabaseClient_C3Q-m5UZ.mjs';
/* empty css                                  */
export { renderers } from '../renderers.mjs';

function SearchClient() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    const id = setTimeout(async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      if (!q) {
        setResults([]);
        return;
      }
      const { data } = await supabase.from("products").select("id,title,handle").ilike("title", `%${q}%`).limit(20);
      setResults(data || []);
    }, 250);
    return () => clearTimeout(id);
  }, [q]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("input", { className: "border p-2 rounded w-full", placeholder: "Search products", value: q, onChange: (e) => setQ(e.target.value) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-4", children: results.map((r) => /* @__PURE__ */ jsxs("a", { href: `/product?handle=${encodeURIComponent(r.handle)}`, className: "block border p-3 rounded hover:shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "font-medium", children: r.title }),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-neutral-600", children: r.handle })
    ] }, r.id)) })
  ] });
}

const $$Search = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Search \u2014 Maison MKY" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl font-semibold mb-6">Search</h1> ${renderComponent($$result2, "SearchClient", SearchClient, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/SearchClient.tsx", "client:component-export": "default" })} ` })} `;
}, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/pages/search.astro", void 0);

const $$file = "/Users/ehabriaz/Desktop/ε/mky/apps/storefront/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
