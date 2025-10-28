import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL as string, import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string)

export default function LoginIsland() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError('Invalid credentials'); return }
    location.href = '/'
  }

  return (
    <>
      <p className="text-zinc-600 mb-6 text-center md:text-left">Sign in to access your account, track orders, and enjoy a personalized shopping experience.</p>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-800">Email</label>
          <input 
            id="email"
            required 
            type="email" 
            placeholder="your@email.com" 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            className="border border-zinc-300 p-3 w-full focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all bg-[#FCFBF9] rounded-lg" 
          />
        </div>
        
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm font-medium text-zinc-800">Password</label>
            <a href="#" className="text-xs text-zinc-600 hover:text-[var(--accent)] transition-colors">Forgot password?</a>
          </div>
          <input 
            id="password"
            required 
            type="password" 
            placeholder="••••••••••" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
            className="border border-zinc-300 p-3 w-full focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all bg-[#FCFBF9] rounded-lg" 
          />
        </div>
        
        {error && <div className="text-red-600 text-sm bg-red-50 p-3 border border-red-100 rounded-lg">{error}</div>}
        
        <button 
          type="submit" 
          className="btn btn-primary mt-2 rounded-lg" 
          disabled={loading}
          style={{ 
            background: 'var(--brand-bg-exact)', 
            letterSpacing: '0.075em', 
            fontWeight: 500,
            padding: '1rem 0'
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        
        <div className="text-center md:text-left mt-4">
          <p className="text-sm text-zinc-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-[var(--accent)] font-medium hover:underline">Create account</a>
          </p>
        </div>
      </form>
    </>
  )
}


