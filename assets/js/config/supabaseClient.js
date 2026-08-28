// assets/js/config/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_CONFIG } from './config.js';

if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
  console.error('Supabase configuration is missing or incomplete in config.js');
}

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
