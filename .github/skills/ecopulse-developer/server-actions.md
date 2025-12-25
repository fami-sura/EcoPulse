# Server Actions for EcoPulse

Complete guide for implementing Server Actions with standard patterns.

## Standard Response Format

**ALL Server Actions MUST return:**

```typescript
{
  success: boolean
  data?: T
  error?: string
}
```

This standard format enables:

- Consistent error handling across the app
- Type-safe responses with TypeScript
- Easy integration with React Hook Form
- Predictable client-side state management

## Basic Pattern

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function actionName(formData: FormData) {
  // 1. Create Supabase server client
  const supabase = await createClient();

  // 2. Authentication check (if needed)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Authentication required' };
  }

  // 3. Validate input
  const field = formData.get('field') as string;
  if (!field || field.length < 3) {
    return { success: false, error: 'Field must be at least 3 characters' };
  }

  // 4. Perform database operation
  const { data, error } = await supabase
    .from('table')
    .insert({ field, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Database error:', error);
    return { success: false, error: error.message };
  }

  // 5. Revalidate affected paths
  revalidatePath('/path');

  // 6. Return success with data
  return { success: true, data };
}
```

## Real Examples from EcoPulse

### Create Report

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createReport(formData: FormData) {
  const supabase = await createClient();

  // Get user (optional for reports - anonymous allowed)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract and validate fields
  const category = formData.get('category') as string;
  const location = formData.get('location') as string;
  const severity = formData.get('severity') as string;
  const note = formData.get('note') as string;
  const photoUrl = formData.get('photo_url') as string;
  const sessionId = formData.get('session_id') as string;

  // Validation
  if (!category || !['waste', 'drainage'].includes(category)) {
    return { success: false, error: 'Invalid category' };
  }

  if (!location) {
    return { success: false, error: 'Location is required' };
  }

  if (!severity || !['low', 'medium', 'high'].includes(severity)) {
    return { success: false, error: 'Invalid severity' };
  }

  if (!note || note.length < 60) {
    return { success: false, error: 'Note must be at least 60 characters' };
  }

  if (!photoUrl) {
    return { success: false, error: 'Photo is required' };
  }

  // For anonymous: require session_id
  if (!user && !sessionId) {
    return { success: false, error: 'Session ID required for anonymous reports' };
  }

  // Parse location (assuming "lat,lng" format)
  const [lat, lng] = location.split(',').map(Number);
  if (isNaN(lat) || isNaN(lng)) {
    return { success: false, error: 'Invalid location format' };
  }

  // Insert report
  const { data, error } = await supabase
    .from('reports')
    .insert({
      category,
      location: `POINT(${lng} ${lat})`, // PostGIS format
      severity,
      note,
      photo_url: photoUrl,
      user_id: user?.id || null,
      session_id: user ? null : sessionId,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating report:', error);
    return { success: false, error: 'Failed to create report' };
  }

  // Revalidate map and reports pages
  revalidatePath('/');
  revalidatePath('/reports');

  return { success: true, data };
}
```

### Upload Photo (with EXIF Stripping)

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import sharp from 'sharp';

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('photo') as File;

  if (!file) {
    return { success: false, error: 'No photo provided' };
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'File must be an image' };
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: 'File size must be less than 10MB' };
  }

  try {
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Strip EXIF, resize, and compress
    const processedImage = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF (before stripping)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 85,
        mozjpeg: true,
      })
      .withMetadata({
        // Strip ALL metadata for privacy
        exif: {},
        icc: false,
        iptc: false,
        xmp: false,
      })
      .toBuffer();

    // Verify EXIF was stripped
    const metadata = await sharp(processedImage).metadata();
    if (metadata.exif || metadata.iptc || metadata.xmp) {
      console.error('EXIF stripping failed - metadata still present');
      return { success: false, error: 'Photo processing failed - privacy check failed' };
    }

    // Generate unique filename
    const filename = `${Date.now()}-${crypto.randomUUID()}.jpg`;
    const filePath = `reports/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from('photos').upload(filePath, processedImage, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: 'Failed to upload photo' };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('photos').getPublicUrl(filePath);

    return {
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
        size: processedImage.length,
      },
    };
  } catch (error) {
    console.error('Photo processing error:', error);
    return { success: false, error: 'Failed to process photo' };
  }
}
```

### Create Verification

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createVerification(reportId: string, sessionId?: string) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Must be authenticated OR have session_id
  if (!user && !sessionId) {
    return { success: false, error: 'Authentication required' };
  }

  // Fetch report to check self-verification
  const { data: report, error: fetchError } = await supabase
    .from('reports')
    .select('user_id, session_id, verification_count')
    .eq('id', reportId)
    .single();

  if (fetchError) {
    return { success: false, error: 'Report not found' };
  }

  // Block self-verification (by user_id OR session_id)
  if (user && report.user_id === user.id) {
    return { success: false, error: 'Cannot verify your own report' };
  }

  if (!user && sessionId && report.session_id === sessionId) {
    return { success: false, error: 'Cannot verify your own report' };
  }

  // Check for duplicate verification
  const { data: existing } = await supabase
    .from('verifications')
    .select('id')
    .eq('report_id', reportId)
    .eq(user ? 'user_id' : 'session_id', user?.id || sessionId)
    .maybeSingle();

  if (existing) {
    return { success: false, error: 'You have already verified this report' };
  }

  // Create verification
  const { data: verification, error: insertError } = await supabase
    .from('verifications')
    .insert({
      report_id: reportId,
      user_id: user?.id || null,
      session_id: user ? null : sessionId,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Verification insert error:', insertError);
    return { success: false, error: 'Failed to create verification' };
  }

  // Increment verification count
  const newCount = (report.verification_count || 0) + 1;
  const newStatus = newCount >= 2 ? 'verified' : report.status;

  const { error: updateError } = await supabase
    .from('reports')
    .update({
      verification_count: newCount,
      status: newStatus,
    })
    .eq('id', reportId);

  if (updateError) {
    console.error('Count update error:', updateError);
    // Don't fail the whole operation - verification was created
  }

  // Revalidate paths
  revalidatePath(`/reports/${reportId}`);
  revalidatePath('/reports');

  return {
    success: true,
    data: {
      verification,
      newStatus,
      verificationCount: newCount,
    },
  };
}
```

## Revalidation Strategies

### Path-Based Revalidation

```typescript
// Revalidate specific path
revalidatePath('/reports');

// Revalidate dynamic route
revalidatePath(`/reports/${reportId}`);

// Revalidate pattern
revalidatePath('/reports/[id]');

// Revalidate layout (affects all nested pages)
revalidatePath('/reports', 'layout');

// Revalidate page only (default)
revalidatePath('/reports', 'page');
```

### Tag-Based Revalidation

```typescript
// In fetch or Supabase query (if using React cache)
const data = await fetch('...', {
  next: { tags: ['reports'] },
});

// In Server Action
import { revalidateTag } from 'next/cache';

revalidateTag('reports');
```

## Error Handling Patterns

### Validation Errors

```typescript
export async function updateProfile(formData: FormData) {
  const name = formData.get('name') as string;

  // Validation with specific messages
  if (!name) {
    return { success: false, error: 'Name is required' };
  }

  if (name.length < 2) {
    return { success: false, error: 'Name must be at least 2 characters' };
  }

  if (name.length > 50) {
    return { success: false, error: 'Name must be less than 50 characters' };
  }

  // ... continue with operation
}
```

### Database Errors

```typescript
export async function deleteReport(reportId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('reports').delete().eq('id', reportId);

  if (error) {
    // Log full error for debugging
    console.error('Delete error:', error);

    // Return user-friendly message
    if (error.code === '23503') {
      return { success: false, error: 'Cannot delete report with existing verifications' };
    }

    return { success: false, error: 'Failed to delete report' };
  }

  revalidatePath('/reports');
  return { success: true };
}
```

### Permission Errors

```typescript
export async function assignReport(reportId: string, userId: string) {
  const supabase = await createClient();

  // Check if user is org admin
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (!membership || membership.role !== 'admin') {
    return { success: false, error: 'Admin access required' };
  }

  // ... proceed with assignment
}
```

## Client-Side Usage

### With React Hook Form

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { createReport } from '@/app/actions/createReport'
import { useRouter } from 'next/navigation'

export function ReportForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  async function onSubmit(data: any) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string)
    })

    const result = await createReport(formData)

    if (!result.success) {
      alert(result.error)
      return
    }

    // Success - navigate to report detail
    router.push(`/reports/${result.data.id}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  )
}
```

### With useTransition

```typescript
'use client'

import { useTransition } from 'react'
import { deleteReport } from '@/app/actions/deleteReport'

export function DeleteButton({ reportId }: { reportId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Delete this report?')) return

    startTransition(async () => {
      const result = await deleteReport(reportId)

      if (!result.success) {
        alert(result.error)
      }
      // Success - page will revalidate automatically
    })
  }

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
```

## Testing Server Actions

```typescript
import { describe, it, expect, vi } from 'vitest';
import { createReport } from '@/app/actions/createReport';

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({ data: { user: { id: 'user-123' } }, error: null })),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: 'report-123', category: 'waste' },
            error: null,
          })),
        })),
      })),
    })),
  })),
}));

describe('createReport', () => {
  it('should create report with valid data', async () => {
    const formData = new FormData();
    formData.append('category', 'waste');
    formData.append('location', '9.0765,7.3986');
    formData.append('severity', 'medium');
    formData.append('note', 'Large pile of waste blocking the road near the market area');
    formData.append('photo_url', 'https://example.com/photo.jpg');

    const result = await createReport(formData);

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('id');
  });

  it('should fail with short note', async () => {
    const formData = new FormData();
    formData.append('note', 'Short');

    const result = await createReport(formData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('60 characters');
  });
});
```
