import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { formatPrice, readCurrency, type Currency } from '../lib/currency';
import AddToCartButton from './AddToCartButton';

export default function ProductDetail({ handle }: { handle: string }) {
  const [product, setProduct] = useState<any>(null);
  const [media, setMedia] = useState<string[]>([]);
  const [variant, setVariant] = useState<any>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>('GBP');

  useEffect(() => {
    setCurrency(readCurrency());
    (async () => {
      const supabase = getSupabase();
      if (!supabase || !handle) return;
      const { data: p } = await supabase.from('products').select('id,title,handle,description').eq('handle', handle).single();
      setProduct(p);
      if (p) {
        const { data: m } = await supabase.from('product_images').select('url').eq('product_id', p.id).order('position');
        setMedia((m||[]).map((r:any)=>r.url));
        const { data: allVariants } = await supabase.from('product_variants').select('id,sku').eq('product_id', p.id);
        const optionsByVariant: Record<string, string> = {};
        for (const v of allVariants || []) {
          const { data: opts } = await supabase.from('product_variant_options').select('name,value').eq('variant_id', v.id);
          const sizeOpt = (opts||[]).find((o:any)=>o.name==='Size');
          if (sizeOpt) optionsByVariant[sizeOpt.value] = v.id;
        }
        const sizesSorted = Object.keys(optionsByVariant).sort();
        setSizes(sizesSorted);
        const firstSize = sizesSorted[0];
        const variantId = optionsByVariant[firstSize];
        if (variantId) {
          const { data: pr } = await supabase.from('prices').select('currency,unit_amount_cents').eq('variant_id', variantId);
          setVariant({ id: variantId, sku: '', prices: pr || [], optionsByVariant });
        }
      }
    })();
  }, [handle]);

  if (!product) return <div>Loading…</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        {(media.length ? media : ['https://placehold.co/800x1000']).map((u) => (
          <div key={u} className="photo-frame mb-4">
            <img src={u} alt={product.title} style={{ width: '100%', display: 'block' }} />
          </div>
        ))}
      </div>
      <div>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        {sizes.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="text-sm text-neutral-600">Select Size</div>
            <div className="flex gap-2 mt-2">
              {sizes.map((s) => (
                <button key={s} className="btn btn-outline" onClick={async()=>{
                  const supabase = getSupabase();
                  const id = (variant?.optionsByVariant || {})[s];
                  if (supabase && id) {
                    const { data: pr } = await supabase.from('prices').select('currency,unit_amount_cents').eq('variant_id', id);
                    setVariant({ id, prices: pr || [], optionsByVariant: variant?.optionsByVariant });
                  }
                }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {variant && (
          <div style={{ fontWeight: 600, margin: '12px 0' }}>
            {formatPrice(
              (variant.prices?.find((p:any)=>p.currency===currency)?.unit_amount_cents) ?? 0,
              currency
            )}
          </div>
        )}
        {variant && <AddToCartButton variantId={variant.id} prices={variant.prices || []} />}
      </div>
    </div>
  );
}





