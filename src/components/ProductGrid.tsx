import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';

type Product = { id: string; title: string; handle: string; price_gbp?: number; is_new?: boolean; tags?: string[] };

export default function ProductGrid({ gender, collection }: { gender?: 'men' | 'women'; collection?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [media, setMedia] = useState<Record<string, string>>({});
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      console.log('[ProductGrid] Fetching products for gender:', gender, 'collection:', collection);
      const supabase = getSupabase();
      if (!supabase) return;
      let query = supabase.from('products').select('id,title,handle,gender,price_gbp,tags').eq('status','published');
      if (gender) query = query.eq('gender', gender);
      // If collection provided, use helper view to filter by collection slug
      let p;
      if (collection) {
        let vq = supabase
          .from('v_published_products_with_collections')
          .select('id,title,handle,gender,price_gbp,tags')
          .eq('collection_slug', collection);
        if (gender) vq = vq.eq('gender', gender);
        const { data } = await vq;
        console.log('[ProductGrid] View query result:', data);
        p = (data || []).map((d: any) => ({
          id: d.id,
          title: d.title,
          handle: d.handle,
          gender: d.gender,
          price_gbp: d.price_gbp,
          tags: d.tags,
          is_new: d.tags?.includes('new')
        }));
      } else {
        const res = await query;
        p = (res.data || []).map((d: any) => ({
          ...d,
          is_new: d.tags?.includes('new')
        }));
      }
      setProducts(p || []);
      const { data: m } = await supabase.from('product_images').select('product_id,url').order('position', { ascending: true });
      const firstByProduct: Record<string,string> = {};
      (m||[]).forEach((row: any) => { if (!(row.product_id in firstByProduct)) firstByProduct[row.product_id] = row.url; });
      setMedia(firstByProduct);
    })();
  }, [gender, collection]);

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return `£${price.toLocaleString('en-GB')}`;
  };

  return (
    <div className="w-full bg-transparent">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-4xl mx-auto px-4">
        {products.map((p) => {
          console.log('[ProductGrid] Rendering product:', { id: p.id, handle: p.handle, title: p.title });
          return (
            <a 
              key={p.id} 
              href={`/product?handle=${encodeURIComponent(p.handle)}&id=${encodeURIComponent(p.id)}&from=${encodeURIComponent(window.location.pathname)}`} 
              className="group relative block hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Card */}
              <div className="relative bg-transparent">
                {/* Tag */}
                {p.is_new && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] sm:text-xs font-light tracking-wider text-neutral-600">
                      New
                    </span>
                  </div>
                )}
                
                {/* Product Image */}
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                  <img 
                    src={media[p.id] || 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2835&auto=format&fit=crop'} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Wishlist Heart */}
                <button
                  onClick={(e) => toggleWishlist(p.id, e)}
                  className="absolute bottom-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  aria-label="Add to wishlist"
                >
                  <svg 
                    className={`w-4 h-4 transition-colors ${wishlist.has(p.id) ? 'fill-black' : 'fill-none'} stroke-black stroke-1`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-6 bg-transparent">
                <h3 className="text-xs sm:text-sm font-light tracking-wide text-neutral-900 mb-2">
                  {p.title}
                </h3>
                {p.price_gbp && (
                  <p className="text-xs sm:text-sm font-light text-neutral-600">
                    {formatPrice(p.price_gbp)}
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}





