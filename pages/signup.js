import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('Creating account...')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    if (error) { setMsg(error.message); return }
    if (data.user) {
      const { error: insertErr } = await supabase.from('users').insert({ id: data.user.id, name, email }).select()
      if (insertErr) console.warn('Could not insert into users:', insertErr.message)
    }
    if (data.session) {
      setMsg('Account created and logged in!')
      router.push('/')
    } else {
      setMsg('Account created. Please check your email to confirm.')
      router.push('/login')
    }
  }

  return (
    <div className="container">
      <h1>Sign up</h1>
      <form onSubmit={onSubmit}>
        <div><input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        <button type="submit">Sign up</button>
        <p>{msg}</p>
      </form>
    </div>
  )
}
