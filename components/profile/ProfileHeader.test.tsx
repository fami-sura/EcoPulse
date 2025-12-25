/**
 * ProfileHeader Component Tests
 *
 * Story 2.2.1 - User Profile Page Foundation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileHeader } from './ProfileHeader';

// Mock dependencies
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      edit: 'Edit Profile',
      'avatar.change': 'Change photo',
      'avatar.updated': 'Avatar Updated',
      'avatar.updatedDescription': 'Your profile photo has been updated.',
      'avatar.uploadFailed': 'Upload Failed',
      'avatar.tryAgain': 'Try again or use default.',
      'avatar.tooLarge': 'File Too Large',
      'avatar.maxSize': 'Avatar must be less than 2MB.',
      memberSince: `Member since ${params?.date || ''}`,
      anonymous: 'Anonymous User',
      noBio: 'No bio yet. Add one to tell others about yourself.',
    };
    return translations[key] || key;
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('@/app/actions/uploadPhoto', () => ({
  uploadPhoto: vi.fn(),
}));

vi.mock('@/app/actions/updateProfile', () => ({
  updateProfile: vi.fn(),
}));

// Mock date-fns format
vi.mock('date-fns', () => ({
  format: vi.fn(() => 'December 2024'),
}));

const mockProfile = {
  id: 'user-123',
  email: 'test@example.com',
  username: 'testuser',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'This is my bio',
  location: 'Lagos, Nigeria',
  role: 'member' as const,
  points: 100,
  anonymous_reports_migrated: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  email_verified_reports: true,
  email_action_cards: true,
  email_monthly_summary: false,
  profile_public: true,
};

describe('ProfileHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders username correctly', () => {
      render(<ProfileHeader profile={mockProfile} isOwnProfile={false} />);

      expect(screen.getByText('@testuser')).toBeInTheDocument();
    });

    it('renders bio when provided', () => {
      render(<ProfileHeader profile={mockProfile} isOwnProfile={false} />);

      expect(screen.getByText('This is my bio')).toBeInTheDocument();
    });

    it('renders location when provided', () => {
      render(<ProfileHeader profile={mockProfile} isOwnProfile={false} />);

      expect(screen.getByText('Lagos, Nigeria')).toBeInTheDocument();
    });

    it('renders member since date', () => {
      render(<ProfileHeader profile={mockProfile} isOwnProfile={false} />);

      expect(screen.getByText('Member since December 2024')).toBeInTheDocument();
    });

    it('renders avatar with correct fallback initials', () => {
      const profileWithoutAvatar = { ...mockProfile, avatar_url: null };
      render(<ProfileHeader profile={profileWithoutAvatar} isOwnProfile={false} />);

      expect(screen.getByText('TE')).toBeInTheDocument();
    });
  });

  describe('Own Profile Features', () => {
    it('shows edit button on own profile', () => {
      render(<ProfileHeader profile={mockProfile} isOwnProfile={true} />);

      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('hides edit button on other profiles', () => {
      render(<ProfileHeader profile={mockProfile} isOwnProfile={false} />);

      expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
    });

    it('shows camera button on own profile for avatar upload', () => {
      render(<ProfileHeader profile={mockProfile} isOwnProfile={true} />);

      expect(screen.getByLabelText('Change photo')).toBeInTheDocument();
    });

    it('hides camera button on other profiles', () => {
      render(<ProfileHeader profile={mockProfile} isOwnProfile={false} />);

      expect(screen.queryByLabelText('Change photo')).not.toBeInTheDocument();
    });

    it('shows no bio message on own profile when bio is empty', () => {
      const profileWithoutBio = { ...mockProfile, bio: null };
      render(<ProfileHeader profile={profileWithoutBio} isOwnProfile={true} />);

      expect(
        screen.getByText('No bio yet. Add one to tell others about yourself.')
      ).toBeInTheDocument();
    });

    it('hides no bio message on other profiles', () => {
      const profileWithoutBio = { ...mockProfile, bio: null };
      render(<ProfileHeader profile={profileWithoutBio} isOwnProfile={false} />);

      expect(
        screen.queryByText('No bio yet. Add one to tell others about yourself.')
      ).not.toBeInTheDocument();
    });
  });

  describe('Avatar Upload', () => {
    it('has hidden file input for avatar upload', () => {
      render(<ProfileHeader profile={mockProfile} isOwnProfile={true} />);

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveClass('hidden');
    });

    it('accepts correct image types', () => {
      render(<ProfileHeader profile={mockProfile} isOwnProfile={true} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput?.accept).toContain('image/jpeg');
      expect(fileInput?.accept).toContain('image/png');
      expect(fileInput?.accept).toContain('image/webp');
      expect(fileInput?.accept).toContain('image/heic');
    });
  });

  describe('Anonymous User Handling', () => {
    it('shows anonymous text when username is null', () => {
      const anonymousProfile = { ...mockProfile, username: null };
      render(<ProfileHeader profile={anonymousProfile} isOwnProfile={false} />);

      expect(screen.getByText('@Anonymous User')).toBeInTheDocument();
    });

    it('shows ? initials when username is null', () => {
      const anonymousProfile = { ...mockProfile, username: null, avatar_url: null };
      render(<ProfileHeader profile={anonymousProfile} isOwnProfile={false} />);

      expect(screen.getByText('?')).toBeInTheDocument();
    });
  });
});
