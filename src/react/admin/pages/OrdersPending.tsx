import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL as string, import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string)

type Order = { id: string; email: string | null; total_cents: number; status: string; created_at: string }

export default function OrdersPending() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('orders')
      .select('id,email,total_cents,status,created_at')
      .eq('status','pending')
      .order('created_at', { ascending: false })
    setOrders((data as Order[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="admin-loading">Loading pending orders…</div>

  return (
    <div>
      <h2 className="admin-section-title">Pending Orders</h2>
      <div className="admin-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>
                  No pending orders at this time
                </td>
              </tr>
            ) : (
              orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id.slice(0,8)}</td>
                  <td>{o.email ?? '—'}</td>
                  <td>${(o.total_cents/100).toFixed(2)}</td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button 
                        className="admin-btn admin-btn-primary" 
                        onClick={async ()=>{ 
                          await supabase.rpc('order_set_status', { p_order_id: o.id, p_status: 'paid' }); 
                          await load(); 
                        }}
                      >
                        Mark Paid
                      </button>
                      <button 
                        className="admin-btn admin-btn-secondary" 
                        onClick={async ()=>{ 
                          await supabase.rpc('order_set_status', { p_order_id: o.id, p_status: 'cancelled' }); 
                          await load(); 
                        }}
                      >
                        Cancel
                      </button>
                    </div>
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


