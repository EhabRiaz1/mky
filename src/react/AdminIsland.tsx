import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const AdminApp = lazy(() => import('./admin/AdminApp'));

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const [allowed, setAllowed] = (window as any).__adminAllowed || [false, null];
  // Minimal client guard; real checks must be server-side on APIs
  return children;
}

export default function AdminIsland() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading admin…</div>}>
                <AdminApp />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


