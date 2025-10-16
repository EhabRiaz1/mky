import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import AnimatedCard from './AnimatedCard';

type Product = { id: string; title: string; handle: string };

export default function ProductGrid({ gender, collection }: { gender?: 'men' | 'women'; collection?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [media, setMedia] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      let query = supabase.from('products').select('id,title,handle,gender').eq('status','published');
      if (gender) query = query.eq('gender', gender);
      // If collection provided, join product_collections via RPC-like filter
      let p;
      if (collection) {
        const { data } = await supabase
          .from('products')
          .select('id,title,handle,gender,product_collections:product_collections(collection_id),collections:collections!inner(id,slug)')
          .eq('status','published')
          .eq('collections.slug', collection);
        p = (data || []).map((d: any) => ({ id: d.id, title: d.title, handle: d.handle, gender: d.gender }));
      } else {
        const res = await query;
        p = res.data;
      }
      setProducts(p || []);
      const { data: m } = await supabase.from('product_images').select('product_id,url').order('position', { ascending: true });
      const firstByProduct: Record<string,string> = {};
      (m||[]).forEach((row: any) => { if (!(row.product_id in firstByProduct)) firstByProduct[row.product_id] = row.url; });
      setMedia(firstByProduct);
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <a key={p.id} href={`/product?handle=${encodeURIComponent(p.handle)}`} className="text-decoration-none text-inherit">
          <AnimatedCard>
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src={media[p.id] || 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2835&auto=format&fit=crop'} 
                alt={p.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-light">{p.title}</h3>
              <p className="text-sm text-neutral-500 mt-1">Luxury Collection</p>
            </div>
          </AnimatedCard>
        </a>
      ))}
    </div>
  );
}





