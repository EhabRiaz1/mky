import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

type Product = { id: string; title: string; handle: string; gender: string };

interface FeaturedCollectionProps {
  title: string;
  subtitle?: string;
  collectionSlug?: string;
  gender?: 'men' | 'women';
  limit?: number;
  ctaText?: string;
  ctaLink?: string;
}

export default function FeaturedCollection({ 
  title, 
  subtitle, 
  collectionSlug, 
  gender,
  limit = 4,
  ctaText = 'Discover the collection',
  ctaLink = '/products'
}: FeaturedCollectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [media, setMedia] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const supabase = getSupabase();
      if (!supabase) return;

      let query = supabase
        .from('products')
        .select('id,title,handle,gender,status')
        .eq('status', 'published')
        .limit(limit);

      if (gender) {
        query = query.eq('gender', gender);
      }

      if (collectionSlug) {
        const { data } = await supabase
          .from('products')
          .select('id,title,handle,gender,product_collections:product_collections(collection_id),collections:collections!inner(id,slug)')
          .eq('status', 'published')
          .eq('collections.slug', collectionSlug)
          .limit(limit);
        const p = (data || []).map((d: any) => ({ 
          id: d.id, 
          title: d.title, 
          handle: d.handle, 
          gender: d.gender 
        }));
        setProducts(p);
      } else {
        const { data: p } = await query;
        setProducts((p || []) as Product[]);
      }

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
  }, [collectionSlug, gender, limit]);

  if (!products.length) return null;

  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        {subtitle && (
          <div className="text-sm tracking-widest mb-3 uppercase" style={{ color: 'rgba(38,19,21,0.5)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em' }}>
            {subtitle}
          </div>
        )}
        <h2 className="text-3xl md:text-5xl tracking-tight mb-4" style={{ color: 'var(--brand-bg-exact)', fontFamily: 'Playfair Display, serif' }}>
          {title}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 mb-12">
        {products.map((p, idx) => (
          <motion.a
            key={p.id}
            href={`/product?handle=${encodeURIComponent(p.handle)}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.5 }}
            viewport={{ once: true }}
            className="group block overflow-hidden"
          >
            <div className="aspect-[3/4] mb-4 overflow-hidden">
              <img
                src={media[p.id] || 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2835&auto=format&fit=crop'}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h3 className="text-sm md:text-base tracking-wide px-2" style={{ color: 'var(--brand-bg-exact)', fontFamily: 'Inter, sans-serif' }}>
              {p.title}
            </h3>
          </motion.a>
        ))}
      </div>

      {ctaLink && (
        <div className="text-center">
          <a 
            href={ctaLink}
            className="inline-block border-b pb-2 text-sm tracking-widest transition-opacity hover:opacity-70"
            style={{ 
              color: 'var(--brand-bg-exact)',
              borderColor: 'var(--brand-bg-exact)',
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.15em'
            }}
          >
            {ctaText}
          </a>
        </div>
      )}
    </section>
  );
}

