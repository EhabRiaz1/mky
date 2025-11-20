import { useEffect, useState } from 'react';
import { loadCart } from '../lib/cart';
import { formatPrice, readCurrency, type Currency } from '../lib/currency';
import { loadStripe } from '@stripe/stripe-js';

export default function CheckoutClient() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState<Currency>('GBP');
  const [email, setEmail] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setCurrency(readCurrency());
      const data = await loadCart();
      const total = data?.cart?.total_cents || 0;
      setAmount(total);
      // Wait until user clicks "Confirm Order" to create order and PI
    })();
  }, []);

  async function confirmOrder() {
    setPlacing(true);
    try {
      // Ensure cart cookie for API
      const cartId = (await import('../lib/cart')).getCartId?.();
      if (cartId) document.cookie = `mky_cart_id=${cartId}; Path=/; Max-Age=31536000`;

      const place = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const placeJ = await place.json();
      if (!place.ok) throw new Error(placeJ.error || 'order_failed');
      setOrderId(placeJ.orderId);

      const pi = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderId: placeJ.orderId }),
      });
      const piJ = await pi.json();
      if (!pi.ok) throw new Error(piJ.error || 'payment_intent_failed');
      setClientSecret(piJ.clientSecret || null);
    } catch (e: any) {
      alert(e.message || 'Checkout failed');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4 text-gray-700 font-medium">Total Amount</div>
      <div className="text-2xl font-bold mb-6">{formatPrice(amount, currency)}</div>
      {!clientSecret && (
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email (for order confirmation)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors" 
            disabled={placing || amount <= 0} 
            onClick={confirmOrder}
          >
            {placing ? 'Confirming…' : 'Confirm Order'}
          </button>
        </div>
      )}
      <div className="mt-6 text-sm text-gray-600">Stripe Elements form will render on clientSecret.</div>
      {clientSecret ? (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
          Payment intent created. Integrate Elements CardElement here for order {orderId?.slice(0,8)}.
        </div>
      ) : (
        <div className="mt-4 text-sm text-gray-600">Add items to cart and confirm to begin payment.</div>
      )}
    </div>
  );
}



