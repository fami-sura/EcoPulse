/**
 * Supabase Server Client
 *
 * Use this in Server Components and Server Actions.
 * This client handles cookie-based auth sessions with Next.js 16 async patterns.
 *
 * @example
 * // In Server Component
 * import { createClient } from '@/lib/supabase/server';
 *
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('issues').select('*');
 * }
 *
 * @example
 * // In Server Action
 * 'use server';
 * import { createClient } from '@/lib/supabase/server';
 *
 * export async function createIssue(formData: FormData) {
 *   const supabase = await createClient();
 *   // ...
 * }
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  // Next.js 16: cookies() is async
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from Server Components.
            // This can be ignored if middleware refreshes sessions.
          }
        },
      },
    }
  );
}
