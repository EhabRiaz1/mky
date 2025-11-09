import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getSupabase } from '../lib/supabaseClient';

const AdminApp = lazy(() => import('./admin/AdminApp'));

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabase();
    if (!supabase) {
      setChecking(false);
      setAllowed(false);
      return;
    }

    async function evaluate() {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      setIsAuthed(!!user);
      if (!user) {
        setAllowed(false);
        setChecking(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (cancelled) return;
      const isAdmin = profile?.role === 'admin';
      setAllowed(!!isAdmin);
      setChecking(false);
    }

    evaluate();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setIsAuthed(!!session?.user);
      if (!session?.user) {
        setAllowed(false);
        return;
      }
      evaluate();
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!checking && !allowed) {
      if (isAuthed) {
        window.location.replace('/');
      } else {
        window.location.replace('/login?redirect=/admin');
      }
    }
  }, [checking, allowed, isAuthed]);

  if (checking) return null;
  if (!allowed) return null;
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


