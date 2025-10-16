import { getSupabase } from './supabaseClient';
import { readCurrency, type Currency } from './currency';

const CART_STORAGE_KEY = 'mky_cart_id';

export async function ensureCart(preferredCurrency?: Currency): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const existing = localStorage.getItem(CART_STORAGE_KEY);
  if (existing) return existing;
  const supabase = getSupabase();
  if (!supabase) return null;
  const currency = preferredCurrency || readCurrency();
  const { data, error } = await supabase
    .from('carts')
    .insert({ currency })
    .select('id')
    .single();
  if (error) return null;
  localStorage.setItem(CART_STORAGE_KEY, data.id);
  return data.id as string;
}

export function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_STORAGE_KEY);
}

export async function addItemToCart(variantId: string, unitPriceCents: number, quantity = 1): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const cartId = getCartId() || (await ensureCart());
  if (!cartId) return false;
  const { error } = await supabase.from('cart_items').insert({ cart_id: cartId, variant_id: variantId, unit_price_cents: unitPriceCents, quantity });
  if (error) return false;
  await supabase.rpc('recompute_cart_totals', { p_cart_id: cartId });
  return true;
}

export async function loadCart() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const cartId = getCartId();
  if (!cartId) return null;
  const { data: cart } = await supabase.from('carts').select('*').eq('id', cartId).single();
  const { data: items } = await supabase.from('cart_items').select('*').eq('cart_id', cartId).order('created_at');
  return { cart, items: items || [] };
}

export async function updateItemQuantity(itemId: string, quantity: number) {
  const supabase = getSupabase();
  const cartId = getCartId();
  if (!supabase || !cartId) return;
  await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
  await supabase.rpc('recompute_cart_totals', { p_cart_id: cartId });
}

export async function removeItem(itemId: string) {
  const supabase = getSupabase();
  const cartId = getCartId();
  if (!supabase || !cartId) return;
  await supabase.from('cart_items').delete().eq('id', itemId);
  await supabase.rpc('recompute_cart_totals', { p_cart_id: cartId });
}



