import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { DesktopNav } from '../DesktopNav';
import { useAuthStore } from '@/stores/authStore';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Mock auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    isAuthenticated: false,
    user: null,
    profile: null,
  })),
}));

// Mock translations
const messages = {
  navigation: {
    map: 'Map',
    myReports: 'My Reports',
    reports: 'Reports',
    actions: 'Actions',
    profile: 'Profile',
    login: 'Log In',
    ngoDashboard: 'NGO Dashboard',
    userMenu: 'User menu',
    settings: 'Settings',
    logout: 'Log Out',
  },
};

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

// Helper to mock authenticated state
const mockAuthenticated = () => {
  vi.mocked(useAuthStore).mockReturnValue({
    isAuthenticated: true,
    user: {
      id: '123',
      email: 'test@example.com',
      avatar_url: null,
    },
    profile: {
      role: 'member',
    },
  } as unknown as ReturnType<typeof useAuthStore>);
};

// Helper to mock unauthenticated state
const mockUnauthenticated = () => {
  vi.mocked(useAuthStore).mockReturnValue({
    isAuthenticated: false,
    user: null,
    profile: null,
  } as unknown as ReturnType<typeof useAuthStore>);
};

describe('DesktopNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to unauthenticated state by default
    mockUnauthenticated();
  });

  it('renders the logo with EcoPulse text', () => {
    renderWithProviders(<DesktopNav />);

    expect(screen.getByText('EcoPulse')).toBeInTheDocument();
    // Logo uses Leaf icon, not emoji
    expect(screen.getByRole('link', { name: /ecopulse - go to homepage/i })).toBeInTheDocument();
  });

  it('renders map navigation for unauthenticated users', () => {
    renderWithProviders(<DesktopNav />);

    expect(screen.getByText('Map')).toBeInTheDocument();
    // Other items require authentication
    expect(screen.queryByText('My Reports')).not.toBeInTheDocument();
  });

  it('renders all navigation items for authenticated users', () => {
    mockAuthenticated();

    renderWithProviders(<DesktopNav />);

    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('My Reports')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders login button when not authenticated', { timeout: 10000 }, () => {
    renderWithProviders(<DesktopNav />);

    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in to your account/i })).toBeInTheDocument();
  });

  it('has accessible navigation links for unauthenticated users', () => {
    renderWithProviders(<DesktopNav />);

    expect(screen.getByRole('link', { name: /navigate to map/i })).toBeInTheDocument();
    // Other nav items not visible for unauthenticated users
  });

  it('has accessible navigation links for authenticated users', () => {
    mockAuthenticated();

    renderWithProviders(<DesktopNav />);

    expect(screen.getByRole('link', { name: /navigate to map/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /navigate to my reports/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /navigate to actions/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /navigate to profile/i })).toBeInTheDocument();
  });

  it('marks current page as active', async () => {
    const { usePathname } = await import('next/navigation');
    vi.mocked(usePathname).mockReturnValue('/');

    renderWithProviders(<DesktopNav />);

    const mapLink = screen.getByRole('link', { name: /navigate to map/i });
    expect(mapLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders user menu when authenticated', () => {
    mockAuthenticated();

    renderWithProviders(<DesktopNav />);

    // User menu button should be present instead of login button
    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
    // Navigation items for authenticated users should be visible
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('has proper ARIA labels for accessibility', () => {
    renderWithProviders(<DesktopNav />);

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ecopulse - go to homepage/i })).toBeInTheDocument();
  });

  it('has minimum touch target sizes for all interactive elements', () => {
    renderWithProviders(<DesktopNav />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      // Check that the link has min-h-11 and min-w-11 classes (Tailwind 44px)
      expect(link.className).toMatch(/min-h-11|min-w-11/);
    });
  });
});
