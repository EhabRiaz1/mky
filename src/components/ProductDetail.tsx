'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  quantity?: number;
  variantId: string;
}

export default function ProductDetail({ handle, id }: { handle: string; id?: string }) {
  const [product, setProduct] = useState<any>(null);
  const [media, setMedia] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState('');
  const [variant, setVariant] = useState<any>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [currentSizeCategory, setCurrentSizeCategory] = useState('bebe');
  const [activeMeasurement, setActiveMeasurement] = useState('');
  const [currency, setCurrency] = useState('GBP'); // Add currency state
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);

  const sizeLabels: Record<string, string> = {
    '46': 'Bébé',
    '48': 'Garçon',
    '50': 'Homme'
  };

  const sizesData = {
    bebe: {
      jacket: 28.5,
      arm: 24.5,
      shoulder: 17,
      chest: 21,
      waist: 19.5,
      abdominal: 21
    },
    garcon: {
      jacket: 30,
      arm: 25,
      shoulder: 18.5,
      chest: 22,
      waist: 20.5,
      abdominal: 22
    },
    homme: {
      jacket: 31,
      arm: 26.5,
      shoulder: 19,
      chest: 23.5,
      waist: 21.5,
      abdominal: 23.5
    }
  };

  // Function to get currency from cookie
  const getCurrencyFromCookie = () => {
    if (typeof window === 'undefined') return 'GBP';
    const cookies = document.cookie.split(';');
    const currencyCookie = cookies.find(cookie => cookie.trim().startsWith('mky_currency='));
    return currencyCookie ? currencyCookie.split('=')[1] : 'GBP';
  };

  // Function to get price based on currency
  const getPrice = (variant: any) => {
    if (!variant || !variant.prices) return 0;
    
    const currentCurrency = getCurrencyFromCookie();
    const priceData = variant.prices.find((p: any) => p.currency === currentCurrency);
    
    if (priceData) {
      return priceData.unit_amount_cents / 100;
    }
    
    // Fallback to GBP if currency not found
    const gbpPrice = variant.prices.find((p: any) => p.currency === 'GBP');
    return gbpPrice ? gbpPrice.unit_amount_cents / 100 : 0;
  };

  // Function to get currency symbol
  const getCurrencySymbol = () => {
    const currentCurrency = getCurrencyFromCookie();
    return currentCurrency === 'EUR' ? '€' : '£';
  };

  // Function to format price with currency symbol
  const formatPrice = (price: number) => {
    return `${getCurrencySymbol()}${price.toFixed(2)}`;
  };

  useEffect(() => {
    const getCartFromStorage = (): CartItem[] => {
      if (typeof window === 'undefined') return [];
      try {
        return JSON.parse(localStorage.getItem('mky_cart') || '[]');
      } catch {
        return [];
      }
    };
    setCartItems(getCartFromStorage());

    // Set initial currency from cookie
    setCurrency(getCurrencyFromCookie());

    (async () => {
      const supabase = getSupabase();
      if (!supabase || (!handle && !id)) return;

      let p: any = null;
      if (id) {
        const { data } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
        p = data;
      }
      if (!p && handle) {
        const { data } = await supabase.from('products').select('*').eq('handle', handle).maybeSingle();
        p = data;
      }
      if (!p) return;

      setProduct(p);

      const { data: m } = await supabase.from('product_images').select('url').eq('product_id', p.id).order('position');
      const mediaUrls = (m || []).map((r: any) => r.url);
      setMedia(mediaUrls);
      setSelectedMedia(mediaUrls[0] || '');

      const { data: allVariants } = await supabase.from('product_variants').select('id,sku').eq('product_id', p.id);
      const optionsByVariant: Record<string, string> = {};
      for (const v of allVariants || []) {
        const { data: opts } = await supabase.from('product_variant_options').select('name,value').eq('variant_id', v.id);
        const sizeOpt = (opts || []).find((o: any) => o.name === 'Size');
        if (sizeOpt) optionsByVariant[sizeOpt.value] = v.id;
      }
      const sizesSorted = Object.keys(optionsByVariant).sort();
      setSizes(sizesSorted);

      const firstSize = sizesSorted[0];
      setSelectedSize(firstSize);
      const variantId = optionsByVariant[firstSize];
      if (variantId) {
        const { data: pr } = await supabase.from('prices').select('currency,unit_amount_cents').eq('variant_id', variantId);
        setVariant({ id: variantId, prices: pr || [], optionsByVariant });
      }
    })();
  }, [handle, id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mky_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Listen for currency changes
  useEffect(() => {
    const checkCurrencyChange = () => {
      const currentCurrency = getCurrencyFromCookie();
      if (currentCurrency !== currency) {
        setCurrency(currentCurrency);
      }
    };

    // Check for currency changes every second
    const interval = setInterval(checkCurrencyChange, 1000);
    return () => clearInterval(interval);
  }, [currency]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const addToCart = (productData: any, selectedVariant: any, selectedSize?: string) => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const price = getPrice(selectedVariant);

    const newItem: CartItem = {
      id: `${productData.id}-${selectedVariant.id}`,
      name: productData.title,
      description: productData.description,
      price,
      image: selectedMedia,
      size: selectedSize,
      variantId: selectedVariant.id,
      quantity: 1,
    };

    setIsAnimating(true);
    setCartItems(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item => item.id === newItem.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      }
      return [...prev, newItem];
    });

    setTimeout(() => {
      setDrawerOpen(true);
      setIsAnimating(false);
    }, 150);
  };

  const removeFromCart = (id: string) => setCartItems(prev => prev.filter(item => item.id !== id));
  
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    const variantId = variant?.optionsByVariant[size];
    if (variantId) {
      setVariant({ ...variant, id: variantId });
    }
  };

  const handleMeasurementHover = (measurement: string) => {
    setActiveMeasurement(measurement);
  };

  const handleMeasurementLeave = () => {
    setActiveMeasurement('');
  };

  const handleSizeCategorySelect = (sizeCategory: string) => {
    setCurrentSizeCategory(sizeCategory);
  };

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-screen py-8 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto items-center lg:items-start justify-center lg:justify-start mt-16 lg:mt-24">
      <div className="w-full lg:w-[55%] flex flex-col gap-4 items-center lg:items-start">
        <div className="aspect-square overflow-hidden rounded-2xl bg-gray-50">
          <img 
            src={selectedMedia} 
            alt={product.title} 
            className="w-full h-full object-contain transition-opacity duration-300"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {media.map(u => (
            <button 
              key={u} 
              onClick={() => setSelectedMedia(u)} 
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                u === selectedMedia ? 'border-black scale-105' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img src={u} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex flex-col gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-light mb-2">{product.title}</h1>
          <p className="text-2xl lg:text-3xl font-medium">
            {variant ? formatPrice(getPrice(variant)) : 'Loading...'}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <button 
              onClick={() => setSizeGuideOpen(true)}
              className="text-sm text-gray-500 hover:text-black underline"
            >
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button 
                key={size} 
                onClick={() => handleSizeSelect(size)}
                className={`px-4 py-3 border-2 rounded-full transition-all ${
                  selectedSize === size
                    ? 'bg-black text-white border-black shadow-md' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {sizeLabels[size] || size}
              </button>
            ))}
          </div>
        </div>

        {variant && (
          <button
            onClick={() => addToCart(product, variant, selectedSize)}
            disabled={isAnimating || !selectedSize}
            className={`w-full py-4 rounded-full font-semibold transition-all ${
              isAnimating || !selectedSize
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800 transform hover:scale-[1.02]'
            }`}
          >
            {isAnimating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </div>
            ) : (
              'Add to Cart'
            )}
          </button>
        )}

        {product.description && (
          <div className="mt-6 text-gray-700 leading-relaxed">
            {product.description}
          </div>
        )}

        {/* Product Details Dropdown */}
        {product.product_details && product.product_details.length > 0 && (
          <div className="mt-6 border-t border-gray-200">
            <button 
              onClick={() => setExpandedDropdown(expandedDropdown === 'details' ? null : 'details')}
              className="w-full flex items-center justify-between py-4 group transition-all duration-300 hover:opacity-70"
            >
              <span className="text-sm font-light tracking-widest uppercase text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Product Details</span>
              <svg 
                className={`w-4 h-4 text-gray-600 transition-all duration-500 ease-out ${expandedDropdown === 'details' ? 'rotate-180 opacity-60' : 'opacity-40'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedDropdown === 'details' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pb-4 space-y-3">
                {product.product_details.map((detail: string, index: number) => (
                  <p key={index} className="text-xs font-light text-gray-600 leading-relaxed tracking-wide">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Materials & Care Dropdown */}
        {product.materials_care && product.materials_care.length > 0 && (
          <div className="-mt-2px border-t border-gray-200">
            <button 
              onClick={() => setExpandedDropdown(expandedDropdown === 'care' ? null : 'care')}
              className="w-full flex items-center justify-between py-4 group transition-all duration-300 hover:opacity-70"
            >
              <span className="text-sm font-light tracking-widest uppercase text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Materials & Care</span>
              <svg 
                className={`w-4 h-4 text-gray-600 transition-all duration-500 ease-out ${expandedDropdown === 'care' ? 'rotate-180 opacity-60' : 'opacity-40'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-out ${expandedDropdown === 'care' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pb-4 space-y-3">
                {product.materials_care.map((care: string, index: number) => (
                  <p key={index} className="text-xs font-light text-gray-600 leading-relaxed tracking-wide">
                    {care}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity" 
            onClick={() => setDrawerOpen(false)} 
          />
          
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-lg">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-xl bg-white">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)} 
                              className="text-red-600 text-sm hover:text-red-800 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * (item.quantity || 1))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/checkout'}
                    className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors transform hover:scale-[1.02]"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {sizeGuideOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity" 
            onClick={() => setSizeGuideOpen(false)} 
          />
          
          <div className="relative bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h1 className="text-3xl lg:text-4xl text-center mb-4 font-light tracking-widest uppercase">Size Guide</h1>
              <p className="text-center text-gray-400 mb-12 text-lg">Select a size and hover over measurements to see location</p>

              <div className="flex justify-center gap-4 mb-12 flex-wrap">
                {Object.keys(sizesData).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeCategorySelect(size)}
                    className={`px-6 py-3 border-2 rounded-full transition-all text-lg capitalize ${
                      currentSizeCategory === size
                        ? 'bg-white text-black border-white'
                        : 'border-gray-500 text-gray-300 hover:border-gray-300 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
                <div className="flex-1 max-w-2xl">
                  <svg viewBox="0 0 300 400" className="w-full h-auto">
                    <path d="M 95 85 L 45 105 L 35 160 L 38 195 L 80 200 L 85 130 Z" 
                          fill="rgba(255,255,255,0.12)" 
                          stroke="rgba(255,255,255,0.4)" 
                          strokeWidth="1.5"/>
                    
                    <path d="M 205 85 L 255 105 L 265 160 L 262 195 L 220 200 L 215 130 Z" 
                          fill="rgba(255,255,255,0.12)" 
                          stroke="rgba(255,255,255,0.4)" 
                          strokeWidth="1.5"/>
                    
                    <path d="M 95 85 L 85 130 L 80 200 L 75 280 L 80 360 L 100 385 L 145 385 L 145 85 Z" 
                          fill="rgba(255,255,255,0.15)" 
                          stroke="rgba(255,255,255,0.5)" 
                          strokeWidth="2"/>
                    <path d="M 205 85 L 215 130 L 220 200 L 225 280 L 220 360 L 200 385 L 155 385 L 155 85 Z" 
                          fill="rgba(255,255,255,0.15)" 
                          stroke="rgba(255,255,255,0.5)" 
                          strokeWidth="2"/>
                    
                    <path d="M 130 60 L 120 75 L 145 85 L 155 85 L 180 75 L 170 60 Z" 
                          fill="rgba(255,255,255,0.2)" 
                          stroke="rgba(255,255,255,0.6)" 
                          strokeWidth="1.5"/>
                    
                    <path d="M 145 85 L 120 75 L 105 120 L 125 135 L 145 140 Z" 
                          fill="rgba(255,255,255,0.25)" 
                          stroke="rgba(255,255,255,0.6)" 
                          strokeWidth="1.5"/>
                    <path d="M 155 85 L 180 75 L 195 120 L 175 135 L 155 140 Z" 
                          fill="rgba(255,255,255,0.25)" 
                          stroke="rgba(255,255,255,0.6)" 
                          strokeWidth="1.5"/>
                    
                    <line x1="150" y1="140" x2="150" y2="340" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    
                    <circle cx="150" cy="160" r="3" fill="rgba(255,255,255,0.4)"/>
                    <circle cx="150" cy="200" r="3" fill="rgba(255,255,255,0.4)"/>
                    <circle cx="150" cy="240" r="3" fill="rgba(255,255,255,0.4)"/>
                    <circle cx="150" cy="280" r="3" fill="rgba(255,255,255,0.4)"/>
                    
                    <path d="M 100 220 L 130 220 L 130 255 L 100 255" 
                          fill="none" 
                          stroke="rgba(255,255,255,0.3)" 
                          strokeWidth="1.5"/>
                    <path d="M 170 220 L 200 220 L 200 255 L 170 255" 
                          fill="none" 
                          stroke="rgba(255,255,255,0.3)" 
                          strokeWidth="1.5"/>

                    <line 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'jacket' ? 'opacity-100' : 'opacity-0'}`}
                      x1="240" y1="50" x2="240" y2="380"
                      stroke="#00d4ff" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'jacket' ? 'opacity-100' : 'opacity-0'}`}
                      cx="240" cy="50" r="4" fill="#00d4ff"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'jacket' ? 'opacity-100' : 'opacity-0'}`}
                      cx="240" cy="380" r="4" fill="#00d4ff"
                    />

                    <line 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'arm' ? 'opacity-100' : 'opacity-0'}`}
                      x1="200" y1="80" x2="30" y2="180"
                      stroke="#00d4ff" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'arm' ? 'opacity-100' : 'opacity-0'}`}
                      cx="200" cy="80" r="4" fill="#00d4ff"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'arm' ? 'opacity-100' : 'opacity-0'}`}
                      cx="30" cy="180" r="4" fill="#00d4ff"
                    />

                    <line 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'shoulder' ? 'opacity-100' : 'opacity-0'}`}
                      x1="100" y1="80" x2="200" y2="80"
                      stroke="#00d4ff" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'shoulder' ? 'opacity-100' : 'opacity-0'}`}
                      cx="100" cy="80" r="4" fill="#00d4ff"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'shoulder' ? 'opacity-100' : 'opacity-0'}`}
                      cx="200" cy="80" r="4" fill="#00d4ff"
                    />

                    <line 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'chest' ? 'opacity-100' : 'opacity-0'}`}
                      x1="90" y1="120" x2="210" y2="120"
                      stroke="#00d4ff" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'chest' ? 'opacity-100' : 'opacity-0'}`}
                      cx="90" cy="120" r="4" fill="#00d4ff"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'chest' ? 'opacity-100' : 'opacity-0'}`}
                      cx="210" cy="120" r="4" fill="#00d4ff"
                    />

                    <line 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'waist' ? 'opacity-100' : 'opacity-0'}`}
                      x1="85" y1="220" x2="215" y2="220"
                      stroke="#00d4ff" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'waist' ? 'opacity-100' : 'opacity-0'}`}
                      cx="85" cy="220" r="4" fill="#00d4ff"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'waist' ? 'opacity-100' : 'opacity-0'}`}
                      cx="215" cy="220" r="4" fill="#00d4ff"
                    />

                    <line 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'abdominal' ? 'opacity-100' : 'opacity-0'}`}
                      x1="80" y1="280" x2="220" y2="280"
                      stroke="#00d4ff" 
                      strokeWidth="2" 
                      strokeDasharray="5,5"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'abdominal' ? 'opacity-100' : 'opacity-0'}`}
                      cx="80" cy="280" r="4" fill="#00d4ff"
                    />
                    <circle 
                      className={`transition-opacity duration-300 ${activeMeasurement === 'abdominal' ? 'opacity-100' : 'opacity-0'}`}
                      cx="220" cy="280" r="4" fill="#00d4ff"
                    />
                  </svg>
                </div>

                <div className="flex-1 max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                  {Object.entries({
                    jacket: 'Jacket Length',
                    arm: 'Arm Length', 
                    shoulder: 'Shoulder',
                    chest: 'Chest',
                    waist: 'Waist',
                    abdominal: 'Abdominal'
                  }).map(([measurement, label]) => (
                    <div
                      key={measurement}
                      onMouseEnter={() => handleMeasurementHover(measurement)}
                      onMouseLeave={handleMeasurementLeave}
                      className={`flex justify-between items-center p-5 mb-3 rounded-xl transition-all cursor-pointer ${
                        activeMeasurement === measurement
                          ? 'bg-cyan-500/20 border-2 border-cyan-500/50'
                          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg font-light tracking-wide">{label}</span>
                      <span className="text-xl font-medium text-cyan-400">
                        {sizesData[currentSizeCategory][measurement]}
                        <span className="text-sm text-gray-400 ml-1">cm</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-gray-500 mt-12">All measurements are in centimeters</p>

              <button 
                onClick={() => setSizeGuideOpen(false)}
                className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}