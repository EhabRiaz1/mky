import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BtPWolrw.mjs';
import { manifest } from './manifest_DiVp2BdV.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/create-payment-intent.astro.mjs');
const _page3 = () => import('./pages/api/place-order.astro.mjs');
const _page4 = () => import('./pages/cart.astro.mjs');
const _page5 = () => import('./pages/checkout.astro.mjs');
const _page6 = () => import('./pages/login.astro.mjs');
const _page7 = () => import('./pages/men/blazers.astro.mjs');
const _page8 = () => import('./pages/men/trousers.astro.mjs');
const _page9 = () => import('./pages/men.astro.mjs');
const _page10 = () => import('./pages/privacy.astro.mjs');
const _page11 = () => import('./pages/product.astro.mjs');
const _page12 = () => import('./pages/products.astro.mjs');
const _page13 = () => import('./pages/search.astro.mjs');
const _page14 = () => import('./pages/signup.astro.mjs');
const _page15 = () => import('./pages/terms.astro.mjs');
const _page16 = () => import('./pages/women/blazers.astro.mjs');
const _page17 = () => import('./pages/women/trousers.astro.mjs');
const _page18 = () => import('./pages/women.astro.mjs');
const _page19 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["../../node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/create-payment-intent.ts", _page2],
    ["src/pages/api/place-order.ts", _page3],
    ["src/pages/cart/index.astro", _page4],
    ["src/pages/checkout/index.astro", _page5],
    ["src/pages/login.astro", _page6],
    ["src/pages/men/blazers.astro", _page7],
    ["src/pages/men/trousers.astro", _page8],
    ["src/pages/men/index.astro", _page9],
    ["src/pages/privacy.astro", _page10],
    ["src/pages/product.astro", _page11],
    ["src/pages/products.astro", _page12],
    ["src/pages/search.astro", _page13],
    ["src/pages/signup.astro", _page14],
    ["src/pages/terms.astro", _page15],
    ["src/pages/women/blazers.astro", _page16],
    ["src/pages/women/trousers.astro", _page17],
    ["src/pages/women/index.astro", _page18],
    ["src/pages/index.astro", _page19]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "5d752177-df1e-453f-8e58-fc1552148c21",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
