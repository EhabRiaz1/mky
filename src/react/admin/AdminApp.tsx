import { Link, Routes, Route, Navigate } from 'react-router-dom'
import Orders from './pages/Orders'
import OrdersPending from './pages/OrdersPending'
import Promotions from './pages/Promotions'
import Analytics from './pages/Analytics'
import Catalog from './pages/Catalog'

export default function AdminApp() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="catalog">Catalog</Link>
        <Link to="orders">Orders</Link>
        <Link to="pending">Pending</Link>
        <Link to="promotions">Promotions</Link>
        <Link to="analytics">Analytics</Link>
      </nav>
      <Routes>
        <Route index element={<Navigate to="orders" replace />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="orders" element={<Orders />} />
        <Route path="pending" element={<OrdersPending />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="orders" replace />} />
      </Routes>
    </div>
  )
}


