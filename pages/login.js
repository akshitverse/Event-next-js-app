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
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form onSubmit={onSubmit} className="login-form">
        <div>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required 
            className="login-input"
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required 
            className="login-input"
          />
        </div>
        <button type="submit" className="login-btn">Login</button>
        <p className="login-msg">{msg}</p>
      </form>

      <style jsx>{`
        .login-container {
          max-width: 400px;
          margin: 100px auto;
          padding: 2rem;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .login-title {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .login-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border 0.3s ease, box-shadow 0.3s ease;
        }

        .login-input:focus {
          border-color: #4f46e5;
          outline: none;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }

        .login-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 12px;
          font-size: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .login-btn:hover {
          background: #4338ca;
        }

        .login-msg {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </div>
  )
}
