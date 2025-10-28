import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL as string,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string
)

export default function AuthDrawerIsland({ variant }: { variant?: 'mobile' | 'desktop' }) {
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      const u = data?.user || null
      setUser(u)
      if (u) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, first_name, last_name')
            .eq('id', u.id)
            .single()
          const name =
            (profile as any)?.display_name ||
            [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
            (u as any)?.user_metadata?.full_name ||
            u.email
          setDisplayName((name || '').trim() || null)
        } catch {}
      }
      setLoading(false)
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      active = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    location.reload()
  }

  const textColor = variant === 'desktop' ? 'text-[var(--brand-bg-exact)]' : 'text-[var(--brand-ink-exact)]'
  const subtle = variant === 'desktop' ? 'text-[rgba(38,19,21,0.7)]' : 'text-[rgba(243,231,223,0.8)]'
  const border = variant === 'desktop' ? 'border-[rgba(38,19,21,0.1)]' : 'border-[rgba(243,231,223,0.1)]'

  if (loading) return null

  if (!user) {
    return (
      <div className={`pt-6 border-t ${border}`}>
        <div className={`${subtle} mb-3 text-sm tracking-wider uppercase`} style={{ fontFamily: 'Inter, sans-serif' }}>Account</div>
        <div className="flex items-center gap-4">
          <a href="/login" className={`${textColor} underline-offset-4 hover:underline`} style={{ fontFamily: 'Inter, sans-serif' }}>Sign in</a>
          <a href="/signup" className={`${textColor} underline-offset-4 hover:underline`} style={{ fontFamily: 'Inter, sans-serif' }}>Create account</a>
        </div>
      </div>
    )
  }

  return (
    <div className={`pt-6 border-t ${border}`}>
      <div className={`${subtle} text-sm tracking-wider uppercase mb-1`} style={{ fontFamily: 'Inter, sans-serif' }}>Account</div>
      <div className={`${textColor} mb-3`} style={{ fontFamily: 'Inter, sans-serif' }}>Welcome back, {displayName || 'Friend'}</div>
      <button onClick={signOut} className="btn btn-outline">Sign out</button>
    </div>
  )
}


