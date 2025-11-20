// src/components/Returns.tsx
import React, { useState } from 'react';

type ReturnStatus = 'pending' | 'processing' | 'approved' | 'refunded' | 'rejected';

interface ReturnRequest {
  id: string;
  orderNumber: string;
  status: ReturnStatus;
  items: {
    name: string;
    size: string;
    quantity: number;
    reason: string;
  }[];
  createdAt: string;
  estimatedRefund: string;
  timeline: {
    status: ReturnStatus;
    description: string;
    date: string;
    completed: boolean;
  }[];
}

const Returns: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [returnRequest, setReturnRequest] = useState<ReturnRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnForm, setReturnForm] = useState({
    orderNumber: '',
    items: [{ name: '', size: '', quantity: 1, reason: '' }],
    reason: '',
    comments: ''
  });

  // Mock return data
  const mockReturnData: { [key: string]: ReturnRequest } = {
    'MKY123456': {
      id: 'RET001',
      orderNumber: 'MKY123456',
      status: 'processing',
      items: [
        { name: 'Classic Wool Blazer', size: '48', quantity: 1, reason: 'Size not fit' }
      ],
      createdAt: '2024-01-15',
      estimatedRefund: '2024-01-25',
      timeline: [
        { status: 'pending', description: 'Return request submitted', date: '2024-01-15 14:30', completed: true },
        { status: 'processing', description: 'Return processing', date: '2024-01-16 10:15', completed: true },
        { status: 'approved', description: 'Return approved', date: '2024-01-20', completed: false },
        { status: 'refunded', description: 'Refund processed', date: '2024-01-25', completed: false },
      ]
    },
    'MKY789012': {
      id: 'RET002',
      orderNumber: 'MKY789012',
      status: 'refunded',
      items: [
        { name: 'Silk Evening Dress', size: 'M', quantity: 1, reason: 'Color mismatch' }
      ],
      createdAt: '2024-01-05',
      estimatedRefund: '2024-01-12',
      timeline: [
        { status: 'pending', description: 'Return request submitted', date: '2024-01-05 16:45', completed: true },
        { status: 'processing', description: 'Return processing', date: '2024-01-06 11:20', completed: true },
        { status: 'approved', description: 'Return approved', date: '2024-01-08 09:30', completed: true },
        { status: 'refunded', description: 'Refund processed', date: '2024-01-12 14:20', completed: true },
      ]
    }
  };

  const handleTrackReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setReturnRequest(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const returnData = mockReturnData[orderNumber];
      if (returnData) {
        setReturnRequest(returnData);
      } else {
        setError('Return request not found. Please check your order number.');
      }
    } catch (err) {
      setError('Failed to track return. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In real app, this would submit to your backend
      alert('Return request submitted successfully! You will receive a confirmation email.');
      setShowReturnForm(false);
      setReturnForm({
        orderNumber: '',
        items: [{ name: '', size: '', quantity: 1, reason: '' }],
        reason: '',
        comments: ''
      });
    } catch (err) {
      setError('Failed to submit return request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: ReturnStatus) => {
    const colors = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      approved: 'bg-green-500',
      refunded: 'bg-purple-500',
      rejected: 'bg-red-500'
    };
    return colors[status];
  };

  const getStatusText = (status: ReturnStatus) => {
    const texts = {
      pending: 'Pending Review',
      processing: 'Processing',
      approved: 'Approved',
      refunded: 'Refunded',
      rejected: 'Rejected'
    };
    return texts[status];
  };

  const addReturnItem = () => {
    setReturnForm(prev => ({
      ...prev,
      items: [...prev.items, { name: '', size: '', quantity: 1, reason: '' }]
    }));
  };

  const removeReturnItem = (index: number) => {
    setReturnForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateReturnItem = (index: number, field: string, value: string | number) => {
    setReturnForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--brand-ink-exact)', color: 'var(--brand-bg-exact)' }}>
      {/* Hero Section */}
      <div className="relative py-20 md:py-28 border-b" style={{ borderColor: 'rgba(243, 231, 223, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Returns & Exchanges
          </h1>
          <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Hassle-free returns within 30 days. Your satisfaction is our priority.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <button
            onClick={() => setShowReturnForm(true)}
            className="p-8 border rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300 text-left group"
            style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}
          >
            <div className="w-12 h-12 border rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:bg-opacity-10 transition-all duration-300" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
              <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Start New Return</h3>
            <p className="opacity-80 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Initiate a return or exchange for your recent order
            </p>
          </button>

          <div className="p-8 border rounded-lg" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
            <div className="w-12 h-12 border rounded-full flex items-center justify-center mb-4" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
              <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Track Existing Return</h3>
            <form onSubmit={handleTrackReturn} className="flex flex-col sm:flex-row gap-4 mt-4">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="Enter your order number"
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
                {isLoading ? 'Tracking...' : 'Track'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 p-4 border border-red-400 text-red-400 bg-red-400 bg-opacity-5 rounded-sm">
                {error}
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm opacity-60" style={{ fontFamily: 'Inter, sans-serif' }}>
                Demo order numbers: <span className="opacity-80">MKY123456</span> or <span className="opacity-80">MKY789012</span>
              </p>
            </div>
          </div>
        </div>

        {/* Return Request Form */}
        {showReturnForm && (
          <div className="bg-white bg-opacity-5 rounded-lg p-8 border mb-16" style={{ borderColor: 'rgba(243, 231, 223, 0.2)' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
                New Return Request
              </h2>
              <button
                onClick={() => setShowReturnForm(false)}
                className="p-2 hover:bg-white hover:bg-opacity-10 rounded transition-all duration-300"
                style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}
              >
                <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="space-y-6">
              <div>
                <label className="block text-sm tracking-wide mb-3 opacity-80 uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                  Order Number *
                </label>
                <input
                  type="text"
                  value={returnForm.orderNumber}
                  onChange={(e) => setReturnForm(prev => ({ ...prev, orderNumber: e.target.value }))}
                  className="w-full px-4 py-3 bg-transparent border rounded-sm focus:outline-none focus:border-opacity-100 transition-all duration-300"
                  style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                  placeholder="Enter your order number"
                  required
                />
              </div>

              {/* Return Items */}
              <div>
                <label className="block text-sm tracking-wide mb-3 opacity-80 uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                  Items to Return *
                </label>
                {returnForm.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-sm" style={{ borderColor: 'rgba(243, 231, 223, 0.2)' }}>
                    <div>
                      <label className="block text-xs opacity-60 mb-1">Product Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateReturnItem(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-transparent border rounded-sm text-sm"
                        style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                        placeholder="Product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs opacity-60 mb-1">Size</label>
                      <input
                        type="text"
                        value={item.size}
                        onChange={(e) => updateReturnItem(index, 'size', e.target.value)}
                        className="w-full px-3 py-2 bg-transparent border rounded-sm text-sm"
                        style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                        placeholder="Size"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs opacity-60 mb-1">Reason</label>
                      <select
                        value={item.reason}
                        onChange={(e) => updateReturnItem(index, 'reason', e.target.value)}
                        className="w-full px-3 py-2 bg-transparent border rounded-sm text-sm"
                        style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                        required
                      >
                        <option value="">Select reason</option>
                        <option value="Size not fit">Size not fit</option>
                        <option value="Color mismatch">Color mismatch</option>
                        <option value="Changed mind">Changed mind</option>
                        <option value="Quality issue">Quality issue</option>
                        <option value="Wrong item">Wrong item</option>
                      </select>
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <label className="block text-xs opacity-60 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateReturnItem(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-transparent border rounded-sm text-sm"
                          style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                          required
                        />
                      </div>
                      {returnForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeReturnItem(index)}
                          className="p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addReturnItem}
                  className="flex items-center space-x-2 text-sm opacity-80 hover:opacity-100 transition-opacity duration-300"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add another item</span>
                </button>
              </div>

              <div>
                <label className="block text-sm tracking-wide mb-3 opacity-80 uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                  Additional Comments
                </label>
                <textarea
                  value={returnForm.comments}
                  onChange={(e) => setReturnForm(prev => ({ ...prev, comments: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-transparent border rounded-sm focus:outline-none focus:border-opacity-100 transition-all duration-300 resize-none"
                  style={{ borderColor: 'rgba(243, 231, 223, 0.3)', color: 'var(--brand-bg-exact)' }}
                  placeholder="Any additional information about your return..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-8 border rounded-sm hover:bg-white hover:bg-opacity-10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide uppercase font-medium"
                style={{ 
                  borderColor: 'rgba(243, 231, 223, 0.3)', 
                  color: 'var(--brand-bg-exact)',
                  fontFamily: 'Inter, sans-serif', 
                  letterSpacing: '0.1em' 
                }}
              >
                {isLoading ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </form>
          </div>
        )}

        {/* Tracking Results */}
        {returnRequest && (
          <div className="bg-white bg-opacity-5 rounded-lg p-8 border mb-16" style={{ borderColor: 'rgba(243, 231, 223, 0.2)' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h3 className="text-2xl font-light mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Return #{returnRequest.id}
                </h3>
                <p className="opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Order: {returnRequest.orderNumber} • Created: {new Date(returnRequest.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(returnRequest.status)} bg-opacity-20`}>
                  <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: `var(--${getStatusColor(returnRequest.status).replace('bg-', '')})` }}></span>
                  {getStatusText(returnRequest.status)}
                </span>
              </div>
            </div>

            {/* Return Items */}
            <div className="mb-8">
              <h4 className="text-lg font-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Items Being Returned</h4>
              <div className="space-y-3">
                {returnRequest.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-sm" style={{ borderColor: 'rgba(243, 231, 223, 0.2)' }}>
                    <div>
                      <p className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</p>
                      <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Size: {item.size} • Qty: {item.quantity} • Reason: {item.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <h4 className="text-lg font-light mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Return Status</h4>
              {returnRequest.timeline.map((event, index) => (
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

            {/* Estimated Refund */}
            <div className="mt-8 p-4 border rounded-sm" style={{ borderColor: 'rgba(243, 231, 223, 0.3)', backgroundColor: 'rgba(243, 231, 223, 0.05)' }}>
              <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="opacity-80">Estimated Refund Date:</span>{' '}
                <span className="font-medium">{new Date(returnRequest.estimatedRefund).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>
          </div>
        )}

        {/* Return Policy Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light tracking-wide mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Return Policy
              </h2>
              <div className="space-y-4 opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>
                <p>We want you to be completely satisfied with your MKY purchase. If you're not happy with your order, we're here to help.</p>
                
                <div className="space-y-3">
                  <h4 className="font-medium opacity-100">30-Day Return Window</h4>
                  <p>Items must be returned within 30 days of delivery. All returned items must be unworn, unwashed, and in original condition with tags attached.</p>
                  
                  <h4 className="font-medium opacity-100">Complimentary Returns</h4>
                  <p>We offer free returns for all UK customers. International customers will receive a prepaid return label with their order.</p>
                  
                  <h4 className="font-medium opacity-100">Refund Processing</h4>
                  <p>Refunds are processed within 5-7 business days after we receive your return. The refund will be issued to your original payment method.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-5 rounded-lg p-8 border" style={{ borderColor: 'rgba(243, 231, 223, 0.2)' }}>
            <h3 className="text-2xl font-light tracking-wide mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Quick Guide
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 border rounded-full flex items-center justify-center mt-1" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                  <span className="text-sm opacity-80">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Initiate Return</h4>
                  <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>Start your return online using your order number</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 border rounded-full flex items-center justify-center mt-1" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                  <span className="text-sm opacity-80">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Print Label</h4>
                  <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>Print your prepaid return shipping label</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 border rounded-full flex items-center justify-center mt-1" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                  <span className="text-sm opacity-80">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Package Items</h4>
                  <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>Pack items securely in original packaging</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 border rounded-full flex items-center justify-center mt-1" style={{ borderColor: 'rgba(243, 231, 223, 0.3)' }}>
                  <span className="text-sm opacity-80">4</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Drop Off</h4>
                  <p className="text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif' }}>Drop package at your nearest shipping location</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 border rounded-sm" style={{ borderColor: 'rgba(243, 231, 223, 0.3)', backgroundColor: 'rgba(243, 231, 223, 0.05)' }}>
              <h4 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Need Help?</h4>
              <p className="text-sm opacity-80 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Our returns team is available to assist you
              </p>
              <a 
                href="/contact" 
                className="inline-block px-6 py-2 border rounded-sm hover:bg-white hover:bg-opacity-10 transition-all duration-300 tracking-wide uppercase text-sm font-medium"
                style={{ 
                  borderColor: 'rgba(243, 231, 223, 0.3)', 
                  color: 'var(--brand-bg-exact)',
                  fontFamily: 'Inter, sans-serif', 
                  letterSpacing: '0.1em' 
                }}
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;