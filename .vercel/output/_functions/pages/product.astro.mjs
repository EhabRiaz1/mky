/* empty css                                 */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_-wwrRlvc.mjs';
import 'kleur/colors';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { g as getSupabase } from '../chunks/supabaseClient_C3Q-m5UZ.mjs';
import { r as readCurrency, b as addItemToCart, f as formatPrice } from '../chunks/cart_BMq2GZXG.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Crtkq0Sq.mjs';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

function AddToCartButton({ variantId, prices, className = "" }) {
  const currency = readCurrency();
  const price = (prices || []).find((p) => p.currency === currency)?.unit_amount_cents || 0;
  return /* @__PURE__ */ jsx("button", { className: `btn ${className}`, onClick: async () => {
    await addItemToCart(variantId, price, 1);
    location.href = "/cart";
  }, children: "Add to Shopping Bag" });
}

function ProductDetail({ handle, id }) {
  console.log("*** [ProductDetail TEST] Component is mounting with params:", { handle, id });
  const [product, setProduct] = useState(null);
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState("");
  const [variant, setVariant] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [currency, setCurrency] = useState("GBP");
  const [notFound, setNotFound] = useState(false);
  const [debug, setDebug] = useState(null);
  useEffect(() => {
    setCurrency(readCurrency());
    (async () => {
      const supabase = getSupabase();
      if (!supabase) {
        setNotFound(true);
        return;
      }
      if (!handle && !id) {
        setNotFound(true);
        return;
      }
      const envUrl = "https://apkohkqyebipmzvdwxgr.supabase.co";
      const dbg = { envUrl, input: { handle, id } };
      try {
        console.debug("[ProductDetail] init", dbg);
      } catch {
      }
      let p = null;
      if (id) {
        console.log("[ProductDetail] Fetching by ID:", id);
        const { data: byIdData, error: byIdErr } = await supabase.from("products").select("id,title,handle,description,price_gbp,price_eur,product_details,materials_care").eq("id", id).maybeSingle();
        dbg.byId = { ok: !!byIdData, error: byIdErr?.message };
        console.debug("[ProductDetail] By ID Result:", { data: byIdData, error: byIdErr });
        p = byIdData;
      }
      if (!p && handle) {
        console.log("[ProductDetail] Fetching by Handle:", handle);
        const { data: byHandleData, error: byHandleErr } = await supabase.from("products").select("id,title,handle,description,price_gbp,price_eur,product_details,materials_care").eq("handle", handle).maybeSingle();
        dbg.byHandle = { ok: !!byHandleData, error: byHandleErr?.message };
        console.debug("[ProductDetail] By Handle Result:", { data: byHandleData, error: byHandleErr });
        p = byHandleData;
      }
      if (!p) {
        console.log("[ProductDetail] Product not found. Debug info:", dbg);
        setDebug(dbg);
        setNotFound(true);
        setProduct(null);
        return;
      }
      setProduct(p);
      if (p) {
        const { data: m } = await supabase.from("product_images").select("url").eq("product_id", p.id).order("position");
        const mediaUrls = (m || []).map((r) => r.url);
        setMedia(mediaUrls);
        setSelectedMedia(mediaUrls[0] || "");
        const { data: allVariants } = await supabase.from("product_variants").select("id,sku").eq("product_id", p.id);
        const optionsByVariant = {};
        for (const v of allVariants || []) {
          const { data: opts } = await supabase.from("product_variant_options").select("name,value").eq("variant_id", v.id);
          const sizeOpt = (opts || []).find((o) => o.name === "Size");
          if (sizeOpt) optionsByVariant[sizeOpt.value] = v.id;
        }
        const sizesSorted = Object.keys(optionsByVariant).sort();
        setSizes(sizesSorted);
        const firstSize = sizesSorted[0];
        const variantId = optionsByVariant[firstSize];
        if (variantId) {
          const { data: pr } = await supabase.from("prices").select("currency,unit_amount_cents").eq("variant_id", variantId);
          setVariant({ id: variantId, sku: "", prices: pr || [], optionsByVariant });
        }
      }
    })();
  }, [handle, id]);
  if (notFound) return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { children: "Product not found." }),
    debug && /* @__PURE__ */ jsx("pre", { style: { marginTop: 12, fontSize: 12, background: "#f6f6f6", padding: 12, borderRadius: 6, overflow: "auto" }, children: JSON.stringify(debug, null, 2) })
  ] });
  if (!product) return /* @__PURE__ */ jsx("div", { children: "Loading…" });
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-12 lg:gap-16 min-h-screen py-8 px-6 md:px-12 lg:px-16 max-w-[1800px] mx-auto items-start md:items-center", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full md:w-[45%] lg:w-[48%] flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-6 md:p-8 w-full max-w-[600px]", children: media.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: selectedMedia,
          alt: product.title,
          className: "w-full h-full object-contain transition-opacity duration-500"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-3 justify-center flex-wrap", children: media.map((u) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSelectedMedia(u),
          className: `w-14 h-14 rounded-lg overflow-hidden transition-all duration-300 ${u === selectedMedia ? "ring-2 ring-black/60 scale-105 opacity-100" : "opacity-40 hover:opacity-80 hover:scale-105"}`,
          children: /* @__PURE__ */ jsx("img", { src: u, alt: "Thumbnail", className: "w-full h-full object-cover" })
        },
        u
      )) })
    ] }) : /* @__PURE__ */ jsx("div", { className: "relative w-full aspect-[3/4] rounded-xl overflow-hidden", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "https://placehold.co/800x1000",
        alt: product.title,
        className: "w-full h-full object-contain"
      }
    ) }) }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full md:w-[55%] lg:w-[52%] flex justify-center md:py-8", children: /* @__PURE__ */ jsx("div", { className: "backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-8 md:p-10 lg:p-12 w-full max-w-[650px]", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-tight text-[rgb(38,19,21)]", children: product.title }),
      variant && /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-3xl font-light text-[rgb(38,19,21)]", children: formatPrice(
        variant.prices?.find((p) => p.currency === currency)?.unit_amount_cents ?? 0,
        currency
      ) }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-[rgb(38,19,21)]/10 my-6" }),
      sizes.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-[rgb(38,19,21)]/60 mb-3 font-medium", children: "Select Size" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: sizes.map((s) => /* @__PURE__ */ jsx(
          "button",
          {
            className: "px-6 py-2.5 rounded-full border border-[rgb(38,19,21)]/20 hover:border-[rgb(38,19,21)] hover:bg-[rgb(38,19,21)]/5 transition-all duration-300 text-sm font-medium text-[rgb(38,19,21)]",
            onClick: async () => {
              const supabase = getSupabase();
              const id2 = (variant?.optionsByVariant || {})[s];
              if (supabase && id2) {
                const { data: pr } = await supabase.from("prices").select("currency,unit_amount_cents").eq("variant_id", id2);
                setVariant({ id: id2, prices: pr || [], optionsByVariant: variant?.optionsByVariant });
              }
            },
            children: s
          },
          s
        )) })
      ] }),
      variant && /* @__PURE__ */ jsx(
        AddToCartButton,
        {
          variantId: variant.id,
          prices: variant.prices || [],
          className: "w-full bg-[rgb(38,19,21)] text-white py-4 rounded-full font-medium text-base tracking-wide hover:bg-[rgb(38,19,21)]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-[rgb(38,19,21)]/60 text-center", children: "Complimentary shipping • Delivery in 4-11 weeks" }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-[rgb(38,19,21)]/10 my-6" }),
      /* @__PURE__ */ jsx("div", { className: "prose prose-sm max-w-none", children: /* @__PURE__ */ jsx("p", { className: "text-base leading-relaxed text-[rgb(38,19,21)]/80", children: product.description }) }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-[rgb(38,19,21)]/10 my-6" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("details", { className: "group border-b border-[rgb(38,19,21)]/10 pb-3", children: [
          /* @__PURE__ */ jsxs("summary", { className: "text-sm font-medium cursor-pointer flex justify-between items-center text-[rgb(38,19,21)] hover:text-[rgb(38,19,21)]/70 transition-colors", children: [
            "In-store services",
            /* @__PURE__ */ jsx("span", { className: "group-open:rotate-180 transition-transform duration-300 text-xs", children: "▾" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mt-3 text-[rgb(38,19,21)]/70 leading-relaxed", children: "Complimentary services available in select stores." })
        ] }),
        /* @__PURE__ */ jsxs("details", { className: "group border-b border-[rgb(38,19,21)]/10 pb-3", children: [
          /* @__PURE__ */ jsxs("summary", { className: "text-sm font-medium cursor-pointer flex justify-between items-center text-[rgb(38,19,21)] hover:text-[rgb(38,19,21)]/70 transition-colors", children: [
            "Complimentary Delivery & Returns",
            /* @__PURE__ */ jsx("span", { className: "group-open:rotate-180 transition-transform duration-300 text-xs", children: "▾" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mt-3 text-[rgb(38,19,21)]/70 leading-relaxed", children: "Free delivery and returns on all orders." })
        ] }),
        /* @__PURE__ */ jsxs("details", { className: "group border-b border-[rgb(38,19,21)]/10 pb-3", children: [
          /* @__PURE__ */ jsxs("summary", { className: "text-sm font-medium cursor-pointer flex justify-between items-center text-[rgb(38,19,21)] hover:text-[rgb(38,19,21)]/70 transition-colors", children: [
            "Gifting",
            /* @__PURE__ */ jsx("span", { className: "group-open:rotate-180 transition-transform duration-300 text-xs", children: "▾" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm mt-3 text-[rgb(38,19,21)]/70 leading-relaxed", children: "Complimentary gift wrapping available." })
        ] }),
        Array.isArray(product.product_details) && product.product_details.length > 0 && /* @__PURE__ */ jsxs("details", { className: "group border-b border-[rgb(38,19,21)]/10 pb-3", children: [
          /* @__PURE__ */ jsxs("summary", { className: "text-sm font-medium cursor-pointer flex justify-between items-center text-[rgb(38,19,21)] hover:text-[rgb(38,19,21)]/70 transition-colors", children: [
            "Product Details",
            /* @__PURE__ */ jsx("span", { className: "group-open:rotate-180 transition-transform duration-300 text-xs", children: "▾" })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc ml-5 mt-3 text-sm text-[rgb(38,19,21)]/70 space-y-1", children: product.product_details.map((d, i) => /* @__PURE__ */ jsx("li", { children: d }, i)) })
        ] }),
        Array.isArray(product.materials_care) && product.materials_care.length > 0 && /* @__PURE__ */ jsxs("details", { className: "group border-b border-[rgb(38,19,21)]/10 pb-3", children: [
          /* @__PURE__ */ jsxs("summary", { className: "text-sm font-medium cursor-pointer flex justify-between items-center text-[rgb(38,19,21)] hover:text-[rgb(38,19,21)]/70 transition-colors", children: [
            "Materials & Care",
            /* @__PURE__ */ jsx("span", { className: "group-open:rotate-180 transition-transform duration-300 text-xs", children: "▾" })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc ml-5 mt-3 text-sm text-[rgb(38,19,21)]/70 space-y-1", children: product.materials_care.map((d, i) => /* @__PURE__ */ jsx("li", { children: d }, i)) })
        ] })
      ] })
    ] }) }) })
  ] });
}

function SimilarProducts({ productId, handle, gender, limit = 4 }) {
  const [products, setProducts] = useState([]);
  const [media, setMedia] = useState({});
  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      let resolvedProductId = productId;
      if (!resolvedProductId && handle) {
        const { data: byHandle } = await supabase.from("products").select("id").eq("handle", handle).maybeSingle();
        resolvedProductId = byHandle?.id || "";
      }
      if (!resolvedProductId) return;
      const { data: currentProduct } = await supabase.from("products").select("id, collection_id, tags, gender").eq("id", resolvedProductId).single();
      if (!currentProduct) return;
      let query = supabase.from("products").select("id, title, handle, gender, price_gbp, tags, is_new").eq("status", "published").neq("id", resolvedProductId);
      if (currentProduct.collection_id) {
        query = query.eq("collection_id", currentProduct.collection_id);
      }
      if (gender) {
        query = query.eq("gender", gender);
      } else if (currentProduct.gender) {
        query = query.eq("gender", currentProduct.gender);
      }
      const { data: similarProducts } = await query.limit(limit);
      if (similarProducts && similarProducts.length > 0) {
        setProducts(similarProducts);
        const productIds = similarProducts.map((p) => p.id);
        const { data: images } = await supabase.from("product_images").select("product_id, url").in("product_id", productIds).order("position", { ascending: true });
        if (images) {
          const mediaMap = {};
          images.forEach((img) => {
            if (!mediaMap[img.product_id]) {
              mediaMap[img.product_id] = img.url;
            }
          });
          setMedia(mediaMap);
        }
      }
    })();
  }, [productId, handle, gender, limit]);
  if (products.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-serif font-light mb-8 text-center text-[rgb(38,19,21)] tracking-tight", children: "View Similar Products" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", children: products.map((p) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/product?handle=${encodeURIComponent(p.handle)}&id=${encodeURIComponent(p.id)}&from=${encodeURIComponent(window.location.pathname)}`,
        className: "group block overflow-hidden rounded-xl border border-[rgb(38,19,21)]/10 hover:border-[rgb(38,19,21)]/20 hover:shadow-xl transition-all duration-300",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "aspect-[3/4] overflow-hidden bg-neutral-50", children: [
            p.is_new && /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3 z-10 bg-[rgb(38,19,21)] text-white px-2 py-1 text-[10px] font-medium tracking-wider", children: "NEW" }),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: media[p.id] || "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2835&auto=format&fit=crop",
                alt: p.title,
                className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-light tracking-wide text-[rgb(38,19,21)] mb-1.5 line-clamp-2", children: p.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-[rgb(38,19,21)]", children: formatPrice((p.price_gbp || 0) * 100, "GBP") })
          ] })
        ]
      },
      p.id
    )) })
  ] });
}

const $$Astro = createAstro();
const $$Product = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Product;
  const handle = Astro2.url.searchParams.get("handle") ?? "";
  const id = Astro2.url.searchParams.get("id") ?? "";
  const referrer = Astro2.url.searchParams.get("from") ?? "";
  let backLink = "/products";
  let backText = "Back to shop";
  if (referrer.includes("blazers")) {
    backLink = referrer;
    backText = "Back to blazers";
  } else if (referrer.includes("trousers")) {
    backLink = referrer;
    backText = "Back to trousers";
  } else if (referrer.includes("men")) {
    backLink = referrer;
    backText = "Back to men's collection";
  } else if (referrer.includes("women")) {
    backLink = referrer;
    backText = "Back to women's collection";
  }
  console.log("*** [Product.astro] Parsed searchParams:", Astro2.url.searchParams);
  console.log("*** [Product.astro] Passing to ProductDetail:", { handle, id });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Product \u2014 Maison MKY", "fullWidth": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-0 m-0 relative"> <a${addAttribute(backLink, "href")} class="absolute top-[80px] left-6 z-10 px-4 py-2 bg-[rgba(38,19,21,0.05)] hover:bg-[rgba(38,19,21,0.1)] rounded-full text-[rgb(38,19,21)] text-sm font-medium transition-all duration-300 flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg> ${backText} </a> <div> ${renderComponent($$result2, "ProductDetail", ProductDetail, { "client:load": true, "handle": handle, "id": id, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/ProductDetail.tsx", "client:component-export": "default" })} </div> <!-- Horizontal Divider before Similar Products --> <div class="w-full border-t border-[rgb(38,19,21)] opacity-20 my-16"></div> <!-- Similar Products Section - Dynamic based on current product --> <div class="px-4 md:px-6 mb-16"> ${renderComponent($$result2, "SimilarProducts", SimilarProducts, { "client:load": true, "productId": id, "handle": handle, "limit": 4, "client:component-hydration": "load", "client:component-path": "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/components/SimilarProducts.tsx", "client:component-export": "default" })} </div> </div> ` })} `;
}, "/Users/ehabriaz/Desktop/\u03B5/mky/apps/storefront/src/pages/product.astro", void 0);

const $$file = "/Users/ehabriaz/Desktop/ε/mky/apps/storefront/src/pages/product.astro";
const $$url = "/product";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Product,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
