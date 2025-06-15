/**
 * User Validation Operations
 * 
 * Handles user existence checks and validation queries.
 */

import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse } from '@/types';

import { apiRequest } from '../error-handling';

/**
 * Check if user exists by email
 */
export async function existsByEmail(email: string): Promise<ApiResponse<boolean>> {
  return apiRequest('users.existsByEmail', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (error) throw error;
    return (data && data.length > 0) ?? false;
  });
} 