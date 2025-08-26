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
        <div className="field">
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="field">
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button type="submit">Sign up</button>
        <p className="msg">{msg}</p>
      </form>

      {/* CSS inside same file */}
      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 80px auto;
          padding: 30px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .field input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }

        .field input:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 0 2px rgba(0,118,255,0.2);
        }

        button {
          padding: 12px;
          background: #0070f3;
          color: #fff;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        button:hover {
          background: #005bb5;
        }

        .msg {
          text-align: center;
          color: #555;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}
