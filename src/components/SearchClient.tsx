import { useEffect, useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchClient() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    const supabase = getSupabase();
    
    try {
      const cleanTerm = searchTerm.trim();

      // Get products matching title
      const { data: products, error } = await supabase
        .from('products')
        .select('id,title,handle,price,description')
        .ilike('title', `%${cleanTerm}%`)
        .limit(20);

      if (error) {
        console.error('Supabase search error:', error);
        setResults([]);
        setHasSearched(true);
        setLoading(false);
        return;
      }

      // For each product, try to get the main image
      const productsWithImages = await Promise.all((products || []).map(async (product) => {
        const { data: images } = await supabase
          .from('product_images')
          .select('url')
          .eq('product_id', product.id)
          .order('position')
          .limit(1);
          
        // Get price if available
        let price = null;
        const { data: variants } = await supabase
           .from('product_variants')
           .select('id')
           .eq('product_id', product.id)
           .limit(1);
           
        if (variants && variants.length > 0) {
           const { data: prices } = await supabase
             .from('prices')
             .select('unit_amount_cents, currency')
             .eq('variant_id', variants[0].id)
             .limit(1);
             
           if (prices && prices.length > 0) {
             const gbpPrice = prices.find(p => p.currency === 'GBP') || prices[0];
             price = gbpPrice.unit_amount_cents / 100;
           }
        }

        return {
          ...product,
          image: images && images.length > 0 ? images[0].url : null,
          displayPrice: price
        };
      }));

      setResults(productsWithImages);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const id = setTimeout(() => {
      if (q) performSearch(q);
    }, 300);
    return () => clearTimeout(id);
  }, [q]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch(q);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Input Section */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-light mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          What are you looking for?
        </h1>
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-2xl md:text-3xl font-light focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 text-center"
            placeholder="Type to search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
            {loading ? (
              <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 aspect-[3/4] rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                </div>
              ))}
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-gray-500 mb-8 tracking-wide uppercase text-center">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                {results.map((product) => (
                  <a 
                    key={product.id} 
                    href={`/product?handle=${encodeURIComponent(product.handle)}`}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden mb-4 relative">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                    </div>
                    <h3 className="text-lg font-light text-gray-900 group-hover:text-black transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {product.title}
                    </h3>
                    {product.displayPrice && (
                      <p className="text-sm text-gray-600 mt-1 font-medium">
                        £{product.displayPrice.toFixed(2)}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </motion.div>
          ) : hasSearched && q ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl font-light text-gray-600 mb-4">No results found for "{q}"</p>
              <p className="text-gray-400">Try checking your spelling or using a different keyword.</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}





