import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function EventPage() {
  const router = useRouter()
  const { id } = router.query
  const [event, setEvent] = useState(null)
  const [user, setUser] = useState(null)
  const [myStatus, setMyStatus] = useState(null)
  const [counts, setCounts] = useState({ Yes: 0, No: 0, Maybe: 0 })
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
    const c = { Yes: 0, No: 0, Maybe: 0 }
    ; (data || []).forEach(r => { c[r.status] = (c[r.status] || 0) + 1 })
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
    const { error } = await supabase.from('rsvps').upsert({ event_id: id, user_id: user.id, status }, { onConflict: ['event_id', 'user_id'] })
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
      <button className="backBtn" onClick={() => router.push('/')}>← Back</button>
      {!event && <p>Loading...</p>}
      {event && (
        <div className="card">
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <p><b>Date:</b> {new Date(event.event_date).toLocaleString()}</p>
          {event.location && <p><b>Location:</b> {event.location}</p>}
          <hr />
          <h3>RSVP</h3>
          <p>Your status: <b>{myStatus ?? 'Not set'}</b></p>
          <div className="rsvpButtons">
            <button className="yesBtn" onClick={() => setRsvp('Yes')}>Yes</button>
            <button className="maybeBtn" onClick={() => setRsvp('Maybe')}>Maybe</button>
            <button className="noBtn" onClick={() => setRsvp('No')}>No</button>
            <button className="deleteBtn" onClick={() => deleteMyRsvp()}>Delete my RSVP</button>
          </div>
          <p>Counts — Yes: {counts.Yes} | Maybe: {counts.Maybe} | No: {counts.No}</p>
          <hr />
          <h4>Recent RSVPs</h4>
          <ul>
            {rsvps.map(r => (<li key={r.id}>{r.user_id} — {r.status}</li>))}
          </ul>
        </div>
      )}

      {/* Scoped CSS */}
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1rem;
          font-family: 'Inter', sans-serif;
          color: #111827;
        }
        .card {
          background: #fff;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }
        p {
          margin: 0.5rem 0;
          line-height: 1.5;
          color: #374151;
        }
        h3, h4 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #111827;
        }
        .backBtn {
          margin-bottom: 1rem;
          background: transparent;
          color: #2563eb;
          border: 1px solid #2563eb;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .backBtn:hover {
          background: #2563eb;
          color: white;
        }
        .rsvpButtons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        button {
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          color: white;
          transition: background 0.2s;
        }
        .yesBtn { background: #16a34a; }
        .yesBtn:hover { background: #15803d; }
        .maybeBtn { background: #f59e0b; }
        .maybeBtn:hover { background: #d97706; }
        .noBtn { background: #dc2626; }
        .noBtn:hover { background: #b91c1c; }
        .deleteBtn { background: #6b7280; }
        .deleteBtn:hover { background: #4b5563; }
        ul {
          list-style: none;
          padding: 0;
        }
        ul li {
          background: #f9fafb;
          margin-bottom: 0.5rem;
          padding: 0.6rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          font-size: 0.95rem;
          color: #374151;
        }
      `}</style>
    </div>
  )
}
