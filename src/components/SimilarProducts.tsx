import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { formatPrice } from '../lib/currency';

type Product = { id: string; title: string; handle: string; price_gbp?: number; is_new?: boolean; tags?: string[]; gender?: string };

export default function SimilarProducts({ productId, handle, gender, limit = 4 }: { productId?: string; handle?: string; gender?: 'men' | 'women'; limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [media, setMedia] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      
      // Resolve productId from handle if not provided
      let resolvedProductId = productId;
      if (!resolvedProductId && handle) {
        const { data: byHandle } = await supabase
          .from('products')
          .select('id')
          .eq('handle', handle)
          .maybeSingle();
        resolvedProductId = byHandle?.id || '';
      }

      if (!resolvedProductId) return;
      
      // Get current product's collection and tags
      const { data: currentProduct } = await supabase
        .from('products')
        .select('id, collection_id, tags, gender')
        .eq('id', resolvedProductId)
        .single();
      
      if (!currentProduct) return;
      
      // Find similar products in the same collection
      let query = supabase
        .from('products')
        .select('id, title, handle, gender, price_gbp, tags, is_new')
        .eq('status', 'published')
        .neq('id', resolvedProductId); // Exclude current product
      
      // Prefer same collection
      if (currentProduct.collection_id) {
        query = query.eq('collection_id', currentProduct.collection_id);
      }
      
      // Filter by gender if specified
      if (gender) {
        query = query.eq('gender', gender);
      } else if (currentProduct.gender) {
        query = query.eq('gender', currentProduct.gender);
      }
      
      const { data: similarProducts } = await query.limit(limit);
      
      if (similarProducts && similarProducts.length > 0) {
        setProducts(similarProducts);
        
        // Get featured images for products
        const productIds = similarProducts.map((p: any) => p.id);
        const { data: images } = await supabase
          .from('product_images')
          .select('product_id, url')
          .in('product_id', productIds)
          .order('position', { ascending: true });
        
        if (images) {
          const mediaMap: Record<string, string> = {};
          images.forEach((img: any) => {
            if (!mediaMap[img.product_id]) {
              mediaMap[img.product_id] = img.url;
            }
          });
          setMedia(mediaMap);
        }
      }
    })();
  }, [productId, handle, gender, limit]);

  if (products.length === 0) return null;

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-serif font-light mb-8 text-center text-[rgb(38,19,21)] tracking-tight">View Similar Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <a 
            key={p.id} 
            href={`/product?handle=${encodeURIComponent(p.handle)}&id=${encodeURIComponent(p.id)}&from=${encodeURIComponent(window.location.pathname)}`} 
            className="group block overflow-hidden rounded-xl border border-[rgb(38,19,21)]/10 hover:border-[rgb(38,19,21)]/20 hover:shadow-xl transition-all duration-300"
          >
            {/* Product Image */}
            <div className="aspect-[3/4] overflow-hidden bg-neutral-50">
              {p.is_new && (
                <div className="absolute top-3 left-3 z-10 bg-[rgb(38,19,21)] text-white px-2 py-1 text-[10px] font-medium tracking-wider">
                  NEW
                </div>
              )}
              <img 
                src={media[p.id] || 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2835&auto=format&fit=crop'} 
                alt={p.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            </div>

            {/* Product Info */}
            <div className="p-4 bg-white">
              <h3 className="text-sm font-light tracking-wide text-[rgb(38,19,21)] mb-1.5 line-clamp-2">
                {p.title}
              </h3>
              <p className="text-sm font-medium text-[rgb(38,19,21)]">
                {formatPrice((p.price_gbp || 0) * 100, 'GBP')}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
