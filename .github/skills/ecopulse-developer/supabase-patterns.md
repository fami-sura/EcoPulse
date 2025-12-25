# Supabase Patterns for EcoPulse

Complete guide for Supabase SSR client usage and RLS policies.

## Client Selection

### Server Components & Server Actions

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
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
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}
```

**When to use:** Server Components, Server Actions, Route Handlers

### Client Components

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**When to use:** Client Components (use client directive), browser-side interactions

### Admin Client (Server-Only)

```typescript
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
```

**When to use:** Server-only operations that bypass RLS (migrations, admin tasks)
**⚠️ WARNING:** NEVER import this in Client Components or expose service role key to client

## Row-Level Security (RLS) Policies

### Reports Table

```sql
-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view non-flagged reports
CREATE POLICY "Reports are viewable by everyone"
  ON reports FOR SELECT
  USING (is_flagged = false);

-- Policy: Authenticated users can create reports
CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Anonymous users can create reports with session_id
CREATE POLICY "Anonymous users can create reports"
  ON reports FOR INSERT
  WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

-- Policy: Users can update their own reports (before verification)
CREATE POLICY "Users can update own reports"
  ON reports FOR UPDATE
  USING (
    auth.uid() = user_id
    OR session_id = current_setting('app.session_id', true)
  )
  WITH CHECK (
    auth.uid() = user_id
    OR session_id = current_setting('app.session_id', true)
  );

-- Policy: Org members can update reports in their org
CREATE POLICY "Org members can update reports"
  ON reports FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );
```

### Verifications Table

```sql
-- Enable RLS
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view verifications
CREATE POLICY "Verifications are viewable by everyone"
  ON verifications FOR SELECT
  USING (true);

-- Policy: Authenticated users can create verifications (self-check in app logic)
CREATE POLICY "Authenticated users can create verifications"
  ON verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Prevent duplicate verifications (enforced via unique constraint)
-- Unique constraint: (report_id, user_id) or (report_id, session_id)
```

### Organizations Table

```sql
-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view organizations
CREATE POLICY "Organizations are viewable by everyone"
  ON organizations FOR SELECT
  USING (true);

-- Policy: Only admins can create/update organizations
CREATE POLICY "Admins can manage organizations"
  ON organizations FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM organization_members
      WHERE role = 'admin'
    )
  );
```

### Organization Members Table

```sql
-- Enable RLS
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Policy: Members can view their organization membership
CREATE POLICY "Members can view own membership"
  ON organization_members FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Admins can manage organization members
CREATE POLICY "Admins can manage members"
  ON organization_members FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

## Common Query Patterns

### Fetch Reports with RLS

```typescript
// Server Component
import { createClient } from '@/lib/supabase/server'

export async function ReportsList() {
  const supabase = await createClient()

  const { data: reports, error } = await supabase
    .from('reports')
    .select(`
      *,
      verifications (count)
    `)
    .eq('is_flagged', false)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching reports:', error)
    return <div>Error loading reports</div>
  }

  return <div>{/* render reports */}</div>
}
```

### Create Report (Server Action)

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createReport(formData: FormData) {
  const supabase = await createClient();

  // Get authenticated user (if any)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Prepare report data
  const reportData = {
    category: formData.get('category'),
    location: formData.get('location'),
    severity: formData.get('severity'),
    note: formData.get('note'),
    photo_url: formData.get('photo_url'),
    user_id: user?.id || null,
    session_id: user ? null : formData.get('session_id'),
    status: 'pending',
  };

  // Insert with RLS
  const { data, error } = await supabase.from('reports').insert(reportData).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/reports');
  return { success: true, data };
}
```

### Update Report Status (Organization Member)

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateReportStatus(reportId: string, status: string) {
  const supabase = await createClient();

  // RLS policy ensures user is org member
  const { data, error } = await supabase
    .from('reports')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', reportId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/reports/${reportId}`);
  revalidatePath('/reports');

  return { success: true, data };
}
```

### Anonymous Session Handling

```typescript
// Client-side: Get or create session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  const SESSION_KEY = 'ecopulse_session_id';
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

// Server Action: Use session ID for anonymous operations
('use server');

export async function createAnonymousReport(formData: FormData, sessionId: string) {
  const supabase = await createClient();

  // Validate session ID format
  if (
    !sessionId ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)
  ) {
    return { success: false, error: 'Invalid session ID' };
  }

  const { data, error } = await supabase
    .from('reports')
    .insert({
      // ... report data
      user_id: null,
      session_id: sessionId,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
```

## Real-time Subscriptions

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function useReportUpdates(reportId: string) {
  const [report, setReport] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch
    supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single()
      .then(({ data }) => setReport(data));

    // Subscribe to changes
    const channel = supabase
      .channel(`report:${reportId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports',
          filter: `id=eq.${reportId}`,
        },
        (payload) => {
          setReport(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reportId]);

  return report;
}
```

## Error Handling

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';

export async function safeQuery<T>(
  queryFn: (supabase: any) => Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await queryFn(supabase);

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data! };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Usage
const result = await safeQuery((supabase) => supabase.from('reports').select('*').limit(10));
```

## Testing with Supabase

```typescript
// Mock Supabase client for tests
import { vi } from 'vitest';

export function createMockSupabaseClient() {
  return {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
          })),
        })),
      })),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  };
}
```
