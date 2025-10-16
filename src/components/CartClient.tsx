import { useEffect, useState } from 'react';
import { formatPrice, readCurrency } from '../lib/currency';
import { ensureCart, loadCart, removeItem, updateItemQuantity } from '../lib/cart';

export default function CartClient() {
  const [state, setState] = useState<any>({ cart: null, items: [] });
  const [currency, setCurrency] = useState(readCurrency());

  useEffect(() => {
    (async () => {
      await ensureCart(currency);
      const data = await loadCart();
      if (data) setState(data);
    })();
  }, [currency]);

  const total = state.cart?.total_cents || 0;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {state.items.map((it:any) => (
          <div key={it.id} className="card p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="font-medium">{it.title || 'Item'}</div>
              <div className="text-sm text-neutral-600">Qty: {it.quantity}</div>
            </div>
            <div className="text-sm">{formatPrice(it.unit_price_cents, currency)}</div>
            <button className="btn btn-outline" onClick={async()=>{ await removeItem(it.id); const data=await loadCart(); if(data) setState(data); }}>Remove</button>
          </div>
        ))}
      </div>
      <aside className="card p-4 h-fit">
        <div className="flex items-center justify-between">
          <div className="text-neutral-600">Total</div>
          <div className="font-semibold">{formatPrice(total, currency)}</div>
        </div>
        <a href="/checkout" className="btn btn-primary w-full mt-4 text-center">Checkout</a>
      </aside>
    </div>
  );
}



