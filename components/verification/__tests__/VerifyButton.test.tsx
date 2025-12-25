/**
 * VerifyButton Component Tests
 *
 * Tests for verification button states and logic:
 * - Self-verification blocking (authenticated + session)
 * - 7-day session expiry
 * - Disabled states
 * - Button labels
 *
 * Story 2.1.1 - Verification Button & UI Entry Point
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerifyButton, type VerifiableIssue } from '../VerifyButton';

// Mock the auth store
const mockUser = { id: 'user-123', email: 'test@example.com' };
const mockUseAuthStore = vi.fn();

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

// Mock the VerificationModal
vi.mock('../VerificationModal', () => ({
  VerificationModal: vi.fn(({ isOpen, onClose }) =>
    isOpen ? (
      <div data-testid="verification-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
}));

// Base issue for testing
const createMockIssue = (overrides: Partial<VerifiableIssue> = {}): VerifiableIssue => ({
  id: 'issue-123',
  user_id: 'other-user-456',
  session_id: null,
  status: 'pending',
  verification_count: 0,
  created_at: new Date().toISOString(),
  lat: 6.5244,
  lng: 3.3792,
  category: 'waste',
  photos: ['https://example.com/photo.jpg'],
  ...overrides,
});

describe('VerifyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: authenticated user
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      sessionId: 'session-abc',
    });
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'session-abc'),
        setItem: vi.fn(),
      },
      writable: true,
    });
  });

  describe('Button States', () => {
    it('renders enabled button for pending issues when user can verify', () => {
      const issue = createMockIssue();
      render(<VerifyButton issue={issue} />);

      const button = screen.getByRole('button');
      expect(button).toBeEnabled();
      expect(button).toHaveTextContent('Verify (0/2)');
    });

    it('shows "Verified ✓" when verification count >= 2', () => {
      const issue = createMockIssue({ verification_count: 2 });
      render(<VerifyButton issue={issue} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Verified ✓');
    });

    it('shows correct count label', () => {
      const issue = createMockIssue({ verification_count: 1 });
      render(<VerifyButton issue={issue} />);

      expect(screen.getByRole('button')).toHaveTextContent('Verify (1/2)');
    });
  });

  describe('Self-Verification Blocking', () => {
    it('disables button when user is the authenticated reporter', () => {
      const issue = createMockIssue({ user_id: 'user-123' }); // Same as mockUser.id
      render(<VerifyButton issue={issue} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('title', 'You cannot verify your own report');
    });

    it('disables button when session_id matches (anonymous report)', () => {
      const issue = createMockIssue({
        user_id: null,
        session_id: 'session-abc', // Same as mocked localStorage
      });
      render(<VerifyButton issue={issue} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('allows verification when session_id is expired (>7 days old)', () => {
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

      const issue = createMockIssue({
        user_id: null,
        session_id: 'session-abc',
        created_at: eightDaysAgo.toISOString(),
      });
      render(<VerifyButton issue={issue} />);

      const button = screen.getByRole('button');
      expect(button).toBeEnabled();
    });
  });

  describe('Authentication States', () => {
    it('disables button when user is not authenticated', () => {
      mockUseAuthStore.mockReturnValue({
        user: null,
        sessionId: null,
      });

      const issue = createMockIssue();
      render(<VerifyButton issue={issue} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('title', 'Login to verify');
    });
  });

  describe('Issue Status States', () => {
    it('disables button for verified issues', () => {
      const issue = createMockIssue({ status: 'verified' });
      render(<VerifyButton issue={issue} />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables button for in_progress issues', () => {
      const issue = createMockIssue({ status: 'in_progress' });
      render(<VerifyButton issue={issue} />);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables button for resolved issues', () => {
      const issue = createMockIssue({ status: 'resolved' });
      render(<VerifyButton issue={issue} />);

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Modal Interaction', () => {
    it('opens modal when button is clicked', async () => {
      const user = userEvent.setup();
      const issue = createMockIssue();
      render(<VerifyButton issue={issue} />);

      expect(screen.queryByTestId('verification-modal')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button'));

      expect(screen.getByTestId('verification-modal')).toBeInTheDocument();
    });

    it('does not open modal when button is disabled', async () => {
      const user = userEvent.setup();
      mockUseAuthStore.mockReturnValue({ user: null, sessionId: null });

      const issue = createMockIssue();
      render(<VerifyButton issue={issue} />);

      await user.click(screen.getByRole('button'));

      expect(screen.queryByTestId('verification-modal')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct aria-label for enabled state', () => {
      const issue = createMockIssue();
      render(<VerifyButton issue={issue} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Click to verify this environmental issue'
      );
    });

    it('has correct aria-label for self-verification blocked', () => {
      const issue = createMockIssue({ user_id: 'user-123' });
      render(<VerifyButton issue={issue} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'You cannot verify a report you submitted'
      );
    });

    it('has correct aria-label for unauthenticated users', () => {
      mockUseAuthStore.mockReturnValue({ user: null, sessionId: null });

      const issue = createMockIssue();
      render(<VerifyButton issue={issue} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'You must be logged in to verify this issue'
      );
    });
  });
});
