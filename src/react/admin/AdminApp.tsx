import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Orders from './pages/Orders'
import OrdersPending from './pages/OrdersPending'
import Promotions from './pages/Promotions'
import Analytics from './pages/Analytics'
import Catalog from './pages/Catalog'
import '../../styles/admin.css'

export default function AdminApp() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'orders';
  
  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
      </header>
      <nav className="admin-nav">
        <Link 
          to="catalog" 
          className={`admin-nav-link ${currentPath === 'catalog' ? 'active' : ''}`}
        >
          Catalog
        </Link>
        <Link 
          to="orders" 
          className={`admin-nav-link ${currentPath === 'orders' ? 'active' : ''}`}
        >
          Orders
        </Link>
        <Link 
          to="pending" 
          className={`admin-nav-link ${currentPath === 'pending' ? 'active' : ''}`}
        >
          Pending
        </Link>
        <Link 
          to="promotions" 
          className={`admin-nav-link ${currentPath === 'promotions' ? 'active' : ''}`}
        >
          Promotions
        </Link>
        <Link 
          to="analytics" 
          className={`admin-nav-link ${currentPath === 'analytics' ? 'active' : ''}`}
        >
          Analytics
        </Link>
      </nav>
      <main>
        <Routes>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="orders" element={<Orders />} />
          <Route path="pending" element={<OrdersPending />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="orders" replace />} />
        </Routes>
      </main>
    </div>
  )
}


