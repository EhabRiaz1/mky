import React, { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  name: string;
  size?: string;
  image?: string;
  price: number;
  quantity: number;
  description?: string;
  variantId?: string;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

interface Order {
  id: string;
  email: string | null;
  currency: string;
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  shipping_cents: number;
  total_cents: number;
  status: "pending" | "confirmed" | "shipped";
  created_at: string;
  items: OrderItem[];
  shipping_address?: ShippingAddress | null;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/admin/orders");
      const data = await res.json();
      console.log("Fetched orders:", data.orders);
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const setStatus = async (id: string, status: Order["status"]) => {
    try {
      await fetch(`http://localhost:5000/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      await loadOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const formatCurrency = (cents: number, currency: string) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(cents / 100);

  const toggleOrder = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="text-lg text-gray-600">Loading orders...</div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders and fulfillment</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No orders found</div>
          <p className="text-gray-400">Orders will appear here once customers place them</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div 
                className="p-6 cursor-pointer transition-colors hover:bg-gray-50"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-sm font-medium text-gray-900">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Customer</div>
                        <div className="font-medium text-gray-900">{order.email || "Guest"}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Total</div>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(order.total_cents, order.currency)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Created</div>
                        <div className="font-medium text-gray-900">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {order.status !== "confirmed" && (
                      <button
                        onClick={e => { e.stopPropagation(); setStatus(order.id, "confirmed"); }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Confirm
                      </button>
                    )}
                    {order.status !== "shipped" && (
                      <button
                        onClick={e => { e.stopPropagation(); setStatus(order.id, "shipped"); }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Ship
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 p-6 space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-16 h-16 object-cover rounded border"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                            {item.size && (
                              <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
                            )}
                            {item.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {formatCurrency(item.price * 100, order.currency)}
                            </div>
                            <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                            <div className="font-semibold text-gray-900 mt-1">
                              {formatCurrency(item.price * 100 * item.quantity, order.currency)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{formatCurrency(order.subtotal_cents, order.currency)}</span>
                        </div>
                        {order.discount_cents > 0 && (
                          <div className="flex justify-between text-sm text-red-600">
                            <span>Discount</span>
                            <span>-{formatCurrency(order.discount_cents, order.currency)}</span>
                          </div>
                        )}
                        {order.tax_cents > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">{formatCurrency(order.tax_cents, order.currency)}</span>
                          </div>
                        )}
                        {order.shipping_cents > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">{formatCurrency(order.shipping_cents, order.currency)}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-gray-200 pt-3">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="font-bold text-lg text-gray-900">
                            {formatCurrency(order.total_cents, order.currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-2 text-sm">
                            <div className="font-medium text-gray-900">{order.shipping_address.name}</div>
                            <div className="text-gray-600">{order.shipping_address.street}</div>
                            <div className="text-gray-600">
                              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}
                            </div>
                            <div className="text-gray-600">{order.shipping_address.country}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}