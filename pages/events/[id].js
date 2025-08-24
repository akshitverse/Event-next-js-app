import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function EventPage() {
  const router = useRouter()
  const { id } = router.query
  const [event, setEvent] = useState(null)
  const [user, setUser] = useState(null)
  const [myStatus, setMyStatus] = useState(null)
  const [counts, setCounts] = useState({Yes:0,No:0,Maybe:0})
  const [rsvps, setRsvps] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (id) { fetchEvent(); fetchCounts(); fetchMyRsvp(); fetchRsvps() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  async function fetchEvent() {
    const { data } = await supabase.from('events').select('*').eq('id', id).single()
    setEvent(data)
  }

  async function fetchCounts() {
    const { data } = await supabase.from('rsvps').select('status').eq('event_id', id)
    const c = {Yes:0,No:0,Maybe:0}
    ;(data||[]).forEach(r => { c[r.status] = (c[r.status]||0) + 1 })
    setCounts(c)
  }

  async function fetchMyRsvp() {
    if (!user) return setMyStatus(null)
    const { data } = await supabase.from('rsvps').select('status').eq('event_id', id).eq('user_id', user.id).maybeSingle()
    setMyStatus(data?.status ?? null)
  }

  async function fetchRsvps() {
    const { data } = await supabase.from('rsvps').select('id,user_id,status,created_at').eq('event_id', id)
    setRsvps(data || [])
  }

  async function setRsvp(status) {
    if (!user) { alert('Please log in'); return }
    const { error } = await supabase.from('rsvps').upsert({ event_id: id, user_id: user.id, status }, { onConflict: ['event_id','user_id'] })
    if (error) { alert(error.message); return }
    setMyStatus(status)
    fetchCounts()
    fetchRsvps()
  }

  async function deleteMyRsvp() {
    if (!user) { alert('Please log in'); return }
    const { error } = await supabase.from('rsvps').delete().eq('event_id', id).eq('user_id', user.id)
    if (error) { alert(error.message); return }
    setMyStatus(null)
    fetchCounts()
    fetchRsvps()
  }

  return (
    <div className="container">
      <button onClick={() => router.push('/')}>← Back</button>
      {!event && <p>Loading...</p>}
      {event && (
        <div className="card">
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <p><b>Date:</b> {new Date(event.event_date).toLocaleString()}</p>
          {event.location && <p><b>Location:</b> {event.location}</p>}
          <hr/>
          <h3>RSVP</h3>
          <p>Your status: <b>{myStatus ?? 'Not set'}</b></p>
          <div style={{display:'flex',gap:8}}>
            <button onClick={() => setRsvp('Yes')}>Yes</button>
            <button onClick={() => setRsvp('Maybe')}>Maybe</button>
            <button onClick={() => setRsvp('No')}>No</button>
            <button onClick={() => deleteMyRsvp()}>Delete my RSVP</button>
          </div>
          <p>Counts — Yes: {counts.Yes} | Maybe: {counts.Maybe} | No: {counts.No}</p>
          <hr/>
          <h4>Recent RSVPs</h4>
          <ul>
            {rsvps.map(r => (<li key={r.id}>{r.user_id} — {r.status}</li>))}
          </ul>
        </div>
      )}
    </div>
  )
}
