import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('As chaves do Supabase não foram configuradas no arquivo .env');
}

/**
 * Cliente centralizado do Supabase para o projeto Shockwave.
 * Utiliza Row Level Security (RLS) para garantir a integridade dos dados jurídicos.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
