"use client";

import { useState, useEffect } from "react";
import StripeCheckout from "./StripeCheckout";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isGuest: boolean;
}

type CheckoutStep = "cart" | "customer-info" | "shipping" | "payment";

export default function CheckoutFlow() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    isGuest: true,
  });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("mky_cart") || "[]");
    setCartItems(Array.isArray(items) ? items : []);
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: "cart", label: "Cart" },
    { key: "customer-info", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ];

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerInfo.email ||
      !customerInfo.firstName ||
      !customerInfo.lastName
    ) {
      alert("Please fill in all required fields");
      return;
    }
    setCurrentStep("shipping");
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerInfo.address ||
      !customerInfo.city ||
      !customerInfo.postalCode
    ) {
      alert("Please fill in all shipping details");
      return;
    }
    setCurrentStep("payment");
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return removeItem(id);
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updated);
    localStorage.setItem("mky_cart", JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("mky_cart", JSON.stringify(updated));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Add some products to your cart to continue shopping.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl">
          <div className="border-b border-gray-200 p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Checkout</h1>
              <button
                onClick={() => window.history.back()}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-semibold text-lg transition-colors ${
                          steps.findIndex((s) => s.key === currentStep) >= index
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-400 border-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-sm mt-2 font-medium ${
                          steps.findIndex((s) => s.key === currentStep) >= index
                            ? "text-black"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-4 ${
                          steps.findIndex((s) => s.key === currentStep) > index
                            ? "bg-black"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 opacity-100">
            {currentStep === "cart" && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">
                  Review Your Cart
                </h2>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-6 border rounded-xl"
                  >
                    <div className="flex items-center gap-6">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-lg">{item.name}</p>
                        {item.size && (
                          <p className="text-gray-600">Size: {item.size}</p>
                        )}
                        <p className="text-xl font-bold mt-2">
                          £{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 border-x font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "customer-info" && (
              <form
                onSubmit={handleCustomerInfoSubmit}
                className="space-y-6 max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-2xl font-semibold mb-6">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.firstName}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.lastName}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="guest-checkout"
                    checked={customerInfo.isGuest}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        isGuest: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-black focus:ring-black w-5 h-5"
                  />
                  <label htmlFor="guest-checkout" className="text-gray-700">
                    Continue as guest (create account later)
                  </label>
                </div>
              </form>
            )}

            {currentStep === "shipping" && (
              <form
                onSubmit={handleShippingSubmit}
                className="space-y-6 max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-2xl font-semibold mb-6">
                  Shipping Address
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.city}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.postalCode}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          postalCode: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Country *
                  </label>
                  <select
                    required
                    value={customerInfo.country}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                  >
                    <option value="">Select Country</option>
                    <option value="GB">United Kingdom</option>
                    <option value="PK">Pakistan</option>
                  </select>
                </div>
              </form>
            )}

            {currentStep === "payment" && (
              <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-sm">
                <StripeCheckout
                  cartItems={cartItems}
                  customerInfo={customerInfo}
                  onBack={() => setCurrentStep("shipping")}
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-8 bg-white">
            <div className="flex justify-between gap-4 max-w-2xl mx-auto">
              {currentStep !== "cart" && (
                <button
                  onClick={() => {
                    if (currentStep === "customer-info") setCurrentStep("cart");
                    else if (currentStep === "shipping")
                      setCurrentStep("customer-info");
                    else if (currentStep === "payment")
                      setCurrentStep("shipping");
                  }}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
              )}

              {currentStep !== "payment" && (
                <button
                  onClick={() => {
                    if (currentStep === "cart") setCurrentStep("customer-info");
                    else if (currentStep === "customer-info")
                      handleCustomerInfoSubmit(new Event("submit") as any);
                    else if (currentStep === "shipping")
                      handleShippingSubmit(new Event("submit") as any);
                  }}
                  className={`px-8 py-3 rounded-xl font-medium transition-colors ml-auto ${
                    currentStep === "cart"
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {currentStep === "cart"
                    ? "Continue to Information"
                    : currentStep === "customer-info"
                      ? "Continue to Shipping"
                      : "Continue to Payment"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
