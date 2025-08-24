import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function NavBar() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) loadProfile(u.id)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) loadProfile(u?.id)
      if (!u) setProfile(null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function loadProfile(id) {
    if (!id) return
    const { data } = await supabase.from('users').select('id,name,email').eq('id', id).maybeSingle()
    setProfile(data ?? null)
  }

  async function logout() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <nav style={{display:'flex',gap:12,padding:12,borderBottom:'1px solid #eee'}}>
      <Link href="/">Home</Link>
      <Link href="/create-event">Create Event</Link>
      <div style={{marginLeft:'auto'}}>
        {user ? (
          <>
            <span style={{marginRight:8}}>{profile?.name ?? user.email}</span>
            <button onClick={logout}>Logout</button>
            <Link href="/account"><button style={{marginLeft:8}}>Account</button></Link>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link> | <Link href="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
