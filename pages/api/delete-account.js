// pages/api/delete-account.js
import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get access token from Authorization header
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Missing authorization header' })

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Missing token' })

  try {
    // Get the user from Supabase using the token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError) return res.status(401).json({ error: 'Invalid token' })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const userId = user.id

    // Delete user from auth.users (this cascades to public.users if FK and RLS set up)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (deleteError) return res.status(500).json({ error: deleteError.message })

    return res.status(200).json({ message: 'User account deleted successfully' })
  } catch (err) {
    console.error('Delete account error:', err)
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}
