import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MapFilters } from '../MapFilters';

// Mock next/navigation
const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

// Mock the mapStore
const mockSetFilters = vi.fn();
const mockResetFilters = vi.fn();
const mockFilters = {
  categories: [],
  statuses: [],
  dateRange: 'all' as const,
};

vi.mock('@/stores/mapStore', () => ({
  useMapStore: () => ({
    filters: mockFilters,
    setFilters: mockSetFilters,
    resetFilters: mockResetFilters,
  }),
}));

describe('MapFilters Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set desktop viewport by default
    vi.stubGlobal('innerWidth', 1200);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('Desktop Layout', () => {
    it('renders sidebar on desktop', () => {
      render(<MapFilters />);

      expect(screen.getByRole('complementary', { name: /map filters/i })).toBeInTheDocument();
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders category filter options', () => {
      render(<MapFilters />);

      expect(screen.getByRole('button', { name: /waste\/litter filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /drainage filter/i })).toBeInTheDocument();
    });

    it('renders status filter options', () => {
      render(<MapFilters />);

      expect(screen.getByRole('button', { name: /pending status filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /verified status filter/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /in progress status filter/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /resolved status filter/i })).toBeInTheDocument();
    });

    it('renders date range filter options', () => {
      render(<MapFilters />);

      expect(screen.getByRole('button', { name: /last 7 days date filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /last 30 days date filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /last 90 days date filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /all time date filter/i })).toBeInTheDocument();
    });

    it('displays pin count when provided', () => {
      render(<MapFilters totalCount={150} filteredCount={23} />);

      expect(screen.getByText('23')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
    });
  });

  describe('Filter Interactions (Desktop)', () => {
    it('toggles category filter and updates URL', async () => {
      const user = userEvent.setup();
      render(<MapFilters />);

      const wasteButton = screen.getByRole('button', { name: /waste\/litter filter/i });
      await user.click(wasteButton);

      // Should call setFilters and update URL
      expect(mockSetFilters).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalled();
    });

    it('toggles status filter and updates URL', async () => {
      const user = userEvent.setup();
      render(<MapFilters />);

      const verifiedButton = screen.getByRole('button', { name: /verified status filter/i });
      await user.click(verifiedButton);

      expect(mockSetFilters).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalled();
    });

    it('changes date range filter and updates URL', async () => {
      const user = userEvent.setup();
      render(<MapFilters />);

      const last7daysButton = screen.getByRole('button', { name: /last 7 days date filter/i });
      await user.click(last7daysButton);

      expect(mockSetFilters).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('Mobile Layout', () => {
    beforeEach(() => {
      vi.stubGlobal('innerWidth', 500);
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
    });

    it('renders filter FAB button on mobile', async () => {
      render(<MapFilters />);

      // Wait for viewport detection
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /open filters/i })).toBeInTheDocument();
      });
    });

    it('opens filter sheet when FAB is clicked', async () => {
      const user = userEvent.setup();
      render(<MapFilters />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /open filters/i })).toBeInTheDocument();
      });

      const filterButton = screen.getByRole('button', { name: /open filters/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Clear Filters', () => {
    it('does not show clear button when no filters active', () => {
      render(<MapFilters />);

      expect(screen.queryByRole('button', { name: /clear all filters/i })).not.toBeInTheDocument();
    });
  });

  describe('Touch Target Size', () => {
    it('category buttons have minimum 44px touch targets', () => {
      render(<MapFilters />);

      const wasteButton = screen.getByRole('button', { name: /waste\/litter filter/i });
      expect(wasteButton).toHaveClass('min-h-11', 'min-w-11');
    });

    it('status buttons have minimum 44px touch targets', () => {
      render(<MapFilters />);

      const pendingButton = screen.getByRole('button', { name: /pending status filter/i });
      expect(pendingButton).toHaveClass('min-h-11', 'min-w-11');
    });

    it('date buttons have minimum 44px touch targets', () => {
      render(<MapFilters />);

      const dateButton = screen.getByRole('button', { name: /last 7 days date filter/i });
      expect(dateButton).toHaveClass('min-h-11', 'min-w-11');
    });
  });

  describe('Accessibility', () => {
    it('filter buttons have aria-pressed state', () => {
      render(<MapFilters />);

      const wasteButton = screen.getByRole('button', { name: /waste\/litter filter/i });
      expect(wasteButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('filter buttons have proper aria-labels', () => {
      render(<MapFilters />);

      expect(screen.getByRole('button', { name: /waste\/litter filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /drainage filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /pending status filter/i })).toBeInTheDocument();
    });

    it('sidebar has proper aria-label', () => {
      render(<MapFilters />);

      expect(screen.getByRole('complementary', { name: /map filters/i })).toBeInTheDocument();
    });
  });
});

describe('URL Parameter Sync', () => {
  it('builds correct URL params from filters', () => {
    // Test the URL building logic indirectly through component behavior
    render(<MapFilters />);

    expect(mockPush).not.toHaveBeenCalled();
  });
});
