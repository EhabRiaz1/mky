import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { formatPrice, readCurrency, type Currency } from '../lib/currency';
import AddToCartButton from './AddToCartButton';

export default function ProductDetail({ handle, id }: { handle: string; id?: string }) {
  console.log('*** [ProductDetail TEST] Component is mounting with params:', { handle, id });
  // alert('ProductDetail is loading! Params: ' + JSON.stringify({ handle, id })); // Uncomment if you want a popup alert for testing
  const [product, setProduct] = useState<any>(null);
  const [media, setMedia] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState('');
  const [variant, setVariant] = useState<any>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>('GBP');
  const [notFound, setNotFound] = useState(false);
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    setCurrency(readCurrency());
    (async () => {
      const supabase = getSupabase();
      if (!supabase) { setNotFound(true); return; }
      if (!handle && !id) { setNotFound(true); return; }
      const envUrl = (import.meta as any).env.PUBLIC_SUPABASE_URL || (import.meta as any).env.VITE_SUPABASE_URL;
      const dbg: any = { envUrl, input: { handle, id } };
      try { console.debug('[ProductDetail] init', dbg); } catch {}
      let p: any = null;
      if (id) {
        console.log('[ProductDetail] Fetching by ID:', id);
        const { data: byIdData, error: byIdErr } = await supabase
          .from('products')
          .select('id,title,handle,description,price_gbp,price_eur,product_details,materials_care')
          .eq('id', id)
          .maybeSingle();
        dbg.byId = { ok: !!byIdData, error: byIdErr?.message };
        console.debug('[ProductDetail] By ID Result:', { data: byIdData, error: byIdErr });
        p = byIdData as any;
      }
      if (!p && handle) {
        console.log('[ProductDetail] Fetching by Handle:', handle);
        const { data: byHandleData, error: byHandleErr } = await supabase
          .from('products')
          .select('id,title,handle,description,price_gbp,price_eur,product_details,materials_care')
          .eq('handle', handle)
          .maybeSingle();
        dbg.byHandle = { ok: !!byHandleData, error: byHandleErr?.message };
        console.debug('[ProductDetail] By Handle Result:', { data: byHandleData, error: byHandleErr });
        p = byHandleData as any;
      }
      if (!p) {
        console.log('[ProductDetail] Product not found. Debug info:', dbg);
        setDebug(dbg);
        setNotFound(true);
        setProduct(null);
        return;
      }
      setProduct(p);
      if (p) {
        const { data: m } = await supabase.from('product_images').select('url').eq('product_id', p.id).order('position');
        const mediaUrls = (m||[]).map((r:any)=>r.url);
        setMedia(mediaUrls);
        setSelectedMedia(mediaUrls[0] || '');
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
  }, [handle, id]);

  if (notFound) return (
    <div>
      <div>Product not found.</div>
      {debug && (
        <pre style={{ marginTop: 12, fontSize: 12, background: '#f6f6f6', padding: 12, borderRadius: 6, overflow: 'auto' }}>
{JSON.stringify(debug, null, 2)}
        </pre>
      )}
    </div>
  );
  if (!product) return <div>Loading…</div>;

  return (
    <div className="flex flex-col md:flex-row gap-12 lg:gap-16 min-h-screen py-8 px-6 md:px-12 lg:px-16 max-w-[1800px] mx-auto items-start md:items-center">
      {/* Photo Gallery - Left Side */}
      <div className="w-full md:w-[45%] lg:w-[48%] flex justify-center">
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-6 md:p-8 w-full max-w-[600px]">
          {media.length > 0 ? (
            <>
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4">
                <img 
                  src={selectedMedia} 
                  alt={product.title} 
                  className="w-full h-full object-contain transition-opacity duration-500" 
                />
              </div>
              <div className="flex gap-3 justify-center flex-wrap">
                {media.map((u) => (
                  <button 
                    key={u} 
                    onClick={() => setSelectedMedia(u)} 
                    className={`w-14 h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                      u === selectedMedia 
                        ? 'ring-2 ring-black/60 scale-105 opacity-100' 
                        : 'opacity-40 hover:opacity-80 hover:scale-105'
                    }`}
                  >
                    <img src={u} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
              <img 
                src="https://placehold.co/800x1000" 
                alt={product.title} 
                className="w-full h-full object-contain" 
              />
            </div>
          )}
        </div>
      </div>

      {/* Product Info - Right Side */}
      <div className="w-full md:w-[55%] lg:w-[52%] flex justify-center md:py-8">
        <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-8 md:p-10 lg:p-12 w-full max-w-[650px]">
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-tight text-[rgb(38,19,21)]">
              {product.title}
            </h1>
            
            {/* Price */}
            {variant && (
              <div className="text-2xl md:text-3xl font-light text-[rgb(38,19,21)]">
                {formatPrice(
                  (variant.prices?.find((p:any)=>p.currency===currency)?.unit_amount_cents) ?? 0,
                  currency
                )}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-[rgb(38,19,21)]/10 my-6"></div>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <div className="text-xs uppercase tracking-wider text-[rgb(38,19,21)]/60 mb-3 font-medium">
                  Select Size
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button 
                      key={s} 
                      className="px-6 py-2.5 rounded-full border border-[rgb(38,19,21)]/20 hover:border-[rgb(38,19,21)] hover:bg-[rgb(38,19,21)]/5 transition-all duration-300 text-sm font-medium text-[rgb(38,19,21)]" 
                      onClick={async()=>{
                        const supabase = getSupabase();
                        const id = (variant?.optionsByVariant || {})[s];
                        if (supabase && id) {
                          const { data: pr } = await supabase.from('prices').select('currency,unit_amount_cents').eq('variant_id', id);
                          setVariant({ id, prices: pr || [], optionsByVariant: variant?.optionsByVariant });
                        }
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            {variant && (
              <AddToCartButton 
                variantId={variant.id} 
                prices={variant.prices || []} 
                className="w-full bg-[rgb(38,19,21)] text-white py-4 rounded-full font-medium text-base tracking-wide hover:bg-[rgb(38,19,21)]/90 transition-all duration-300 shadow-lg hover:shadow-xl" 
              />
            )}

            {/* Shipping Notice */}
            <p className="text-xs text-[rgb(38,19,21)]/60 text-center">
              Complimentary shipping • Delivery in 4-11 weeks
            </p>

            {/* Divider */}
            <div className="border-t border-[rgb(38,19,21)]/10 my-6"></div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed text-[rgb(38,19,21)]/80">
                {product.description}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-[rgb(38,19,21)]/10 my-6"></div>

            {/* Accordion Details */}
            <div className="space-y-3">
              <details className="group border-b border-[rgb(38,19,21)]/10 pb-3">
                <summary className="text-sm font-medium cursor-pointer flex justify-between items-center text-[rgb(38,19,21)] hover:text-[rgb(38,19,21)]/70 transition-colors">
                  In-store services
                  <span className="group-open:rotate-180 transition-transform duration-300 text-xs">▾</span>
                </summary>
                <p className="text-sm mt-3 text-[rgb(38,19,21)]/70 leading-relaxed">
                  Complimentary services available in select stores.
                </p>
              </details>

              <details className="group border-b border-[rgb(38,19,21)]/10 pb-3">
                <summary className="text-sm font-medium cursor-pointer flex justify-between items-center text-[rgb(38,19,21)] hover:text-[rgb(38,19,21)]/70 transition-colors">
                  Complimentary Delivery & Returns
                  <span className="group-open:rotate-180 transition-transform duration-300 text-xs">▾</span>
                </summary>
                <p className="text-sm mt-3 text-[rgb(38,19,21)]/70 leading-relaxed">
                  Free delivery and returns on all orders.
                </p>
              </details>

              <details className="group border-b border-[rgb(38,19,21)]/10 pb-3">
                <summary className="text-sm font-medium cursor-pointer flex justify-between items-center text-[rgb(38,19,21)] hover:text-[rgb(38,19,21)]/70 transition-colors">
                  Gifting
                  <span className="group-open:rotate-180 transition-transform duration-300 text-xs">▾</span>
                </summary>
                <p className="text-sm mt-3 text-[rgb(38,19,21)]/70 leading-relaxed">
                  Complimentary gift wrapping available.
                </p>
              </details>

              {Array.isArray(product.product_details) && product.product_details.length > 0 && (
                <details className="group border-b border-[rgb(38,19,21)]/10 pb-3">
                  <summary className="text-sm font-medium cursor-pointer flex justify-between items-center text-[rgb(38,19,21)] hover:text-[rgb(38,19,21)]/70 transition-colors">
                    Product Details
                    <span className="group-open:rotate-180 transition-transform duration-300 text-xs">▾</span>
                  </summary>
                  <ul className="list-disc ml-5 mt-3 text-sm text-[rgb(38,19,21)]/70 space-y-1">
                    {product.product_details.map((d:string, i:number)=> (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </details>
              )}

              {Array.isArray(product.materials_care) && product.materials_care.length > 0 && (
                <details className="group border-b border-[rgb(38,19,21)]/10 pb-3">
                  <summary className="text-sm font-medium cursor-pointer flex justify-between items-center text-[rgb(38,19,21)] hover:text-[rgb(38,19,21)]/70 transition-colors">
                    Materials & Care
                    <span className="group-open:rotate-180 transition-transform duration-300 text-xs">▾</span>
                  </summary>
                  <ul className="list-disc ml-5 mt-3 text-sm text-[rgb(38,19,21)]/70 space-y-1">
                    {product.materials_care.map((d:string, i:number)=> (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





