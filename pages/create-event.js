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
      <form onSubmit={submit}>
        <div><input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required /></div>
        <div><textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} /></div>
        <div><label>Date & time:</label><br/><input type="datetime-local" value={eventDate} onChange={e=>setEventDate(e.target.value)} required /></div>
        <div><input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} /></div>
        <div><label><input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} /> Public event</label></div>
        <button type="submit">Create</button>
        <p>{msg}</p>
      </form>
    </div>
  )
}
