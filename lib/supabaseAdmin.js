// lib/supabaseAdmin.js (server-side)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY  // ❌ DO NOT expose in NEXT_PUBLIC

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
