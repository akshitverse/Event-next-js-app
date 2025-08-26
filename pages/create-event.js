import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function CreateEvent() {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  async function submit(e) {
    e.preventDefault()
    if (!user) { setMsg('Please log in'); return }
    if (!title || !eventDate) { setMsg('Title and date required'); return }
    const { data, error } = await supabase.from('events').insert({
      user_id: user.id,
      title,
      description,
      event_date: new Date(eventDate).toISOString(),
      location,
      is_public: isPublic
    }).select('id').single()
    if (error) { setMsg(error.message); return }
    router.push(`/events/${data.id}`)
  }

  return (
    <div className="container">
      <h1>Create Event</h1>
      <form onSubmit={submit} className="form">
        <div className="formGroup">
          <input 
            className="input"
            placeholder="Title" 
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="formGroup">
          <textarea 
            className="textarea"
            placeholder="Description" 
            value={description} 
            onChange={e=>setDescription(e.target.value)} 
          />
        </div>
        <div className="formGroup">
          <label>Date & time:</label>
          <input 
            type="datetime-local" 
            className="input" 
            value={eventDate} 
            onChange={e=>setEventDate(e.target.value)} 
            required 
          />
        </div>
        <div className="formGroup">
          <input 
            className="input"
            placeholder="Location" 
            value={location} 
            onChange={e=>setLocation(e.target.value)} 
          />
        </div>
        <div className="formGroup checkbox">
          <label>
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={e=>setIsPublic(e.target.checked)} 
            /> Public event
          </label>
        </div>
        <button type="submit" className="btn">Create</button>
        {msg && <p className="msg">{msg}</p>}
      </form>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 4px 8px rgba(0,0,0,0.08);
          font-family: 'Inter', sans-serif;
        }
        h1 {
          text-align: center;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #111827;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .formGroup {
          display: flex;
          flex-direction: column;
        }
        label {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #374151;
        }
        .input, .textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .input:focus, .textarea:focus {
          border-color: #2563eb;
          outline: none;
        }
        .textarea {
          min-height: 100px;
          resize: vertical;
        }
        .checkbox {
          display: flex;
          align-items: center;
        }
        .checkbox input {
          margin-right: 0.5rem;
        }
        .btn {
          background: #2563eb;
          color: white;
          font-weight: 600;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn:hover {
          background: #1e40af;
        }
        .msg {
          margin-top: 1rem;
          font-weight: 500;
          color: #dc2626;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
