import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xbarfporikkcrfwyoieo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiYXJmcG9yaWtrY3Jmd3lvaWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzQzNjgsImV4cCI6MjA4MDY1MDM2OH0.uiK10mSQppUTztdzKqZUpipbnZo67RRyq_UVEJwlSuQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
