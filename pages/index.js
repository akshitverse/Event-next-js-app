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
      <ul>
        {events.map(ev => (
          <li key={ev.id} className="card">
            <h2>{ev.title}</h2>
            <p>{ev.description}</p>
            <p><b>Date:</b> {new Date(ev.event_date).toLocaleString()}</p>
            {ev.location && <p><b>Location:</b> {ev.location}</p>}
            <Link href={`/events/${ev.id}`} className="btn">View / RSVP</Link>
          </li>
        ))}
      </ul>

      {/* CSS inside same file */}
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        .card {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          padding: 20px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        h2 {
          margin: 0 0 10px;
          color: #2c3e50;
        }

        p {
          margin: 6px 0;
          color: #555;
        }

        .btn {
          display: inline-block;
          margin-top: 10px;
          padding: 8px 14px;
          background: #0070f3;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .btn:hover {
          background: #005bb5;
        }
      `}</style>
    </div>
  )
}
