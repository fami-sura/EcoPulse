import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMapIssues } from '../getMapIssues';
import { MAP_ISSUE_LIMITS, type MapBounds } from '@/lib/map/constants';

// Mock Supabase server client
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockGte = vi.fn();
const mockLte = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      from: mockFrom,
    })
  ),
}));

describe('getMapIssues Server Action', () => {
  const validBounds: MapBounds = {
    sw_lat: 6.4,
    sw_lng: 3.3,
    ne_lat: 6.6,
    ne_lng: 3.5,
  };

  const mockIssuesData = [
    {
      id: '1',
      lat: 6.5,
      lng: 3.4,
      status: 'pending',
      category: 'waste',
      photos: ['photo1.jpg'],
      created_at: '2024-01-01T00:00:00Z',
      severity: 'medium',
    },
    {
      id: '2',
      lat: 6.52,
      lng: 3.38,
      status: 'verified',
      category: 'drainage',
      photos: [],
      created_at: '2024-01-02T00:00:00Z',
      severity: 'high',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up the chain of mocks
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ gte: mockGte });
    mockGte.mockReturnValueOnce({ lte: mockLte });
    mockLte.mockReturnValueOnce({ gte: mockGte });
    mockGte.mockReturnValueOnce({ lte: mockLte });
    mockLte.mockReturnValueOnce({ order: mockOrder });
    mockOrder.mockReturnValue({ limit: mockLimit });
    mockLimit.mockResolvedValue({ data: mockIssuesData, error: null });
  });

  describe('Successful Queries', () => {
    it('returns success with data when issues are found', async () => {
      const result = await getMapIssues(validBounds);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(2);
        expect(result.data[0].id).toBe('1');
      }
    });

    it('calls Supabase from with issues table', async () => {
      await getMapIssues(validBounds);

      expect(mockFrom).toHaveBeenCalledWith('issues');
    });

    it('selects required fields', async () => {
      await getMapIssues(validBounds);

      expect(mockSelect).toHaveBeenCalledWith(
        'id, lat, lng, status, category, photos, created_at, severity, note, address'
      );
    });

    it('filters by is_flagged = false', async () => {
      await getMapIssues(validBounds);

      expect(mockEq).toHaveBeenCalledWith('is_flagged', false);
    });

    it('uses default mobile limit (50)', async () => {
      await getMapIssues(validBounds);

      expect(mockLimit).toHaveBeenCalledWith(50);
    });

    it('uses provided limit', async () => {
      await getMapIssues(validBounds, 75);

      expect(mockLimit).toHaveBeenCalledWith(75);
    });

    it('caps limit at desktop max (100)', async () => {
      await getMapIssues(validBounds, 200);

      expect(mockLimit).toHaveBeenCalledWith(100);
    });

    it('enforces minimum limit of 1', async () => {
      await getMapIssues(validBounds, -5);

      expect(mockLimit).toHaveBeenCalledWith(1);
    });
  });

  describe('Bounds Validation', () => {
    it('returns error for invalid sw_lat', async () => {
      const invalidBounds = { ...validBounds, sw_lat: 'invalid' as unknown as number };

      const result = await getMapIssues(invalidBounds);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Invalid bounds parameters');
      }
    });

    it('returns error for invalid sw_lng', async () => {
      const invalidBounds = { ...validBounds, sw_lng: undefined as unknown as number };

      const result = await getMapIssues(invalidBounds);

      expect(result.success).toBe(false);
    });

    it('returns error for invalid ne_lat', async () => {
      const invalidBounds = { ...validBounds, ne_lat: null as unknown as number };

      const result = await getMapIssues(invalidBounds);

      expect(result.success).toBe(false);
    });

    it('returns error for invalid ne_lng', async () => {
      const invalidBounds = { ...validBounds, ne_lng: NaN };

      const result = await getMapIssues(invalidBounds);

      expect(result.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('returns error when Supabase query fails', async () => {
      mockLimit.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' },
      });

      const result = await getMapIssues(validBounds);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Unable to load issues. Please try again.');
      }
    });

    it('handles unexpected errors gracefully', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });

      const result = await getMapIssues(validBounds);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Unable to load issues. Please try again.');
      }
    });
  });

  describe('Constants', () => {
    it('exports correct mobile limit', () => {
      expect(MAP_ISSUE_LIMITS.mobile).toBe(50);
    });

    it('exports correct desktop limit', () => {
      expect(MAP_ISSUE_LIMITS.desktop).toBe(100);
    });
  });
});
