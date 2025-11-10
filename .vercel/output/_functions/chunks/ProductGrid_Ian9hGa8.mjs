import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { g as getSupabase } from './supabaseClient_C3Q-m5UZ.mjs';

function ProductGrid({ gender, collection }) {
  const [products, setProducts] = useState([]);
  const [media, setMedia] = useState({});
  const [wishlist, setWishlist] = useState(/* @__PURE__ */ new Set());
  useEffect(() => {
    (async () => {
      console.log("[ProductGrid] Fetching products for gender:", gender, "collection:", collection);
      const supabase = getSupabase();
      if (!supabase) return;
      let query = supabase.from("products").select("id,title,handle,gender,price_gbp,tags").eq("status", "published");
      if (gender) query = query.eq("gender", gender);
      let p;
      if (collection) {
        let vq = supabase.from("v_published_products_with_collections").select("id,title,handle,gender,price_gbp,tags").eq("collection_slug", collection);
        if (gender) vq = vq.eq("gender", gender);
        const { data } = await vq;
        console.log("[ProductGrid] View query result:", data);
        p = (data || []).map((d) => ({
          id: d.id,
          title: d.title,
          handle: d.handle,
          gender: d.gender,
          price_gbp: d.price_gbp,
          tags: d.tags,
          is_new: d.tags?.includes("new")
        }));
      } else {
        const res = await query;
        p = (res.data || []).map((d) => ({
          ...d,
          is_new: d.tags?.includes("new")
        }));
      }
      setProducts(p || []);
      const { data: m } = await supabase.from("product_images").select("product_id,url").order("position", { ascending: true });
      const firstByProduct = {};
      (m || []).forEach((row) => {
        if (!(row.product_id in firstByProduct)) firstByProduct[row.product_id] = row.url;
      });
      setMedia(firstByProduct);
    })();
  }, [gender, collection]);
  const toggleWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };
  const formatPrice = (price) => {
    if (!price) return "";
    return `£${price.toLocaleString("en-GB")}`;
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full bg-white", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0", children: products.map((p) => {
    console.log("[ProductGrid] Rendering product:", { id: p.id, handle: p.handle, title: p.title });
    return /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/product?handle=${encodeURIComponent(p.handle)}&id=${encodeURIComponent(p.id)}&from=${encodeURIComponent(window.location.pathname)}`,
        className: "group relative block border-r border-b border-neutral-100 hover:shadow-lg transition-shadow duration-300",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative bg-neutral-50", children: [
            p.is_new && /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4 z-10", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-xs font-light tracking-wider text-neutral-600", children: "New" }) }),
            /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] overflow-hidden bg-neutral-100", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: media[p.id] || "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2835&auto=format&fit=crop",
                alt: p.title,
                className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              }
            ) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => toggleWishlist(p.id, e),
                className: "absolute bottom-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors",
                "aria-label": "Add to wishlist",
                children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: `w-4 h-4 transition-colors ${wishlist.has(p.id) ? "fill-black" : "fill-none"} stroke-black stroke-1`,
                    viewBox: "0 0 24 24",
                    children: /* @__PURE__ */ jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6 bg-white", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs sm:text-sm font-light tracking-wide text-neutral-900 mb-2", children: p.title }),
            p.price_gbp && /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm font-light text-neutral-600", children: formatPrice(p.price_gbp) })
          ] })
        ]
      },
      p.id
    );
  }) }) });
}

export { ProductGrid as P };
