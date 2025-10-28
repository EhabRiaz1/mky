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
      // join via collections view
      const { data } = await supabase
        .from('products')
        .select('id,title,handle,gender,status,collections:collections!inner(id,slug)')
        .eq('collections.id', filterCollection)
        .order('created_at', { ascending: false })
      setProducts((data as any[])?.map(d => ({ id: d.id, title: d.title, handle: d.handle, gender: d.gender, status: d.status })) || [])
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
      const { data: p, error: pErr } = await supabase
        .from('products')
        .insert({ title: title.trim(), handle: handle.trim(), description: description || null, gender, status })
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
      await loadProducts()
    } catch (err:any) {
      setMsg(err.message || 'Failed to create product')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <h2>Catalog</h2>
      <form onSubmit={onCreate} className="grid gap-3" style={{ maxWidth: 680 }}>
        <input required placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="border p-2 rounded" />
        <input required placeholder="Handle (slug)" value={handle} onChange={(e)=>setHandle(e.target.value)} className="border p-2 rounded" />
        <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} className="border p-2 rounded" />
        <div className="grid grid-cols-2 gap-3">
          <select value={gender} onChange={(e)=>setGender(e.target.value as any)} className="border p-2 rounded">
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
          <select value={collectionId} onChange={(e)=>setCollectionId(e.target.value)} className="border p-2 rounded">
            <option value="">Select subcategory</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={status} onChange={(e)=>setStatus(e.target.value as any)} className="border p-2 rounded">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <input placeholder="Sizes (comma-separated)" value={sizes} onChange={(e)=>setSizes(e.target.value)} className="border p-2 rounded" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="flex items-center gap-2">GBP <input type="number" min={0} step={0.01} value={priceGBP} onChange={(e)=>setPriceGBP(parseFloat(e.target.value||'0'))} className="border p-2 rounded w-full" /></label>
          <label className="flex items-center gap-2">EUR <input type="number" min={0} step={0.01} value={priceEUR} onChange={(e)=>setPriceEUR(parseFloat(e.target.value||'0'))} className="border p-2 rounded w-full" /></label>
          <label className="flex items-center gap-2">Qty <input type="number" min={0} step={1} value={quantity} onChange={(e)=>setQuantity(parseInt(e.target.value||'0',10))} className="border p-2 rounded w-full" /></label>
        </div>
        <input type="file" multiple onChange={(e)=>setImages(e.target.files)} />
        <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating…' : 'Create product'}</button>
        {msg && <div className="text-sm" style={{ color: msg.includes('failed') ? 'crimson' : 'green' }}>{msg}</div>}
      </form>

      <hr className="my-6" />
      <div className="flex items-center gap-3 mb-3">
        <select value={filterGender} onChange={(e)=>setFilterGender(e.target.value as any)} className="border p-2 rounded">
          <option value="all">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>
        <select value={filterCollection} onChange={(e)=>setFilterCollection(e.target.value)} className="border p-2 rounded">
          <option value="">All subcategories</option>
          {collections.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      {loadingList ? <div>Loading…</div> : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Handle</th>
              <th>Gender</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}><td>{p.title}</td><td>{p.handle}</td><td>{p.gender}</td><td>{p.status}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}


