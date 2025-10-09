import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rputuujndhlocoitsbxn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwdXR1dWpuZGhsb2NvaXRzYnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTE3MzYsImV4cCI6MjA3MjgyNzczNn0.xQKN_ln7VEGg7VdOT_XxcOSrtrviCejSusRgnMhHfsk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
