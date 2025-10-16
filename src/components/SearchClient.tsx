import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';

export default function SearchClient() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const id = setTimeout(async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      if (!q) { setResults([]); return; }
      const { data } = await supabase
        .from('products')
        .select('id,title,handle')
        .ilike('title', `%${q}%`)
        .limit(20);
      setResults(data || []);
    }, 250);
    return () => clearTimeout(id);
  }, [q]);

  return (
    <div>
      <input className="border p-2 rounded w-full" placeholder="Search products" value={q} onChange={(e)=>setQ(e.target.value)} />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((r)=> (
          <a key={r.id} href={`/product?handle=${encodeURIComponent(r.handle)}`} className="block border p-3 rounded hover:shadow-sm">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-neutral-600">{r.handle}</div>
          </a>
        ))}
      </div>
    </div>
  );
}





