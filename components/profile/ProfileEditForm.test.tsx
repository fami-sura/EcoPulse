/**
 * ProfileEditForm Component Tests
 *
 * Story 2.2.1 - User Profile Page Foundation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileEditForm } from './ProfileEditForm';

// Mock dependencies
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      'avatar.change': 'Change photo',
      'avatar.updated': 'Avatar Updated',
      'avatar.updatedDescription': 'Your profile photo has been updated.',
      'avatar.uploadFailed': 'Upload Failed',
      'avatar.tryAgain': 'Try again or use default.',
      'avatar.tooLarge': 'File Too Large',
      'avatar.maxSize': 'Avatar must be less than 2MB.',
      'avatar.hint': 'Click to upload a new photo (max 2MB)',
      bioLabel: 'Bio',
      bioPlaceholder: 'Tell us about yourself...',
      characterCount: `${params?.current || 0}/${params?.max || 200} characters`,
      locationLabel: 'Location',
      locationPlaceholder: 'City, Country',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      cancel: 'Cancel',
      updateSuccess: 'Profile Updated',
      updateSuccessDescription: 'Your profile has been updated successfully.',
      updateFailed: 'Update Failed',
      updateFailedDescription: 'Failed to update profile. Please try again.',
    };
    return translations[key] || key;
  },
}));

const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const mockUploadPhoto = vi.fn();
vi.mock('@/app/actions/uploadPhoto', () => ({
  uploadPhoto: () => mockUploadPhoto(),
}));

const mockUpdateProfile = vi.fn();
vi.mock('@/app/actions/updateProfile', () => ({
  updateProfile: () => mockUpdateProfile(),
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

describe('ProfileEditForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders bio textarea with initial value', () => {
      render(<ProfileEditForm profile={mockProfile} />);

      const bioTextarea = screen.getByPlaceholderText('Tell us about yourself...');
      expect(bioTextarea).toHaveValue('This is my bio');
    });

    it('renders location input with initial value', () => {
      render(<ProfileEditForm profile={mockProfile} />);

      const locationInput = screen.getByPlaceholderText('City, Country');
      expect(locationInput).toHaveValue('Lagos, Nigeria');
    });

    it('renders character counter for bio', () => {
      render(<ProfileEditForm profile={mockProfile} />);

      expect(screen.getByText('14/200 characters')).toBeInTheDocument();
    });

    it('renders save and cancel buttons', () => {
      render(<ProfileEditForm profile={mockProfile} />);

      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('renders avatar upload hint', () => {
      render(<ProfileEditForm profile={mockProfile} />);

      expect(screen.getByText('Click to upload a new photo (max 2MB)')).toBeInTheDocument();
    });
  });

  describe('Bio Character Limit', () => {
    it('shows updated character count when typing', async () => {
      const user = userEvent.setup();
      render(<ProfileEditForm profile={{ ...mockProfile, bio: '' }} />);

      const bioTextarea = screen.getByPlaceholderText('Tell us about yourself...');
      await user.type(bioTextarea, 'Hello world');

      expect(screen.getByText('11/200 characters')).toBeInTheDocument();
    });

    it('enforces 200 character limit by showing max characters in counter', () => {
      // The handleBioChange function enforces the limit - test component has maxLength too
      render(<ProfileEditForm profile={{ ...mockProfile, bio: 'a'.repeat(200) }} />);

      const bioTextarea = screen.getByPlaceholderText('Tell us about yourself...');

      // Textarea should have maxLength attribute
      expect(bioTextarea).toHaveAttribute('maxLength', '200');

      // Character count should show 200/200
      expect(screen.getByText('200/200 characters')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls updateProfile on submit', async () => {
      const user = userEvent.setup();
      mockUpdateProfile.mockResolvedValueOnce({ success: true });
      render(<ProfileEditForm profile={mockProfile} />);

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalled();
      });
    });

    it('shows success toast on successful update', async () => {
      const user = userEvent.setup();
      mockUpdateProfile.mockResolvedValueOnce({ success: true });
      render(<ProfileEditForm profile={mockProfile} />);

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Profile Updated',
          })
        );
      });
    });

    it('redirects to profile page on successful update', async () => {
      const user = userEvent.setup();
      mockUpdateProfile.mockResolvedValueOnce({ success: true });
      render(<ProfileEditForm profile={mockProfile} />);

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/profile');
      });
    });

    it('shows error toast on failed update', async () => {
      const user = userEvent.setup();
      mockUpdateProfile.mockResolvedValueOnce({ success: false, error: 'Update failed' });
      render(<ProfileEditForm profile={mockProfile} />);

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Update Failed',
            variant: 'destructive',
          })
        );
      });
    });
  });

  describe('Cancel Button', () => {
    it('navigates to profile page on cancel', async () => {
      const user = userEvent.setup();
      render(<ProfileEditForm profile={mockProfile} />);

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  describe('Avatar Upload', () => {
    it('has hidden file input for avatar', () => {
      render(<ProfileEditForm profile={mockProfile} />);

      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveClass('hidden');
    });

    it('accepts correct image types', () => {
      render(<ProfileEditForm profile={mockProfile} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput?.accept).toContain('image/jpeg');
      expect(fileInput?.accept).toContain('image/png');
    });
  });

  describe('Loading States', () => {
    it('disables save button while saving', async () => {
      const user = userEvent.setup();
      mockUpdateProfile.mockImplementation(() => new Promise(() => {})); // Never resolves
      render(<ProfileEditForm profile={mockProfile} />);

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
      });
    });

    it('disables cancel button while saving', async () => {
      const user = userEvent.setup();
      mockUpdateProfile.mockImplementation(() => new Promise(() => {})); // Never resolves
      render(<ProfileEditForm profile={mockProfile} />);

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        const cancelButton = screen.getByText('Cancel');
        expect(cancelButton).toBeDisabled();
      });
    });
  });

  describe('Empty Profile Values', () => {
    it('handles null bio gracefully', () => {
      const profileWithNullBio = { ...mockProfile, bio: null };
      render(<ProfileEditForm profile={profileWithNullBio} />);

      const bioTextarea = screen.getByPlaceholderText('Tell us about yourself...');
      expect(bioTextarea).toHaveValue('');
    });

    it('handles null location gracefully', () => {
      const profileWithNullLocation = { ...mockProfile, location: null };
      render(<ProfileEditForm profile={profileWithNullLocation} />);

      const locationInput = screen.getByPlaceholderText('City, Country');
      expect(locationInput).toHaveValue('');
    });

    it('handles null avatar gracefully', () => {
      const profileWithNullAvatar = { ...mockProfile, avatar_url: null };
      render(<ProfileEditForm profile={profileWithNullAvatar} />);

      // Should show initials fallback
      expect(screen.getByText('TE')).toBeInTheDocument();
    });
  });
});
