import { useEffect, useMemo, useState } from 'react'
import { getSupabase } from '../../../lib/supabaseClient'

// Acquire client at runtime; may be null if env not configured
const getClient = () => getSupabase()

type Collection = { id: string; slug: string; title: string }
type Product = { id: string; title: string; handle: string; gender: 'men'|'women'; status: string }

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)+/g,'')
}

export default function Catalog() {
  // Create form
  const [title, setTitle] = useState('')
  const [handle, setHandle] = useState('')
  const [description, setDescription] = useState('')
  const [gender, setGender] = useState<'men'|'women'>('men')
  const [status, setStatus] = useState<'draft'|'published'>('published')
  const [collectionId, setCollectionId] = useState<string>('')
  const [sizes, setSizes] = useState('46,48,50')
  const [priceGBP, setPriceGBP] = useState(650)
  const [priceEUR, setPriceEUR] = useState(720)
  const [quantity, setQuantity] = useState(10)
  const [tagsInput, setTagsInput] = useState('')
  const [productDetails, setProductDetails] = useState('')
  const [materialsCare, setMaterialsCare] = useState('')
  const [sizeSmallQty, setSizeSmallQty] = useState(0)
  const [sizeMediumQty, setSizeMediumQty] = useState(0)
  const [sizeLargeQty, setSizeLargeQty] = useState(0)
  const [images, setImages] = useState<FileList | null>(null)
  const [creating, setCreating] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // Filters/list
  const [collections, setCollections] = useState<Collection[]>([])
  const [filterGender, setFilterGender] = useState<'all'|'men'|'women'>('all')
  const [filterCollection, setFilterCollection] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [loadingList, setLoadingList] = useState(false)

  useEffect(() => {
    ;(async () => {
      const supabase = getClient()
      if (!supabase) return
      const { data } = await supabase.from('collections').select('id,slug,title').order('title')
      setCollections((data as Collection[]) || [])
      await loadProducts()
    })()
  }, [])

  async function loadProducts() {
    setLoadingList(true)
    const supabase = getClient()
    if (!supabase) { setLoadingList(false); return }
    let q = supabase.from('products').select('id,title,handle,gender,status').order('created_at',{ ascending:false })
    if (filterGender !== 'all') q = q.eq('gender', filterGender)
    if (filterCollection) {
      // Step 1: get product IDs for selected collection
      const { data: pc } = await supabase
        .from('product_collections')
        .select('product_id')
        .eq('collection_id', filterCollection)
      const ids = (pc as any[])?.map(r => r.product_id) || []
      if (!ids.length) {
        setProducts([])
        setLoadingList(false)
        return
      }
      // Step 2: fetch products for those IDs, apply gender filter if any
      let q2 = supabase
        .from('products')
        .select('id,title,handle,gender,status')
        .in('id', ids)
        .order('created_at', { ascending: false })
      if (filterGender !== 'all') q2 = q2.eq('gender', filterGender)
      const { data } = await q2
      setProducts((data as any[]) || [])
      setLoadingList(false)
      return
    }
    const { data } = await q
    setProducts((data as Product[]) || [])
    setLoadingList(false)
  }

  useEffect(() => { loadProducts() }, [filterGender, filterCollection])

  useEffect(() => {
    if (!title) return
    setHandle(slugify(title))
  }, [title])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setMsg(null)
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY')
      // 1) Product
      const tags = tagsInput.split(',').map(s=>s.trim()).filter(Boolean)
      const detailsArr = productDetails.split('\n').map(s=>s.trim()).filter(Boolean)
      const materialsArr = materialsCare.split('\n').map(s=>s.trim()).filter(Boolean)

      const { data: p, error: pErr } = await supabase
        .from('products')
        .insert({ 
          title: title.trim(), 
          handle: handle.trim(), 
          description: description || null, 
          gender, 
          status,
          price_gbp: Math.round(priceGBP),
          price_eur: Math.round(priceEUR),
          tags,
          product_details: detailsArr,
          materials_care: materialsArr,
          size_small_qty: sizeSmallQty,
          size_medium_qty: sizeMediumQty,
          size_large_qty: sizeLargeQty
        })
        .select('id')
        .single()
      if (pErr || !p) throw new Error(pErr?.message || 'product_create_failed')
      const productId = (p as any).id as string

      // 2) Link collection
      if (collectionId) {
        await supabase.from('product_collections').insert({ product_id: productId, collection_id: collectionId })
      }

      // 3) Variants by size
      const sizesList = sizes.split(',').map(s=>s.trim()).filter(Boolean)
      for (const s of sizesList) {
        const { data: v, error: vErr } = await supabase
          .from('product_variants')
          .insert({ product_id: productId, sku: `SKU-${(Math.random()*1e9|0).toString(36).toUpperCase()}`, weight_grams: 800 })
          .select('id')
          .single()
        if (vErr || !v) throw new Error(vErr?.message || 'variant_failed')
        const variantId = (v as any).id as string
        await supabase.from('product_variant_options').insert({ variant_id: variantId, name: 'Size', value: s })
        await supabase.from('prices').insert([
          { variant_id: variantId, currency: 'GBP', unit_amount_cents: Math.round(priceGBP*100), tax_inclusive: true },
          { variant_id: variantId, currency: 'EUR', unit_amount_cents: Math.round(priceEUR*100), tax_inclusive: true },
        ])
        await supabase.from('inventory').insert({ variant_id: variantId, quantity, low_stock_threshold: 2 })
      }

      // 4) Upload images
      if (images && images.length > 0) {
        const bucket = 'product-images'
        for (let i=0;i<images.length;i++) {
          const file = images[i]
          const path = `${productId}/${Date.now()}-${file.name}`
          const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
          if (!upErr) {
            const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path)
            await supabase.from('product_images').insert({ product_id: productId, url: pub.publicUrl, alt: title, position: i })
          }
        }
      }

      setMsg('Product created')
      setTitle(''); setHandle(''); setDescription(''); setSizes('46,48,50'); setQuantity(10)
      setTagsInput(''); setProductDetails(''); setMaterialsCare('')
      setSizeSmallQty(0); setSizeMediumQty(0); setSizeLargeQty(0)
      await loadProducts()
    } catch (err:any) {
      setMsg(err.message || 'Failed to create product')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <h2 className="admin-section-title">Catalog Management</h2>
      
      <div className="admin-box">
        <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
        <form onSubmit={onCreate} style={{ display: 'grid', gap: '1rem', maxWidth: '100%' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Product Title</label>
            <input 
              required 
              placeholder="e.g. Men's Wool Blazer" 
              value={title} 
              onChange={(e)=>setTitle(e.target.value)} 
              className="admin-form-input" 
            />
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Handle (URL slug)</label>
            <input 
              required 
              placeholder="mens-wool-blazer" 
              value={handle} 
              onChange={(e)=>setHandle(e.target.value)} 
              className="admin-form-input" 
            />
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea 
              placeholder="Product description..." 
              value={description} 
              onChange={(e)=>setDescription(e.target.value)} 
              className="admin-form-textarea"
              rows={4} 
            />
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Product Details (one per line)</label>
            <textarea 
              placeholder="• Tailored fit\n• Single-breasted\n• Half-canvas construction" 
              value={productDetails} 
              onChange={(e)=>setProductDetails(e.target.value)} 
              className="admin-form-textarea"
              rows={4} 
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Materials & Care (one per line)</label>
            <textarea 
              placeholder="• 100% wool\n• Dry clean only" 
              value={materialsCare} 
              onChange={(e)=>setMaterialsCare(e.target.value)} 
              className="admin-form-textarea"
              rows={3} 
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Tags (comma-separated)</label>
            <input 
              placeholder="e.g. new, limited, bestseller" 
              value={tagsInput} 
              onChange={(e)=>setTagsInput(e.target.value)} 
              className="admin-form-input" 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Size Small (S) qty</label>
              <input 
                type="number" 
                min={0} 
                step={1} 
                value={sizeSmallQty} 
                onChange={(e)=>setSizeSmallQty(parseInt(e.target.value||'0',10))} 
                className="admin-form-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Size Medium (M) qty</label>
              <input 
                type="number" 
                min={0} 
                step={1} 
                value={sizeMediumQty} 
                onChange={(e)=>setSizeMediumQty(parseInt(e.target.value||'0',10))} 
                className="admin-form-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Size Large (L) qty</label>
              <input 
                type="number" 
                min={0} 
                step={1} 
                value={sizeLargeQty} 
                onChange={(e)=>setSizeLargeQty(parseInt(e.target.value||'0',10))} 
                className="admin-form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Gender</label>
              <select 
                value={gender} 
                onChange={(e)=>setGender(e.target.value as any)} 
                className="admin-form-select"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Subcategory</label>
              <select 
                value={collectionId} 
                onChange={(e)=>setCollectionId(e.target.value)} 
                className="admin-form-select"
              >
                <option value="">Select subcategory</option>
                {collections.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Status</label>
              <select 
                value={status} 
                onChange={(e)=>setStatus(e.target.value as any)} 
                className="admin-form-select"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Available Sizes (comma-separated)</label>
              <input 
                placeholder="e.g. 46,48,50" 
                value={sizes} 
                onChange={(e)=>setSizes(e.target.value)} 
                className="admin-form-input" 
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Price GBP (£)</label>
              <input 
                type="number" 
                min={0} 
                step={0.01} 
                value={priceGBP} 
                onChange={(e)=>setPriceGBP(parseFloat(e.target.value||'0'))} 
                className="admin-form-input"
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Price EUR (€)</label>
              <input 
                type="number" 
                min={0} 
                step={0.01} 
                value={priceEUR} 
                onChange={(e)=>setPriceEUR(parseFloat(e.target.value||'0'))} 
                className="admin-form-input"
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Initial Stock Quantity</label>
              <input 
                type="number" 
                min={0} 
                step={1} 
                value={quantity} 
                onChange={(e)=>setQuantity(parseInt(e.target.value||'0',10))} 
                className="admin-form-input"
              />
            </div>
          </div>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Product Images</label>
            <input 
              type="file" 
              multiple 
              onChange={(e)=>setImages(e.target.files)} 
              className="admin-form-input"
              style={{ padding: '0.5rem 0' }}
            />
          </div>
          
          <div>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={creating}>
              {creating ? 'Creating…' : 'Create Product'}
            </button>
            
            {msg && (
              <div 
                style={{ 
                  marginTop: '0.75rem', 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: '4px',
                  backgroundColor: msg.includes('failed') ? 'rgba(255, 69, 58, 0.1)' : 'rgba(52, 199, 89, 0.1)',
                  color: msg.includes('failed') ? 'rgb(215, 0, 21)' : 'rgb(30, 132, 73)',
                  fontSize: '0.875rem'
                }}
              >
                {msg}
              </div>
            )}
          </div>
        </form>
      </div>

      <h3 className="admin-section-title" style={{ fontSize: '1.25rem', marginTop: '2rem' }}>Product Catalog</h3>
      
      <div className="admin-form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <select 
          value={filterGender} 
          onChange={(e)=>setFilterGender(e.target.value as any)} 
          className="admin-form-select"
          style={{ width: 'auto' }}
        >
          <option value="all">All Genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>
        
        <select 
          value={filterCollection} 
          onChange={(e)=>setFilterCollection(e.target.value)} 
          className="admin-form-select"
          style={{ width: 'auto' }}
        >
          <option value="">All Subcategories</option>
          {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      
      <div className="admin-box">
        {loadingList ? (
          <div className="admin-loading">Loading product catalog…</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Title</th>
                <th>Handle</th>
                <th>Gender</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{textAlign: 'center', padding: '2rem'}}>
                    No products match the selected filters
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{p.handle}</td>
                    <td>{p.gender}</td>
                    <td>
                      <span className={`status-pill ${p.status === 'published' ? 'status-completed' : 'status-pending'}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}


