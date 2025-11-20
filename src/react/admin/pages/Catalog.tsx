import { useEffect, useMemo, useState } from 'react'
import { getSupabase } from '../../../lib/supabaseClient'

// Acquire client at runtime; may be null if env not configured
const getClient = () => getSupabase()

type Collection = { id: string; slug: string; title: string }
type Product = { 
  id: string; 
  title: string; 
  handle: string; 
  gender: 'men'|'women'; 
  status: string;
  description?: string;
  price_gbp?: number;
  price_eur?: number;
  tags?: string[];
  product_details?: string[];
  materials_care?: string[];
  size_small_qty?: number;
  size_medium_qty?: number;
  size_large_qty?: number;
}
type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  position: number;
}
type ProductVariant = { id: string; product_id: string; sku: string }
type ProductCollection = { id: string; product_id: string; collection_id: string }

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
  const [quantity, setQuantity] = useState('10') // Changed to string
  const [tagsInput, setTagsInput] = useState('')
  const [productDetails, setProductDetails] = useState('')
  const [materialsCare, setMaterialsCare] = useState('')
  const [sizeSmallQty, setSizeSmallQty] = useState(0)
  const [sizeMediumQty, setSizeMediumQty] = useState(0)
  const [sizeLargeQty, setSizeLargeQty] = useState(0)
  const [images, setImages] = useState<FileList | null>(null)
  const [creating, setCreating] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // Edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [productImages, setProductImages] = useState<ProductImage[]>([])
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null)

  // Filters/list
  const [collections, setCollections] = useState<Collection[]>([])
  const [filterGender, setFilterGender] = useState<'all'|'men'|'women'>('all')
  const [filterCollection, setFilterCollection] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [loadingList, setLoadingList] = useState(false)

  // Expanded view state
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)

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
    let q = supabase.from('products').select('id,title,handle,gender,status,description,price_gbp,price_eur,tags,product_details,materials_care,size_small_qty,size_medium_qty,size_large_qty').order('created_at',{ ascending:false })
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
        .select('id,title,handle,gender,status,description,price_gbp,price_eur,tags,product_details,materials_care,size_small_qty,size_medium_qty,size_large_qty')
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
    if (!title && !editingProduct) return
    if (!editingProduct) {
      setHandle(slugify(title))
    }
  }, [title, editingProduct])

  // Load product images
  async function loadProductImages(productId: string): Promise<ProductImage[]> {
    const supabase = getClient()
    if (!supabase) return []
    
    const { data } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('position')
    
    return (data as ProductImage[]) || []
  }

  // Load product data for editing
  async function loadProductForEdit(product: Product) {
    setEditingProduct(product)
    setTitle(product.title)
    setHandle(product.handle)
    setDescription(product.description || '')
    setGender(product.gender)
    setStatus(product.status as 'draft'|'published')
    setPriceGBP(product.price_gbp || 0)
    setPriceEUR(product.price_eur || 0)
    setQuantity('10') // Set default string value for editing
    setTagsInput((product.tags || []).join(', '))
    setProductDetails((product.product_details || []).join('\n'))
    setMaterialsCare((product.materials_care || []).join('\n'))
    setSizeSmallQty(product.size_small_qty || 0)
    setSizeMediumQty(product.size_medium_qty || 0)
    setSizeLargeQty(product.size_large_qty || 0)

    // Load collection
    const supabase = getClient()
    if (supabase) {
      const { data: collectionData } = await supabase
        .from('product_collections')
        .select('collection_id')
        .eq('product_id', product.id)
        .single()

      if (collectionData) {
        setCollectionId((collectionData as ProductCollection).collection_id)
        // Load collection details
        const { data: collection } = await supabase
          .from('collections')
          .select('*')
          .eq('id', (collectionData as ProductCollection).collection_id)
          .single()
        setCurrentCollection(collection as Collection)
      } else {
        setCollectionId('')
        setCurrentCollection(null)
      }
    }

    // Load sizes from variants
    const sizesList = await loadProductSizes(product.id)
    if (sizesList.length > 0) {
      setSizes(sizesList.join(','))
    }

    // Load images
    const images = await loadProductImages(product.id)
    setProductImages(images)
  }

  async function loadProductSizes(productId: string): Promise<string[]> {
    const supabase = getClient()
    if (!supabase) return []
    
    const { data: variants } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
    
    if (!variants || variants.length === 0) return []
    
    const variantIds = variants.map(v => v.id)
    const { data: options } = await supabase
      .from('product_variant_options')
      .select('value')
      .in('variant_id', variantIds)
      .eq('name', 'Size')
    
    return options ? options.map(o => o.value) : []
  }

  async function deleteImage(imageId: string, imageUrl: string) {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    setDeletingImageId(imageId)
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase not configured')

      // Extract file path from URL for storage deletion
      const urlParts = imageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const productId = urlParts[urlParts.length - 2]
      const filePath = `${productId}/${fileName}`

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([filePath])

      if (storageError) {
        console.warn('Failed to delete image from storage:', storageError)
        // Continue with database deletion even if storage deletion fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId)

      if (dbError) throw new Error(dbError.message)

      // Update local state
      setProductImages(prev => prev.filter(img => img.id !== imageId))
      setMsg('Image deleted successfully')
    } catch (err: any) {
      setMsg(err.message || 'Failed to delete image')
    } finally {
      setDeletingImageId(null)
    }
  }

  function cancelEdit() {
    setEditingProduct(null)
    setProductImages([])
    setCurrentCollection(null)
    resetForm()
  }

  function resetForm() {
    setTitle('')
    setHandle('')
    setDescription('')
    setGender('men')
    setStatus('published')
    setCollectionId('')
    setSizes('46,48,50')
    setPriceGBP(650)
    setPriceEUR(720)
    setQuantity('10') // Reset to string
    setTagsInput('')
    setProductDetails('')
    setMaterialsCare('')
    setSizeSmallQty(0)
    setSizeMediumQty(0)
    setSizeLargeQty(0)
    setImages(null)
    setMsg(null)
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    
    if (editingProduct) {
      await onUpdate(e)
      return
    }
    
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
        // Convert quantity string to number for inventory
        const quantityNum = parseInt(quantity) || 0
        await supabase.from('inventory').insert({ variant_id: variantId, quantity: quantityNum, low_stock_threshold: 2 })
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
      resetForm()
      await loadProducts()
    } catch (err:any) {
      setMsg(err.message || 'Failed to create product')
    } finally {
      setCreating(false)
    }
  }

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingProduct) return
    
    setUpdating(true)
    setMsg(null)
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase not configured')
      
      const tags = tagsInput.split(',').map(s=>s.trim()).filter(Boolean)
      const detailsArr = productDetails.split('\n').map(s=>s.trim()).filter(Boolean)
      const materialsArr = materialsCare.split('\n').map(s=>s.trim()).filter(Boolean)

      // Update product
      const { error: updateErr } = await supabase
        .from('products')
        .update({ 
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
        .eq('id', editingProduct.id)

      if (updateErr) throw new Error(updateErr.message)

      // Update collection relationship
      if (collectionId) {
        // Delete existing collection links
        await supabase
          .from('product_collections')
          .delete()
          .eq('product_id', editingProduct.id)
        
        // Add new collection link
        await supabase
          .from('product_collections')
          .insert({ product_id: editingProduct.id, collection_id: collectionId })
      } else {
        // Remove collection if none selected
        await supabase
          .from('product_collections')
          .delete()
          .eq('product_id', editingProduct.id)
      }

      // Update variants and sizes
      await updateProductVariants(editingProduct.id)

      // Upload new images if any
      if (images && images.length > 0) {
        const bucket = 'product-images'
        const currentPosition = productImages.length
        for (let i=0;i<images.length;i++) {
          const file = images[i]
          const path = `${editingProduct.id}/${Date.now()}-${file.name}`
          const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
          if (!upErr) {
            const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path)
            await supabase.from('product_images').insert({ 
              product_id: editingProduct.id, 
              url: pub.publicUrl, 
              alt: title, 
              position: currentPosition + i
            })
          }
        }
        // Reload images
        const updatedImages = await loadProductImages(editingProduct.id)
        setProductImages(updatedImages)
      }

      setMsg('Product updated successfully')
      setEditingProduct(null)
      setProductImages([])
      setCurrentCollection(null)
      resetForm()
      await loadProducts()
    } catch (err: any) {
      setMsg(err.message || 'Failed to update product')
    } finally {
      setUpdating(false)
    }
  }

  async function updateProductVariants(productId: string) {
    const supabase = getClient()
    if (!supabase) return

    // Get current variants
    const { data: currentVariants } = await supabase
      .from('product_variants')
      .select('id, product_variant_options(value)')
      .eq('product_id', productId)

    const currentSizes = currentVariants?.map(v => 
      (v as any).product_variant_options[0]?.value
    ).filter(Boolean) || []

    const newSizes = sizes.split(',').map(s => s.trim()).filter(Boolean)

    // If sizes changed, update variants
    if (JSON.stringify(currentSizes.sort()) !== JSON.stringify(newSizes.sort())) {
      // Delete existing variants and related data
      if (currentVariants && currentVariants.length > 0) {
        const variantIds = currentVariants.map(v => v.id)
        
        await supabase.from('prices').delete().in('variant_id', variantIds)
        await supabase.from('inventory').delete().in('variant_id', variantIds)
        await supabase.from('product_variant_options').delete().in('variant_id', variantIds)
        await supabase.from('product_variants').delete().eq('product_id', productId)
      }

      // Create new variants
      for (const size of newSizes) {
        const { data: v, error: vErr } = await supabase
          .from('product_variants')
          .insert({ 
            product_id: productId, 
            sku: `SKU-${(Math.random()*1e9|0).toString(36).toUpperCase()}`, 
            weight_grams: 800 
          })
          .select('id')
          .single()
        
        if (vErr || !v) throw new Error(vErr?.message || 'variant_update_failed')
        
        const variantId = (v as any).id as string
        await supabase.from('product_variant_options').insert({ 
          variant_id: variantId, 
          name: 'Size', 
          value: size 
        })
        await supabase.from('prices').insert([
          { variant_id: variantId, currency: 'GBP', unit_amount_cents: Math.round(priceGBP*100), tax_inclusive: true },
          { variant_id: variantId, currency: 'EUR', unit_amount_cents: Math.round(priceEUR*100), tax_inclusive: true },
        ])
        // Convert quantity string to number for inventory
        const quantityNum = parseInt(quantity) || 0
        await supabase.from('inventory').insert({ 
          variant_id: variantId, 
          quantity: quantityNum, 
          low_stock_threshold: 2 
        })
      }
    }
  }

  async function onDelete(productId: string) {
    if (!confirm('Are you sure you want to delete this product? This will also delete all associated images, variants, and inventory. This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const supabase = getClient()
      if (!supabase) throw new Error('Supabase not configured')

      // First, get all images to delete from storage
      const { data: images } = await supabase
        .from('product_images')
        .select('url')
        .eq('product_id', productId)

      // Delete images from storage
      if (images && images.length > 0) {
        const filesToDelete = images.map(img => {
          const urlParts = img.url.split('/')
          const fileName = urlParts[urlParts.length - 1]
          const productFolder = urlParts[urlParts.length - 2]
          return `${productFolder}/${fileName}`
        })

        if (filesToDelete.length > 0) {
          await supabase.storage
            .from('product-images')
            .remove(filesToDelete)
        }
      }

      // Delete in correct order to respect foreign key constraints
      // 1. Get variant IDs first
      const { data: variants } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', productId)

      if (variants && variants.length > 0) {
        const variantIds = variants.map(v => v.id)
        
        // Delete prices
        await supabase
          .from('prices')
          .delete()
          .in('variant_id', variantIds)

        // Delete inventory
        await supabase
          .from('inventory')
          .delete()
          .in('variant_id', variantIds)

        // Delete variant options
        await supabase
          .from('product_variant_options')
          .delete()
          .in('variant_id', variantIds)

        // Delete variants
        await supabase
          .from('product_variants')
          .delete()
          .eq('product_id', productId)
      }

      // Delete collection relationships
      await supabase
        .from('product_collections')
        .delete()
        .eq('product_id', productId)

      // Delete images from database
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId)

      // Finally delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw new Error(error.message)

      setMsg('Product deleted successfully')
      if (editingProduct?.id === productId) {
        cancelEdit()
      }
      await loadProducts()
    } catch (err: any) {
      setMsg(err.message || 'Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  function toggleExpandProduct(productId: string) {
    setExpandedProduct(expandedProduct === productId ? null : productId)
  }

  // Truncate text for table display
  function truncateText(text: string, maxLength: number = 50): string {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div>
      <h2 className="admin-section-title">Catalog Management</h2>
      
      <div className="admin-box">
        <h3 className="text-lg font-semibold mb-4">
          {editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Product'}
        </h3>
        
        {/* Current Product Preview */}
        {editingProduct && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-semibold text-lg mb-3">Current Product Data</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Info */}
              <div>
                <h5 className="font-medium mb-2">Basic Information</h5>
                <div className="space-y-1 text-sm">
                  <p><strong>Title:</strong> {editingProduct.title}</p>
                  <p><strong>Handle:</strong> {editingProduct.handle}</p>
                  <p><strong>Gender:</strong> {editingProduct.gender}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      editingProduct.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {editingProduct.status}
                    </span>
                  </p>
                  {currentCollection && (
                    <p><strong>Collection:</strong> {currentCollection.title}</p>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h5 className="font-medium mb-2">Pricing & Inventory</h5>
                <div className="space-y-1 text-sm">
                  <p><strong>Price GBP:</strong> £{editingProduct.price_gbp}</p>
                  <p><strong>Price EUR:</strong> €{editingProduct.price_eur}</p>
                  <p><strong>Size S Qty:</strong> {editingProduct.size_small_qty || 0}</p>
                  <p><strong>Size M Qty:</strong> {editingProduct.size_medium_qty || 0}</p>
                  <p><strong>Size L Qty:</strong> {editingProduct.size_large_qty || 0}</p>
                </div>
              </div>

              {/* Description */}
              {editingProduct.description && (
                <div className="md:col-span-2">
                  <h5 className="font-medium mb-2">Description</h5>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                    {editingProduct.description}
                  </p>
                </div>
              )}

              {/* Product Details */}
              {editingProduct.product_details && editingProduct.product_details.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Product Details</h5>
                  <ul className="text-sm space-y-1 bg-white p-3 rounded border">
                    {editingProduct.product_details.map((detail, index) => (
                      <li key={index}>• {detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Materials & Care */}
              {editingProduct.materials_care && editingProduct.materials_care.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Materials & Care</h5>
                  <ul className="text-sm space-y-1 bg-white p-3 rounded border">
                    {editingProduct.materials_care.map((material, index) => (
                      <li key={index}>• {material}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {editingProduct.tags && editingProduct.tags.length > 0 && (
                <div className="md:col-span-2">
                  <h5 className="font-medium mb-2">Tags</h5>
                  <div className="flex flex-wrap gap-1">
                    {editingProduct.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Images */}
              {productImages.length > 0 && (
                <div className="md:col-span-2">
                  <h5 className="font-medium mb-2">Current Images ({productImages.length})</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {productImages.map((image, index) => (
                      <div key={image.id} className="border rounded-lg overflow-hidden bg-white">
                        <img 
                          src={image.url} 
                          alt={image.alt} 
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2 text-xs text-center text-gray-600">
                          Position: {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                type="text" // Changed from number to text
                placeholder="e.g. 10" 
                value={quantity} 
                onChange={(e)=>setQuantity(e.target.value)} 
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
              accept="image/*"
            />
            {editingProduct && (
              <p className="text-sm text-gray-600 mt-1">
                Select new images to add to existing ones
              </p>
            )}
          </div>

          {/* Existing Images Display with Delete */}
          {editingProduct && productImages.length > 0 && (
            <div className="admin-form-group">
              <label className="admin-form-label">Current Images</label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '1rem',
                marginTop: '0.5rem'
              }}>
                {productImages.map((image, index) => (
                  <div key={image.id} style={{ position: 'relative' }}>
                    <img 
                      src={image.url} 
                      alt={image.alt} 
                      style={{ 
                        width: '100%', 
                        height: '150px', 
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => deleteImage(image.id, image.url)}
                      disabled={deletingImageId === image.id}
                      className="admin-btn admin-btn-danger"
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        padding: '2px 6px',
                        fontSize: '0.75rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)'
                      }}
                    >
                      {deletingImageId === image.id ? '...' : '×'}
                    </button>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      textAlign: 'center', 
                      marginTop: '4px',
                      color: '#6b7280'
                    }}>
                      Position: {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              type="submit" 
              className="admin-btn admin-btn-primary" 
              disabled={creating || updating}
            >
              {editingProduct 
                ? (updating ? 'Updating…' : 'Update Product') 
                : (creating ? 'Creating…' : 'Create Product')
              }
            </button>

            {editingProduct && (
              <button 
                type="button" 
                onClick={cancelEdit}
                className="admin-btn admin-btn-secondary"
                disabled={updating}
              >
                Cancel
              </button>
            )}
            
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
                <th>Description</th>
                <th>Price</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{textAlign: 'center', padding: '2rem'}}>
                    No products match the selected filters
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <>
                    <tr key={p.id}>
                      <td>
                        <div>
                          <div className="font-medium">{p.title}</div>
                          <div className="text-xs text-gray-500">{p.handle}</div>
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs">
                          {p.description ? (
                            <div>
                              <div className="text-sm">{truncateText(p.description, 80)}</div>
                              {p.description.length > 80 && (
                                <button
                                  onClick={() => toggleExpandProduct(p.id)}
                                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                >
                                  {expandedProduct === p.id ? 'Show Less' : 'Show More'}
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No description</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>£{p.price_gbp}</div>
                          <div className="text-gray-500">€{p.price_eur}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs ${
                          p.gender === 'men' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {p.gender}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${p.status === 'published' ? 'status-completed' : 'status-pending'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div className="text-xs space-y-1">
                          {p.tags && p.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {p.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="bg-gray-100 px-1 rounded">
                                  {tag}
                                </span>
                              ))}
                              {p.tags.length > 2 && (
                                <span className="text-gray-500">+{p.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                          <div className="text-gray-500">
                            S: {p.size_small_qty || 0} | M: {p.size_medium_qty || 0} | L: {p.size_large_qty || 0}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => loadProductForEdit(p)}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                            disabled={deleting}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(p.id)}
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                            disabled={deleting}
                          >
                            {deleting ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded Description Row */}
                    {expandedProduct === p.id && p.description && p.description.length > 80 && (
                      <tr>
                        <td colSpan={7} className="bg-gray-50 p-4">
                          <div className="text-sm">
                            <strong>Full Description:</strong>
                            <p className="mt-1 text-gray-700">{p.description}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)+/g,'')
}