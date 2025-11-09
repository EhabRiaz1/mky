import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL as string, import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string)

type Daily = { day: string; orders: number; units: number; gross_revenue_cents: number; refunds_cents: number; net_revenue_cents: number; aov_cents: number }
type Channel = { day: string; utm_source: string; utm_medium: string; orders: number; revenue_cents: number }
type ProductPerf = { product_id: string | null; product_title: string | null; units_sold: number; revenue_cents: number; orders: number }

export default function Analytics() {
  const [daily, setDaily] = useState<Daily[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [topProducts, setTopProducts] = useState<ProductPerf[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10)
      const { data: d } = await supabase.from('kpi_daily_sales').select('*').gte('day', since).order('day', { ascending: true })
      setDaily((d as Daily[]) || [])
      const { data: c } = await supabase.from('kpi_channel_daily').select('*').gte('day', since)
      setChannels((c as Channel[]) || [])
      const { data: p } = await supabase.from('kpi_product_perf').select('*').order('revenue_cents', { ascending: false }).limit(10)
      setTopProducts((p as ProductPerf[]) || [])
      setLoading(false)
    })()
  }, [days])

  const totals = useMemo(() => {
    const t = daily.reduce((acc, d) => {
      acc.orders += d.orders; acc.units += d.units; acc.gross += d.gross_revenue_cents; acc.refunds += d.refunds_cents; acc.net += d.net_revenue_cents; return acc;
    }, { orders: 0, units: 0, gross: 0, refunds: 0, net: 0 }) as any
    const aov = t.orders ? Math.floor(t.gross / t.orders) : 0
    return { ...t, aov }
  }, [daily])

  if (loading) return <div className="admin-loading">Loading analytics…</div>

  const channelAgg = new Map<string, { orders: number; revenue: number }>()
  for (const c of channels) {
    const key = `${c.utm_source} / ${c.utm_medium}`
    const prev = channelAgg.get(key) || { orders: 0, revenue: 0 }
    prev.orders += c.orders; prev.revenue += c.revenue_cents; channelAgg.set(key, prev)
  }

  return (
    <div>
      <h2 className="admin-section-title">Analytics Dashboard</h2>
      <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <label className="admin-form-label" style={{ marginRight: '1rem', marginBottom: 0 }}>Time Range:</label>
        <select 
          className="admin-form-select" 
          value={days} 
          onChange={(e)=>setDays(parseInt(e.target.value,10))}
          style={{ width: 'auto' }}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-title">Revenue (Gross)</div>
          <div className="stat-value">${(totals.gross/100).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Revenue (Net)</div>
          <div className="stat-value">${(totals.net/100).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Orders</div>
          <div className="stat-value">{totals.orders.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Units Sold</div>
          <div className="stat-value">{totals.units.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Average Order Value</div>
          <div className="stat-value">${(totals.aov/100).toLocaleString()}</div>
        </div>
      </div>

      <h3 className="admin-section-title" style={{ fontSize: '1.25rem' }}>Daily Performance</h3>
      <div className="admin-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Orders</th>
              <th>Units</th>
              <th>Gross Revenue</th>
              <th>Refunds</th>
              <th>Net Revenue</th>
              <th>AOV</th>
            </tr>
          </thead>
          <tbody>
            {daily.map(d => (
              <tr key={d.day}>
                <td>{d.day}</td>
                <td>{d.orders}</td>
                <td>{d.units}</td>
                <td>${(d.gross_revenue_cents/100).toLocaleString()}</td>
                <td>${(d.refunds_cents/100).toLocaleString()}</td>
                <td>${(d.net_revenue_cents/100).toLocaleString()}</td>
                <td>${(d.aov_cents/100).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="admin-section-title" style={{ fontSize: '1.25rem' }}>Channels (last {days} days)</h3>
      <div className="admin-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Source / Medium</th>
              <th>Orders</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {[...channelAgg.entries()].sort((a,b)=>b[1].revenue-a[1].revenue).map(([k,v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{v.orders}</td>
                <td>${(v.revenue/100).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="admin-section-title" style={{ fontSize: '1.25rem' }}>Top Performing Products</h3>
      <div className="admin-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Units Sold</th>
              <th>Revenue</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map(p => (
              <tr key={p.product_id || p.product_title || 'unknown'}>
                <td>{p.product_title || 'Unknown'}</td>
                <td>{p.units_sold}</td>
                <td>${(p.revenue_cents/100).toLocaleString()}</td>
                <td>{p.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Keeping this for backward compatibility but it's not used anymore
function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  )
}


