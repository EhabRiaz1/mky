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

  if (loading) return <div>Loading promotions…</div>

  return (
    <div>
      <h2>Promotions</h2>
      <details style={{ margin: '12px 0' }}>
        <summary>Create Promotion</summary>
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
          style={{ display: 'grid', gap: 8, maxWidth: 420, marginTop: 12 }}
        >
          <label>Code <input value={form.code} onChange={(e)=>setForm({ ...form, code: e.target.value })} required /></label>
          <label>Type
            <select value={form.type} onChange={(e)=>setForm({ ...form, type: e.target.value as any })}>
              <option value="percentage">percentage</option>
              <option value="amount_off">amount_off</option>
              <option value="free_shipping">free_shipping</option>
            </select>
          </label>
          {requiresPercentage && (<label>Percentage (%) <input type="number" min={0} max={100} step={0.01} value={form.percentage} onChange={(e)=>setForm({ ...form, percentage: parseFloat(e.target.value) })} /></label>)}
          {requiresAmount && (<label>Amount (USD) <input type="number" min={0} step={0.01} value={form.amount} onChange={(e)=>setForm({ ...form, amount: parseFloat(e.target.value) })} /></label>)}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <label>Starts at <input type="datetime-local" value={form.starts_at} onChange={(e)=>setForm({ ...form, starts_at: e.target.value })} /></label>
            <label>Ends at <input type="datetime-local" value={form.ends_at} onChange={(e)=>setForm({ ...form, ends_at: e.target.value })} /></label>
          </div>
          <label>Min subtotal (USD) <input type="number" min={0} step={0.01} value={form.min_subtotal} onChange={(e)=>setForm({ ...form, min_subtotal: parseFloat(e.target.value) })} /></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <label>Scope
              <select value={form.scope} onChange={(e)=>setForm({ ...form, scope: e.target.value as any })}>
                <option value="order">order</option>
                <option value="line">line</option>
              </select>
            </label>
            <label>Stacking
              <select value={form.stacking} onChange={(e)=>setForm({ ...form, stacking: e.target.value as any })}>
                <option value="exclusive">exclusive</option>
                <option value="stackable">stackable</option>
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e)=>setForm({ ...form, active: e.target.checked })} /> Active</label>
          <button type="submit" disabled={creating}>Create</button>
        </form>
      </details>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Active</th>
            <th>Window</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d) => (
            <tr key={d.id}>
              <td>{d.code}</td>
              <td>{d.type}</td>
              <td>{d.active ? 'Yes' : 'No'}</td>
              <td>{d.starts_at || '—'} → {d.ends_at || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


