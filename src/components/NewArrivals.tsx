import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import AnimatedCard from './AnimatedCard';

type Product = { id: string; title: string; handle: string; created_at: string };

export default function NewArrivals({ limit = 8 }: { limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [media, setMedia] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: p } = await supabase
        .from('products')
        .select('id,title,handle,created_at,status')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);
      setProducts((p || []) as Product[]);
      const { data: m } = await supabase
        .from('product_images')
        .select('product_id,url,position')
        .order('position', { ascending: true });
      const firstByProduct: Record<string, string> = {};
      (m || []).forEach((row: any) => {
        if (!(row.product_id in firstByProduct)) firstByProduct[row.product_id] = row.url;
      });
      setMedia(firstByProduct);
    })();
  }, [limit]);

  if (!products.length) return null;

  return (
    <section className="py-16">
      <div className="flex items-baseline justify-between mb-12">
        <h2 className="text-3xl md:text-5xl tracking-tight" style={{ color: 'var(--brand-bg-exact)', fontFamily: 'Playfair Display, serif' }}>
          New Arrivals
        </h2>
        <a href="/products" className="text-sm tracking-widest hover:opacity-70 transition-opacity" style={{ color: 'var(--brand-bg-exact)', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.15em' }}>View all</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
        {products.map((p) => (
          <a key={p.id} href={`/product?handle=${encodeURIComponent(p.handle)}`} className="text-decoration-none text-inherit group block">
            <AnimatedCard>
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={media[p.id] || 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2835&auto=format&fit=crop'}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-base md:text-lg tracking-wide" style={{ color: 'var(--brand-bg-exact)', fontFamily: 'Inter, sans-serif' }}>{p.title}</h3>
                <p className="text-xs mt-2 tracking-wider uppercase" style={{ color: 'rgba(38,19,21,0.5)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>Just in</p>
              </div>
            </AnimatedCard>
          </a>
        ))}
      </div>
    </section>
  );
}


