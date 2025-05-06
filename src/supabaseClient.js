import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fjzanliedxngbrpfekqd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqemFubGllZHhuZ2JycGZla3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjkyNTMsImV4cCI6MjA2MjEwNTI1M30.8UkaRU8r90dKY1QEFFNHm2dLfu-erGo61OWnzCBRxB0'

export const supabase = createClient(supabaseUrl, supabaseKey)