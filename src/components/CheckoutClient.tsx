import { useEffect, useState } from 'react';
import { loadCart } from '../lib/cart';
import { formatPrice, readCurrency, type Currency } from '../lib/currency';
import { loadStripe } from '@stripe/stripe-js';

export default function CheckoutClient() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState<Currency>('GBP');

  useEffect(() => {
    (async () => {
      setCurrency(readCurrency());
      const data = await loadCart();
      const total = data?.cart?.total_cents || 0;
      setAmount(total);
      if (total > 0) {
        // Sync cart id cookie for API
        const cartId = (await import('../lib/cart')).getCartId?.();
        if (cartId) document.cookie = `mky_cart_id=${cartId}; Path=/; Max-Age=31536000`;
        const res = await fetch('/api/create-payment-intent', { method: 'POST' });
        const j = await res.json();
        setClientSecret(j.clientSecret || null);
      }
    })();
  }, []);

  return (
    <div className="card p-4">
      <div className="mb-2 text-neutral-600">Amount</div>
      <div className="text-xl font-semibold">{formatPrice(amount, currency)}</div>
      <div className="mt-4 text-neutral-600">Stripe Elements form will render on clientSecret.</div>
      {clientSecret ? (
        <div className="mt-4 text-sm text-neutral-700">Payment intent created. Integrate Elements CardElement here.</div>
      ) : (
        <div className="mt-4 text-sm text-neutral-700">Add items to cart to begin checkout.</div>
      )}
    </div>
  );
}



