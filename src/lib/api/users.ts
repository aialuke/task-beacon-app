/**
 * Users API - Minimal implementation to resolve missing import
 *
 * This file was created during PHASE 1 to resolve a missing import that was blocking
 * TypeScript safety verification. Full implementation should be added in later phases.
 */

import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse, User, UserQueryOptions } from '@/types';

import { withApiResponse } from './withApiResponse';

/**
 * Get all users with optional query parameters
 * TODO: Implement full functionality in later phases
 */
export async function getAllUsers(
  options: UserQueryOptions = {}
): Promise<ApiResponse<User[]>> {
  return withApiResponse(async () => {
    // Basic implementation to prevent build errors
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(options.pageSize || 50);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  });
}
