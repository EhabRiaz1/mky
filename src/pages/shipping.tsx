// src/components/Shipping.tsx
import React, { useState } from 'react';

type TrackingStatus = 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered';

interface TrackingInfo {
  status: TrackingStatus;
  orderNumber: string;
  estimatedDelivery: string;
  trackingNumber: string;
  timeline: {
    status: TrackingStatus;
    description: string;
    date: string;
    completed: boolean;
  }[];
}

const Shipping: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock tracking data - in real app, this would come from API
  const mockTrackingData: { [key: string]: TrackingInfo } = {
    'MKY123456': {
      status: 'shipped',
      orderNumber: 'MKY123456',
      estimatedDelivery: '2024-01-20',
      trackingNumber: 'MKY123456',
      timeline: [
        { status: 'pending', description: 'Order confirmed', date: '2024-01-15 10:30', completed: true },
        { status: 'processing', description: 'Processing in warehouse', date: '2024-01-16 14:20', completed: true },
        { status: 'shipped', description: 'Shipped from London', date: '2024-01-17 09:15', completed: true },
        { status: 'out-for-delivery', description: 'Out for delivery', date: '2024-01-20 08:00', completed: false },
        { status: 'delivered', description: 'Delivered', date: '2024-01-20', completed: false },
      ]
    },
    'MKY789012': {
      status: 'delivered',
      orderNumber: 'MKY789012',
      estimatedDelivery: '2024-01-18',
      trackingNumber: 'MKY789012',
      timeline: [
        { status: 'pending', description: 'Order confirmed', date: '2024-01-10 16:45', completed: true },
        { status: 'processing', description: 'Processing in warehouse', date: '2024-01-11 11:20', completed: true },
        { status: 'shipped', description: 'Shipped from London', date: '2024-01-12 15:30', completed: true },
        { status: 'out-for-delivery', description: 'Out for delivery', date: '2024-01-15 09:00', completed: true },
        { status: 'delivered', description: 'Delivered to recipient', date: '2024-01-15 14:20', completed: true },
      ]
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTrackingInfo(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const trackingData = mockTrackingData[trackingNumber];
      if (trackingData) {
        setTrackingInfo(trackingData);
      } else {
        setError('Tracking number not found. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to track order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: TrackingStatus) => {
    const colors = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      shipped: 'bg-purple-500',
      'out-for-delivery': 'bg-orange-500',
      delivered: 'bg-green-500'
    };
    return colors[status];
  };

  const getStatusText = (status: TrackingStatus) => {
    const texts = {
      pending: 'Order Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      'out-for-delivery': 'Out for Delivery',
      delivered: 'Delivered'
    };
    return texts[status];
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--brand-ink-exact)', color: 'var(--brand-bg-exact)' }}>
      {/* Hero Section */}
      <div className="relative py-20 md:py-28 border-b" style={{ borderColor: 'rgba(243, 231, 223, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shipping & Delivery
          </h1>
          <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Complimentary worldwide delivery with the MKY standard of excellence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Track Your Order Section */}
        <div className="mb-16">
          <div className="bg-white bg-opacity-5 rounded-lg p-8 md:p-12 border mb-8" style={{ borderColor: 'rgba(243, 231, 223, 0.2)' }}>
            <h2 className="text-3xl font-light tracking-wide mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Track Your Order
            </h2>
            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                placeholder="Enter your tracking number (e.g., MKY123456)"
                className="flex-1 px-4 py-3 bg-transparent border rounded-sm focus:outline-none focus:border-opacity-100 transition-all duration-300"
                style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 border rounded-sm hover:bg-white hover:bg-opacity-10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide uppercase font-medium whitespace-nowrap"
                style={{ 
                  borderColor: 'rgba(243, 231, 223, 0.3)', 
                  color: 'var(--brand-bg-exact)',
                  fontFamily: 'Inter, sans-serif', 
                  letterSpacing: '0.1em' 
                }}
              >
                {isLoading ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 p-4 border border-red-400 text-red-400 bg-red-400 bg-opacity-5 rounded-sm">
                {error}
              </div>
            )}

            {/* Demo Tracking Numbers */}
            <div className="mt-6">
              <p className="text-sm opacity-60 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Demo tracking numbers: <span className="opacity-80">MKY123456</span> or <span className="opacity-80">MKY789012</span>
              </p>
            </div>
          </div>

          {/* Tracking Results */}
          {trackingInfo && (
            <div className="bg-white bg-opacity-5 rounded-lg p-8 border" style={{ borderColor: 'rgba(243, 231, 223, 0.2)' }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h3 className="text-2xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Order #{trackingInfo.orderNumber}
                  </h3>
                  <p className="opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Tracking: {trackingInfo.trackingNumber}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(trackingInfo.status)} bg-opacity-20 text-${getStatusColor(trackingInfo.status).replace('bg-', '')}`}>
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: `var(--${getStatusColor(trackingInfo.status).replace('bg-', '')})` }}></span>
                    {getStatusText(trackingInfo.status)}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                {trackingInfo.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                      event.completed 
                        ? 'bg-green-500 bg-opacity-20 border-green-400' 
                        : 'bg-transparent border-gray-400'
                    }`}>
                      {event.completed ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${event.completed ? 'opacity-100' : 'opacity-60'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                        {event.description}
                      </h4>
                      <p className={`text-sm ${event.completed ? 'opacity-80' : 'opacity-40'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                        {event.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Estimated Delivery */}
              <div className="mt-8 p-4 border rounded-sm" style={{ borderColor: 'rgba(243, 231, 223, 0.3)', backgroundColor: 'rgba(243, 231, 223, 0.05)' }}>
                <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="opacity-80">Estimated Delivery:</span>{' '}
                  <span className="font-medium">{new Date(trackingInfo.estimatedDelivery).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                Global Delivery Service
              </h2>
              <p className="text-lg opacity-80 leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                Experience seamless worldwide delivery with our premium shipping partners. Every package is handled with the care and attention befitting MKY craftsmanship.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 border rounded-full flex items-center justify-center" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Processing Time</h3>
                  <p className="opacity-80 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Orders are processed within 1-2 business days<br />
                    Monday through Friday, excluding holidays
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 border rounded-full flex items-center justify-center" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>UK Delivery</h3>
                  <p className="opacity-80 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Complimentary next-day delivery<br />
                    Orders placed before 2:00 PM GMT
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 border rounded-full flex items-center justify-center" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>International Delivery</h3>
                  <p className="opacity-80 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Complimentary express shipping<br />
                    3-7 business days depending on destination
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details & FAQ */}
          <div className="bg-white bg-opacity-5 rounded-lg p-8 md:p-12 border" style={{ borderColor: 'rgba(243, 231, 223, 0.2)' }}>
            <h2 className="text-3xl font-light tracking-wide mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Delivery Information
            </h2>

            <div className="space-y-8">
              {/* Shipping Tiers */}
              <div>
                <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Shipping Options</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-sm" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                    <h4 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Standard Complimentary</h4>
                    <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                      UK: Next business day • International: 3-7 business days
                    </p>
                  </div>
                  <div className="p-4 border rounded-sm" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                    <h4 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Express Service</h4>
                    <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Available for urgent deliveries • Additional charges apply
                    </p>
                  </div>
                  <div className="p-4 border rounded-sm" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                    <h4 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>White-Glove Service</h4>
                    <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Personal delivery and setup • Available by appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="border-b pb-4" style={{ borderColor: 'rgba(243, 231, 223, 0.1)' }}>
                    <h4 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Do you ship worldwide?</h4>
                    <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Yes, we offer complimentary express shipping to most countries worldwide. Some restrictions may apply to certain destinations.
                    </p>
                  </div>
                  <div className="border-b pb-4" style={{ borderColor: 'rgba(243, 231, 223, 0.1)' }}>
                    <h4 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>How can I track my order?</h4>
                    <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Use the tracking tool above with your order number, or check your email for tracking updates.
                    </p>
                  </div>
                  <div className="border-b pb-4" style={{ borderColor: 'rgba(243, 231, 223, 0.1)' }}>
                    <h4 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>What about customs and import duties?</h4>
                    <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                      International customers are responsible for any customs fees or import duties. These are not included in the order total.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;