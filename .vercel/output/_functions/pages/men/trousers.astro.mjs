/* empty css                                    */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_-wwrRlvc.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_Crtkq0Sq.mjs';
import { P as ProductGrid } from '../../chunks/ProductGrid_Ian9hGa8.mjs';
import { C as CatalogTopBar, a as CategoryIconNav, b as CatalogHero } from '../../chunks/CatalogHero_CGyMiKIP.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

const $$Trousers = createComponent(($$result, $$props, $$slots) => {
  const menCategories = [
    { name: "Blazers", icon: "/images/explore-men-blazers.png", href: "/men/blazers" },
    { name: "Trousers", icon: "/images/explore-men-trousers.png", href: "/men/trousers" }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Men Trousers \u2014 Maison MKY", "fullWidth": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white">  ${renderComponent($$result2, "CatalogTopBar", CatalogTopBar, { "client:load": true, "categoryTitle": "Trousers", "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/CatalogTopBar.tsx", "client:component-export": "default" })}  ${renderComponent($$result2, "CategoryIconNav", CategoryIconNav, { "client:load": true, "categories": menCategories, "currentCategory": "Trousers", "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/CategoryIconNav.tsx", "client:component-export": "default" })}  ${renderComponent($$result2, "CatalogHero", CatalogHero, { "client:load": true, "image": "/images/explore-men-trousers.png", "alt": "Men's Trousers Collection", "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/CatalogHero.tsx", "client:component-export": "default" })}  <div class="w-full"> ${renderComponent($$result2, "ProductGrid", ProductGrid, { "client:load": true, "gender": "men", "collection": "trousers", "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/ProductGrid.tsx", "client:component-export": "default" })} </div> </div> ` })} `;
}, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/pages/men/trousers.astro", void 0);

const $$file = "/Users/ehabriaz/Desktop/ε/mky/apps/storefront/src/pages/men/trousers.astro";
const $$url = "/men/trousers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Trousers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
