import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL as string, import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string)

type Discount = { id: string; code: string; type: 'percentage'|'amount_off'|'free_shipping'; active: boolean; starts_at: string|null; ends_at: string|null }

export default function Promotions() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    code: '', type: 'percentage' as Discount['type'], percentage: 10, amount: 10,
    scope: 'order' as 'order'|'line', stacking: 'exclusive' as 'exclusive'|'stackable',
    active: true, starts_at: '', ends_at: '', min_subtotal: 0,
  })

  const requiresPercentage = useMemo(()=> form.type==='percentage', [form.type])
  const requiresAmount = useMemo(()=> form.type==='amount_off', [form.type])

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('discounts')
        .select('id, code, type, active, starts_at, ends_at')
        .order('created_at', { ascending: false })
      setDiscounts((data as Discount[]) || [])
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="admin-loading">Loading promotions…</div>

  return (
    <div>
      <h2 className="admin-section-title">Promotions & Discounts</h2>
      
      <div className="admin-box">
        <details>
          <summary className="text-lg font-semibold mb-4 cursor-pointer">Create New Promotion</summary>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setCreating(true)
              const payload: any = {
                code: form.code.trim(), type: form.type, scope: form.scope, stacking: form.stacking, active: form.active,
                min_subtotal_cents: form.min_subtotal > 0 ? Math.round(form.min_subtotal * 100) : null,
                starts_at: form.starts_at || null, ends_at: form.ends_at || null,
              }
              if (requiresPercentage) payload.percentage = form.percentage
              if (requiresAmount) payload.amount_cents = Math.round(form.amount * 100)
              const { error } = await supabase.from('discounts').insert(payload)
              setCreating(false)
              if (!error) {
                const { data } = await supabase
                  .from('discounts')
                  .select('id, code, type, active, starts_at, ends_at')
                  .order('created_at', { ascending: false })
                setDiscounts((data as Discount[]) || [])
                setForm({ code: '', type: 'percentage', percentage: 10, amount: 10, scope: 'order', stacking: 'exclusive', active: true, starts_at: '', ends_at: '', min_subtotal: 0 })
              } else {
                alert('Failed to create promotion. Check permissions and input.')
              }
            }}
            style={{ display: 'grid', gap: '1rem', maxWidth: '100%' }}
          >
            <div className="admin-form-group">
              <label className="admin-form-label">Promo Code</label>
              <input 
                className="admin-form-input" 
                value={form.code} 
                onChange={(e)=>setForm({ ...form, code: e.target.value })} 
                required 
                placeholder="e.g. WELCOME20"
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Discount Type</label>
              <select 
                className="admin-form-select" 
                value={form.type} 
                onChange={(e)=>setForm({ ...form, type: e.target.value as any })}
              >
                <option value="percentage">Percentage Off</option>
                <option value="amount_off">Fixed Amount Off</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            
            {requiresPercentage && (
              <div className="admin-form-group">
                <label className="admin-form-label">Discount Percentage (%)</label>
                <input 
                  className="admin-form-input" 
                  type="number" 
                  min={0} 
                  max={100} 
                  step={0.01} 
                  value={form.percentage} 
                  onChange={(e)=>setForm({ ...form, percentage: parseFloat(e.target.value) })} 
                />
              </div>
            )}
            
            {requiresAmount && (
              <div className="admin-form-group">
                <label className="admin-form-label">Discount Amount (USD)</label>
                <input 
                  className="admin-form-input" 
                  type="number" 
                  min={0} 
                  step={0.01} 
                  value={form.amount} 
                  onChange={(e)=>setForm({ ...form, amount: parseFloat(e.target.value) })} 
                />
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Start Date & Time</label>
                <input 
                  className="admin-form-input" 
                  type="datetime-local" 
                  value={form.starts_at} 
                  onChange={(e)=>setForm({ ...form, starts_at: e.target.value })} 
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">End Date & Time</label>
                <input 
                  className="admin-form-input" 
                  type="datetime-local" 
                  value={form.ends_at} 
                  onChange={(e)=>setForm({ ...form, ends_at: e.target.value })} 
                />
              </div>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Minimum Subtotal (USD)</label>
              <input 
                className="admin-form-input" 
                type="number" 
                min={0} 
                step={0.01} 
                value={form.min_subtotal} 
                onChange={(e)=>setForm({ ...form, min_subtotal: parseFloat(e.target.value) })} 
                placeholder="0 = no minimum"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Discount Scope</label>
                <select 
                  className="admin-form-select" 
                  value={form.scope} 
                  onChange={(e)=>setForm({ ...form, scope: e.target.value as any })}
                >
                  <option value="order">Entire Order</option>
                  <option value="line">Line Item</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Stacking Behavior</label>
                <select 
                  className="admin-form-select" 
                  value={form.stacking} 
                  onChange={(e)=>setForm({ ...form, stacking: e.target.value as any })}
                >
                  <option value="exclusive">Exclusive (no stacking)</option>
                  <option value="stackable">Stackable with other discounts</option>
                </select>
              </div>
            </div>
            
            <div className="admin-form-group">
              <label className="flex items-center gap-2" style={{cursor: 'pointer'}}>
                <input 
                  type="checkbox" 
                  checked={form.active} 
                  onChange={(e)=>setForm({ ...form, active: e.target.checked })} 
                /> 
                <span>Promotion is Active</span>
              </label>
            </div>
            
            <div>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={creating}>
                {creating ? 'Creating Promotion...' : 'Create Promotion'}
              </button>
            </div>
          </form>
        </details>
      </div>
      
      <h3 className="admin-section-title" style={{ fontSize: '1.25rem', marginTop: '2rem' }}>Active Promotions</h3>
      <div className="admin-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Promo Code</th>
              <th>Discount Type</th>
              <th>Status</th>
              <th>Valid Period</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length === 0 ? (
              <tr>
                <td colSpan={4} style={{textAlign: 'center', padding: '2rem'}}>
                  No promotions have been created yet
                </td>
              </tr>
            ) : (
              discounts.map((d) => (
                <tr key={d.id}>
                  <td><strong>{d.code}</strong></td>
                  <td>{d.type.replace('_', ' ')}</td>
                  <td>
                    <span className={`status-pill ${d.active ? 'status-completed' : 'status-cancelled'}`}>
                      {d.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {d.starts_at ? new Date(d.starts_at).toLocaleDateString() : '—'} 
                    {' → '} 
                    {d.ends_at ? new Date(d.ends_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


