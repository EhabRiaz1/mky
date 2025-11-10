import { g as getSupabase } from './supabaseClient_C3Q-m5UZ.mjs';

const COOKIE = "mky_currency";
function getDefaultCurrency() {
  if (typeof navigator !== "undefined") {
    const lang = navigator.language || "";
    if (lang.startsWith("en-GB")) return "GBP";
    if (lang.startsWith("fr") || lang.startsWith("de") || lang.startsWith("it") || lang.startsWith("es")) return "EUR";
  }
  return "GBP";
}
function readCurrency() {
  try {
    const m = document.cookie.match(new RegExp(`${COOKIE}=([^;]+)`));
    if (m) {
      const c = decodeURIComponent(m[1]);
      if (c === "GBP" || c === "EUR") return c;
    }
  } catch {
  }
  return getDefaultCurrency();
}
function formatPrice(cents, currency) {
  const amount = cents / 100;
  return new Intl.NumberFormat(void 0, { style: "currency", currency }).format(amount);
}

const CART_STORAGE_KEY = "mky_cart_id";
async function ensureCart(preferredCurrency) {
  if (typeof window === "undefined") return null;
  const existing = localStorage.getItem(CART_STORAGE_KEY);
  if (existing) return existing;
  const supabase = getSupabase();
  if (!supabase) return null;
  const currency = preferredCurrency || readCurrency();
  const { data, error } = await supabase.from("carts").insert({ currency }).select("id").single();
  if (error) return null;
  localStorage.setItem(CART_STORAGE_KEY, data.id);
  return data.id;
}
function getCartId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_STORAGE_KEY);
}
async function addItemToCart(variantId, unitPriceCents, quantity = 1) {
  const supabase = getSupabase();
  if (!supabase) return false;
  const cartId = getCartId() || await ensureCart();
  if (!cartId) return false;
  const { error } = await supabase.from("cart_items").insert({ cart_id: cartId, variant_id: variantId, unit_price_cents: unitPriceCents, quantity });
  if (error) return false;
  await supabase.rpc("recompute_cart_totals", { p_cart_id: cartId });
  return true;
}
async function loadCart() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const cartId = getCartId();
  if (!cartId) return null;
  const { data: cart } = await supabase.from("carts").select("*").eq("id", cartId).single();
  const { data: items } = await supabase.from("cart_items").select("*").eq("cart_id", cartId).order("created_at");
  return { cart, items: items || [] };
}
async function removeItem(itemId) {
  const supabase = getSupabase();
  const cartId = getCartId();
  if (!supabase || !cartId) return;
  await supabase.from("cart_items").delete().eq("id", itemId);
  await supabase.rpc("recompute_cart_totals", { p_cart_id: cartId });
}

const cart = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  addItemToCart,
  ensureCart,
  getCartId,
  loadCart,
  removeItem
}, Symbol.toStringTag, { value: 'Module' }));

export { removeItem as a, addItemToCart as b, cart as c, ensureCart as e, formatPrice as f, loadCart as l, readCurrency as r };
