
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize Supabase client with placeholder values
// In a real application, these would be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Mock functionality for development when Supabase is not properly connected
export const isMockingSupabase = !import.meta.env.VITE_SUPABASE_URL;

if (isMockingSupabase) {
  console.warn(
    '⚠️ Using Supabase placeholder values. To connect to a real Supabase project, please set up the Supabase integration.'
  );
}
