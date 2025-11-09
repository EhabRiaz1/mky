import { addItemToCart } from '../lib/cart';
import { readCurrency } from '../lib/currency';

export default function AddToCartButton({ variantId, prices, className = '' }: { variantId: string; prices: { currency: 'GBP'|'EUR'; unit_amount_cents: number }[]; className?: string }) {
  const currency = readCurrency();
  const price = (prices || []).find((p)=>p.currency===currency)?.unit_amount_cents || 0;
  return (
    <button className={`btn ${className}`} onClick={async()=>{ await addItemToCart(variantId, price, 1); location.href='/cart'; }}>Add to Shopping Bag</button>
  );
}


