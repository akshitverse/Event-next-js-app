import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('id,title,description,event_date,location,is_public')
      .eq('is_public', true)
      .order('event_date', { ascending: true })
    if (error) console.error(error)
    else setEvents(data || [])
    setLoading(false)
  }

  return (
    <div className="container">
      <h1>Upcoming Events</h1>
      {loading && <p>Loading...</p>}
      {!loading && events.length === 0 && <p>No events yet.</p>}
      <ul style={{listStyle:'none',padding:0}}>
        {events.map(ev => (
          <li key={ev.id} className="card">
            <h2>{ev.title}</h2>
            <p>{ev.description}</p>
            <p><b>Date:</b> {new Date(ev.event_date).toLocaleString()}</p>
            {ev.location && <p><b>Location:</b> {ev.location}</p>}
            <Link href={`/events/${ev.id}`}>View / RSVP</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
