# Testing Guide

Complete guide for testing EcoPulse with Vitest (unit/component) and Playwright (E2E).

## Testing Philosophy

**Test Pyramid:**

1. **Unit Tests** (70%) - Pure functions, utilities, business logic
2. **Component Tests** (20%) - UI components in isolation
3. **E2E Tests** (10%) - Critical user journeys

**Coverage Goals:**

- **Minimum:** 70% statement coverage
- **Target:** 85% statement coverage
- **Focus:** Business logic, Server Actions, critical UI flows

## Stack

- **Unit/Component:** Vitest + Testing Library + JSDOM
- **E2E:** Playwright (Chromium, Firefox, WebKit)
- **Accessibility:** axe-core (integrated in E2E)
- **Mocking:** Vitest mocks + MSW (future)

## Configuration

### Vitest (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'vitest.setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        '**/.next/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

### Vitest Setup (`vitest.setup.ts`)

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

// Mock window.matchMedia (for responsive hooks)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock crypto.randomUUID (for session IDs)
if (!global.crypto) {
  global.crypto = {} as any;
}
global.crypto.randomUUID = () => '00000000-0000-0000-0000-000000000000';
```

### Playwright (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Start dev server automatically
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## Unit Testing

### Pure Functions (`lib/utils.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';
import { cn, formatDate, truncate } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('px-4', 'py-2', 'bg-primary');
    expect(result).toBe('px-4 py-2 bg-primary');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('btn', isActive && 'active');
    expect(result).toBe('btn active');
  });

  it('should handle Tailwind conflicts', () => {
    const result = cn('px-2', 'px-4'); // px-4 wins
    expect(result).toBe('px-4');
  });
});

describe('formatDate', () => {
  it('should format ISO date to readable string', () => {
    const date = '2024-12-20T10:30:00Z';
    const result = formatDate(date, 'en');
    expect(result).toContain('Dec');
    expect(result).toContain('20');
    expect(result).toContain('2024');
  });
});

describe('truncate', () => {
  it('should truncate long strings', () => {
    const text = 'This is a very long string that should be truncated';
    const result = truncate(text, 20);
    expect(result).toBe('This is a very long...');
  });

  it('should not truncate short strings', () => {
    const text = 'Short text';
    const result = truncate(text, 20);
    expect(result).toBe('Short text');
  });
});
```

### Custom Hooks (`hooks/useGeolocation.test.ts`)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';

describe('useGeolocation', () => {
  it('should request user location', async () => {
    // Mock geolocation API
    const mockGeolocation = {
      getCurrentPosition: vi.fn((success) =>
        success({
          coords: { latitude: 6.5244, longitude: 3.3792 },
        })
      ),
    };
    global.navigator.geolocation = mockGeolocation as any;

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.location).toEqual({
        lat: 6.5244,
        lng: 3.3792,
      });
    });
  });

  it('should handle geolocation error', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn((_, error) => error({ code: 1, message: 'User denied' })),
    };
    global.navigator.geolocation = mockGeolocation as any;

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.error).toBe('User denied geolocation');
    });
  });
});
```

## Component Testing

### UI Components (`components/ui/button.test.tsx`)

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('should handle click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should apply variant styles', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('should meet accessibility requirements', () => {
    render(<Button aria-label="Submit form">Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAccessibleName('Submit form')
  })
})
```

### Form Components (`components/report/CategorySelect.test.tsx`)

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategorySelect } from './CategorySelect'

describe('CategorySelect', () => {
  it('should render all category options', () => {
    render(<CategorySelect value="" onChange={vi.fn()} />)

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('report.categories.waste')).toBeInTheDocument()
    expect(screen.getByText('report.categories.drainage')).toBeInTheDocument()
  })

  it('should call onChange when category selected', async () => {
    const handleChange = vi.fn()
    render(<CategorySelect value="" onChange={handleChange} />)

    const select = screen.getByRole('combobox')
    await userEvent.selectOptions(select, 'waste')

    expect(handleChange).toHaveBeenCalledWith('waste')
  })

  it('should display selected value', () => {
    render(<CategorySelect value="drainage" onChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toHaveValue('drainage')
  })
})
```

### Map Components (`components/map/MapMarker.test.tsx`)

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MapContainer } from 'react-leaflet'
import { MapMarker } from './MapMarker'

// Mock Leaflet
vi.mock('leaflet', () => ({
  icon: vi.fn(() => ({})),
  divIcon: vi.fn(() => ({})),
}))

describe('MapMarker', () => {
  it('should render marker with correct position', () => {
    const report = {
      id: '123',
      location: { lat: 6.5244, lng: 3.3792 },
      status: 'pending',
      category: 'waste',
    }

    const { container } = render(
      <MapContainer center={[6.5244, 3.3792]} zoom={13}>
        <MapMarker report={report} />
      </MapContainer>
    )

    // Verify marker rendered (Leaflet DOM structure)
    expect(container.querySelector('.leaflet-marker-icon')).toBeInTheDocument()
  })
})
```

## Server Actions Testing

### Business Logic (`app/actions/createReport.test.ts`)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createReport } from './createReport';

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: '123',
              status: 'pending',
              verification_count: 0,
            },
            error: null,
          })),
        })),
      })),
    })),
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: 'user-123' } },
      })),
    },
  })),
}));

describe('createReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create report with valid data', async () => {
    const input = {
      photoIds: ['photo-1'],
      location: { lat: 6.5244, lng: 3.3792, label: 'Lagos' },
      category: 'waste',
      note: 'This is a detailed description of the waste issue that meets the 60 character minimum requirement',
    };

    const result = await createReport(input);

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('id');
    expect(result.data?.status).toBe('pending');
  });

  it('should reject report with short note', async () => {
    const input = {
      photoIds: ['photo-1'],
      location: { lat: 6.5244, lng: 3.3792, label: 'Lagos' },
      category: 'waste',
      note: 'Too short',
    };

    const result = await createReport(input);

    expect(result.success).toBe(false);
    expect(result.error).toContain('60 characters');
  });

  it('should reject report with no photos', async () => {
    const input = {
      photoIds: [],
      location: { lat: 6.5244, lng: 3.3792, label: 'Lagos' },
      category: 'waste',
      note: 'This is a detailed description of the waste issue that meets the 60 character minimum requirement',
    };

    const result = await createReport(input);

    expect(result.success).toBe(false);
    expect(result.error).toContain('photo');
  });
});
```

### Verification Logic (`app/actions/createVerification.test.ts`)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { createVerification } from './createVerification';

describe('createVerification', () => {
  it('should block self-verification by user_id', async () => {
    // Mock: User tries to verify their own report
    vi.mock('@/lib/supabase/server', () => ({
      createClient: vi.fn(() => ({
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => ({
                data: { user_id: 'user-123', session_id: null },
              })),
            })),
          })),
        })),
        auth: {
          getUser: vi.fn(() => ({
            data: { user: { id: 'user-123' } },
          })),
        },
      })),
    }));

    const result = await createVerification({ reportId: 'report-123' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot verify your own report');
  });

  it('should block duplicate verification', async () => {
    // Mock: User already verified this report
    vi.mock('@/lib/supabase/server', () => ({
      createClient: vi.fn(() => ({
        from: vi.fn((table) => {
          if (table === 'verifications') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  or: vi.fn(() => ({
                    maybeSingle: vi.fn(() => ({
                      data: { id: 'existing-verification' },
                    })),
                  })),
                })),
              })),
            };
          }
          return {}; // reports table
        }),
      })),
    }));

    const result = await createVerification({ reportId: 'report-123' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Already verified');
  });

  it('should increment verification count', async () => {
    // Mock successful verification
    const mockUpdate = vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { verification_count: 1 },
          })),
        })),
      })),
    }));

    vi.mock('@/lib/supabase/server', () => ({
      createClient: vi.fn(() => ({
        from: vi.fn((table) => {
          if (table === 'reports') {
            return {
              select: vi.fn(() => ({
                eq: vi.fn(() => ({
                  single: vi.fn(() => ({
                    data: {
                      user_id: 'other-user',
                      verification_count: 0,
                    },
                  })),
                })),
              })),
              update: mockUpdate,
            };
          }
          return {}; // verifications table
        }),
      })),
    }));

    const result = await createVerification({ reportId: 'report-123' });

    expect(result.success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith({ verification_count: 1 });
  });
});
```

## E2E Testing

### Homepage (`e2e/homepage.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /ecopulse/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /report issue/i })).toBeVisible();
  });

  test('should navigate to map', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /view map/i }).click();

    await expect(page).toHaveURL(/\/map/);
    await expect(page.locator('.leaflet-container')).toBeVisible();
  });
});
```

### Report Creation Flow (`e2e/create-report.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Report Creation', () => {
  test('should create a report with photo and location', async ({ page }) => {
    await page.goto('/reports/new');

    // Upload photo
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test-image.jpg'));

    // Wait for upload
    await expect(page.getByText(/photo uploaded/i)).toBeVisible();

    // Select category
    await page.getByRole('combobox', { name: /category/i }).selectOption('waste');

    // Enter note
    await page
      .getByRole('textbox', { name: /description/i })
      .fill(
        'This is a detailed description of the waste disposal issue I found in my neighborhood'
      );

    // Mock geolocation
    await page.context().grantPermissions(['geolocation']);
    await page.context().setGeolocation({ latitude: 6.5244, longitude: 3.3792 });

    // Use current location
    await page.getByRole('button', { name: /use current location/i }).click();

    // Wait for geocoding
    await expect(page.getByText(/lagos/i)).toBeVisible();

    // Submit report
    await page.getByRole('button', { name: /submit report/i }).click();

    // Verify success
    await expect(page.getByText(/report submitted/i)).toBeVisible();
    await expect(page).toHaveURL(/\/reports/);
  });

  test('should validate minimum note length', async ({ page }) => {
    await page.goto('/reports/new');

    await page.getByRole('textbox', { name: /description/i }).fill('Too short');
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByText(/60 characters/i)).toBeVisible();
  });

  test('should require at least one photo', async ({ page }) => {
    await page.goto('/reports/new');

    await page.getByRole('combobox', { name: /category/i }).selectOption('waste');
    await page
      .getByRole('textbox', { name: /description/i })
      .fill('Detailed description meeting the minimum character requirement for submission');

    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByText(/photo.*required/i)).toBeVisible();
  });
});
```

### Verification Flow (`e2e/verification.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Verification', () => {
  test('should verify a report', async ({ page }) => {
    // Navigate to report detail
    await page.goto('/issues/123'); // Mock report ID

    // Click verify button
    await page.getByRole('button', { name: /verify/i }).click();

    // Verify success message
    await expect(page.getByText(/thank you for verifying/i)).toBeVisible();

    // Verify count updated
    await expect(page.getByText(/1 verification/i)).toBeVisible();
  });

  test('should prevent self-verification', async ({ page, context }) => {
    // Login as report creator
    // (Mock auth state or use test user)

    await page.goto('/issues/own-report-123');

    // Verify button should be disabled or show message
    const verifyButton = page.getByRole('button', { name: /verify/i });

    if (await verifyButton.isVisible()) {
      await verifyButton.click();
      await expect(page.getByText(/cannot verify your own/i)).toBeVisible();
    } else {
      await expect(page.getByText(/cannot verify your own/i)).toBeVisible();
    }
  });

  test('should prevent duplicate verification', async ({ page }) => {
    await page.goto('/issues/123');

    // First verification
    await page.getByRole('button', { name: /verify/i }).click();
    await expect(page.getByText(/thank you/i)).toBeVisible();

    // Attempt second verification
    await page.reload();
    const verifyButton = page.getByRole('button', { name: /verify/i });

    if (await verifyButton.isVisible()) {
      await verifyButton.click();
      await expect(page.getByText(/already verified/i)).toBeVisible();
    } else {
      await expect(page.getByText(/already verified/i)).toBeVisible();
    }
  });
});
```

### Accessibility Testing (`e2e/accessibility.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should have no accessibility violations on homepage', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have no violations on report form', async ({ page }) => {
    await page.goto('/reports/new');

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAccessibleName();

    // Should be able to activate with Enter
    await page.keyboard.press('Enter');
    // Verify navigation or action occurred
  });

  test('should have proper ARIA labels on icon-only buttons', async ({ page }) => {
    await page.goto('/reports/new');

    const iconButtons = page.locator('button[aria-label]');
    const count = await iconButtons.count();

    for (let i = 0; i < count; i++) {
      const button = iconButtons.nth(i);
      await expect(button).toHaveAttribute('aria-label');

      const label = await button.getAttribute('aria-label');
      expect(label).not.toBe('');
    }
  });
});
```

## Running Tests

### Unit/Component Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# UI mode (interactive)
pnpm test:ui

# Coverage report
pnpm test:coverage

# Run specific test file
pnpm test utils.test.ts

# Run tests matching pattern
pnpm test --grep "Button"
```

### E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# UI mode (interactive debugger)
pnpm test:e2e:ui

# Specific browser
pnpm test:e2e --project=chromium

# Mobile emulation
pnpm test:e2e --project="Mobile Chrome"

# Headed mode (see browser)
pnpm test:e2e --headed

# Debug mode
pnpm test:e2e --debug
```

## CI/CD Integration

### GitHub Actions (`.github/workflows/ci.yml`)

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run linter
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Run unit tests
        run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

      - name: Install Playwright
        run: pnpx playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          CI: true

      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Data & Fixtures

### Mock Data (`e2e/fixtures/mock-data.ts`)

```typescript
export const mockReport = {
  id: 'mock-report-123',
  user_id: 'user-123',
  session_id: null,
  category: 'waste',
  note: 'This is a detailed mock report description for testing purposes',
  location: {
    lat: 6.5244,
    lng: 3.3792,
    label: 'Lagos, Nigeria',
  },
  status: 'pending',
  verification_count: 0,
  is_flagged: false,
  created_at: '2024-12-20T10:00:00Z',
};

export const mockPhoto = {
  id: 'photo-123',
  report_id: 'mock-report-123',
  storage_path: 'mock-photo.jpg',
  display_order: 0,
};

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
};
```

### Test Utilities (`test/utils.tsx`)

```typescript
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '@/messages/en.json'

// Wrapper with providers
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

// Custom render with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-export everything from Testing Library
export * from '@testing-library/react'
```

## Best Practices

### ✅ Do

- Test behavior, not implementation
- Use semantic queries (`getByRole`, `getByLabelText`)
- Mock external dependencies (Supabase, APIs)
- Write descriptive test names
- Group related tests with `describe`
- Test error states and edge cases
- Verify accessibility (ARIA, keyboard nav)
- Keep tests fast (< 1s per test)

### ❌ Don't

- Test Next.js internals
- Use `getByTestId` unless necessary
- Hardcode wait times (`setTimeout`)
- Test Shadcn UI internals (trust the library)
- Duplicate integration tests in E2E
- Skip cleanup after tests
- Commit `.only` or `.skip` to main branch

## Coverage Analysis

```bash
# Generate HTML coverage report
pnpm test:coverage

# Open report
open coverage/index.html

# Check coverage thresholds
npx vitest --coverage --coverage.thresholdAutoUpdate
```

**Coverage Goals:**

- Statements: 85%
- Branches: 80%
- Functions: 85%
- Lines: 85%

## Debugging Tests

### Vitest

```typescript
// Use vi.debug() to inspect values
import { vi } from 'vitest';

it('should debug value', () => {
  const value = { foo: 'bar' };
  vi.debug(value); // Logs to console
  expect(value.foo).toBe('bar');
});
```

### Playwright

```bash
# Debug with Playwright Inspector
pnpm test:e2e --debug

# Use page.pause() in test
test('debug', async ({ page }) => {
  await page.goto('/')
  await page.pause() // Opens inspector
})

# View trace
npx playwright show-trace trace.zip
```

## Summary

**Testing Stack:**

- Vitest for unit/component tests
- Playwright for E2E tests
- axe-core for accessibility checks
- Coverage reports with v8

**Run Commands:**

- `pnpm test` - Unit/component tests
- `pnpm test:e2e` - E2E tests
- `pnpm test:coverage` - Coverage report

**Focus Areas:**

- Business logic (Server Actions)
- Critical user flows (report, verify)
- Accessibility (WCAG 2.1 AA)
- Cross-browser compatibility
