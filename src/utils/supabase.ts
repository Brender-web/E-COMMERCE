import { createClient } from '@supabase/supabase-js';

// These are dummy valid URLs to prevent initialization crashes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hooqykjkqfqcbxjmnxgq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PEjs5TxaBOPaAFMxF8MP8A_iYt-puQj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);