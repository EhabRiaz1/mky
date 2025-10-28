import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL as string, import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string)

type Order = { id: string; email: string | null; total_cents: number; status: string; created_at: string }

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('id, email, total_cents, status, created_at')
        .order('created_at', { ascending: false })
      setOrders((data as Order[]) || [])
      setLoading(false)
    })()
  }, [])

  if (loading) return <div>Loading orders…</div>

  return (
    <div>
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Email</th>
            <th>Status</th>
            <th>Total</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id.slice(0, 8)}</td>
              <td>{o.email ?? '—'}</td>
              <td>{o.status}</td>
              <td>${(o.total_cents / 100).toFixed(2)}</td>
              <td>{new Date(o.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


