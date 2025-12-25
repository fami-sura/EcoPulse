/**
 * Supabase Admin Client
 *
 * Use this for server-side operations that need to bypass RLS.
 * Only use in trusted server environments (Server Actions, API Routes).
 *
 * SECURITY: Never expose the service role key to the client.
 *
 * @example
 * import { createAdminClient } from '@/lib/supabase/admin';
 *
 * export async function grantPoints(userId: string, amount: number) {
 *   const supabase = createAdminClient();
 *   await supabase.from('points_history').insert({ user_id: userId, amount });
 * }
 */

import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. ' +
        'Get it from Supabase Dashboard > Settings > API > service_role key'
    );
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
