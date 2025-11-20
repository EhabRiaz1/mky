"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RO5ufKFADNRc4yzRZQ1BreVjjrxMoSnvMdujhAMs4ZOE5yVDlxgbhwgAp4FWyU9I7z0Wwx07dZsWnr6bC1BEXQa00sr6PHJ8M"
);

export default function StripeCheckout({ cartItems, customerInfo, onBack }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, customerInfo })
      });

      const data = await res.json();
      if (!res.ok || !data.id) throw new Error(data.error || "Failed to create session");

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe did not load");

      const result = await stripe.redirectToCheckout({ sessionId: data.id });
      if (result.error) alert(result.error.message);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Payment Information</h3>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Order Summary</h4>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.name} {item.size && `(${item.size})`} × {item.quantity || 1}
            </span>
            <span>£{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t">
          <span>Total:</span>
          <span>£{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Shipping To</h4>
        <p>{customerInfo.firstName} {customerInfo.lastName}</p>
        <p>{customerInfo.email}</p>
        <p>{customerInfo.address}</p>
        <p>{customerInfo.city}, {customerInfo.postalCode}</p>
        <p>{customerInfo.country}</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-4 rounded-lg font-semibold transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {loading ? "Processing..." : `Pay with Stripe - £${total.toFixed(2)}`}
        </button>

        <button
          onClick={onBack}
          disabled={loading}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back to Shipping
        </button>
      </div>
    </div>
  );
}
