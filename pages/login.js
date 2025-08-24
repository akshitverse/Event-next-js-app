import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('Signing in...')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMsg(error.message); return }
    setMsg('Signed in.')
    router.push('/')
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        <button type="submit">Login</button>
        <p>{msg}</p>
      </form>
    </div>
  )
}
