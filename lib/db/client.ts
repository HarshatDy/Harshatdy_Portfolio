import 'server-only'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables from client.ts')
}
// Server-only Supabase client using service role key.
// Never import this in "use client" components.
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    // Disable Next.js fetch cache for all Supabase queries — without this,
    // Next.js caches the first response and ignores subsequent DB writes.
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
  },
})
