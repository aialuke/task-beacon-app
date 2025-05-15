
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Initialize Supabase client
// These values would normally be stored in environment variables
// For now, we'll use placeholder values that will be replaced with actual values
// once the Supabase integration is set up
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
