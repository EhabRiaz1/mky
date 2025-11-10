/* empty css                                 */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_-wwrRlvc.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Crtkq0Sq.mjs';
import { P as ProductGrid } from '../chunks/ProductGrid_Ian9hGa8.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Men \u2014 Maison MKY" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl font-semibold mb-6">Men</h1> ${renderComponent($$result2, "ProductGrid", ProductGrid, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/ProductGrid.tsx", "client:component-export": "default" })} ` })} `;
}, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/pages/men/index.astro", void 0);

const $$file = "/Users/ehabriaz/Desktop/ε/mky/apps/storefront/src/pages/men/index.astro";
const $$url = "/men";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
