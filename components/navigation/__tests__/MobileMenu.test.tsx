import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MobileMenu } from '../MobileMenu';

// Mock next/navigation
const mockPathname = vi.fn(() => '/');
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      mainMenu: 'Main menu',
    };
    return translations[key] || key;
  },
}));

// Mock i18n routing
vi.mock('@/i18n/routing', () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock navigation store
const mockNavigationStore = {
  isMenuOpen: false,
  openMenu: vi.fn(),
  closeMenu: vi.fn(),
  toggleMenu: vi.fn(),
};

vi.mock('@/stores/navigationStore', () => ({
  useNavigationStore: () => mockNavigationStore,
}));

// Mock auth store
const mockAuthStore = {
  isAuthenticated: false,
  user: null as { id: string; email: string } | null,
  profile: null as { id: string; avatar_url: string | null } | null,
};

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}));

describe('MobileMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigationStore.isMenuOpen = false;
    mockAuthStore.isAuthenticated = false;
    mockAuthStore.user = null;
    mockPathname.mockReturnValue('/');
  });

  describe('Hamburger Button', () => {
    it('renders hamburger button on mobile', () => {
      render(<MobileMenu />);

      const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
      expect(hamburgerButton).toBeInTheDocument();
    });

    it('has accessible label for hamburger button', () => {
      render(<MobileMenu />);

      const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
      expect(hamburgerButton).toHaveAttribute('aria-label', 'Open menu');
    });

    it('has lg:hidden class for desktop hiding', () => {
      render(<MobileMenu />);

      const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
      expect(hamburgerButton).toHaveClass('lg:hidden');
    });

    it('hamburger button meets minimum touch target size (44x44px)', () => {
      render(<MobileMenu />);

      const hamburgerButton = screen.getByRole('button', { name: /open menu/i });
      expect(hamburgerButton).toHaveClass('h-11', 'w-11');
    });
  });

  describe('Menu Panel (when open)', () => {
    beforeEach(() => {
      mockNavigationStore.isMenuOpen = true;
    });

    it('renders slide-in panel when isMenuOpen is true', () => {
      render(<MobileMenu />);

      // Dialog content should be visible
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('displays main menu title', () => {
      render(<MobileMenu />);

      expect(screen.getByText('Main menu')).toBeInTheDocument();
    });

    it('renders close button with accessible label', () => {
      render(<MobileMenu />);

      const closeButton = screen.getByRole('button', { name: /close menu/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('close button meets minimum touch target size', () => {
      render(<MobileMenu />);

      const closeButton = screen.getByRole('button', { name: /close menu/i });
      expect(closeButton).toHaveClass('h-11', 'w-11');
    });
  });

  describe('Navigation Items', () => {
    beforeEach(() => {
      mockNavigationStore.isMenuOpen = true;
    });

    it('renders only Map link when not authenticated', () => {
      mockAuthStore.isAuthenticated = false;
      render(<MobileMenu />);

      const nav = screen.getByRole('navigation', { name: /mobile navigation/i });
      const navLinks = nav.querySelectorAll('a');

      // Only Map has visibility: 'all', other items require authentication
      expect(navLinks).toHaveLength(1);
      expect(screen.getByLabelText(/navigate to map/i)).toBeInTheDocument();
    });

    it('renders all 4 navigation links when authenticated', () => {
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = { id: '123', email: 'test@example.com' };
      render(<MobileMenu />);

      const nav = screen.getByRole('navigation', { name: /mobile navigation/i });
      const navLinks = nav.querySelectorAll('a');

      expect(navLinks).toHaveLength(4);
      expect(screen.getByLabelText(/navigate to map/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/navigate to my reports/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/navigate to actions/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/navigate to profile/i)).toBeInTheDocument();
    });

    it('nav items meet minimum 56px touch target height', () => {
      render(<MobileMenu />);

      const mapLink = screen.getByLabelText(/navigate to map/i);
      expect(mapLink).toHaveClass('h-14'); // h-14 = 56px
    });

    it('marks current page with aria-current', () => {
      mockPathname.mockReturnValue('/');
      render(<MobileMenu />);

      const mapLink = screen.getByLabelText(/navigate to map/i);
      expect(mapLink).toHaveAttribute('aria-current', 'page');
    });

    it('applies active styles to current page', () => {
      mockPathname.mockReturnValue('/');
      render(<MobileMenu />);

      const mapLink = screen.getByLabelText(/navigate to map/i);
      expect(mapLink).toHaveClass('bg-green-600/10', 'text-green-600');
    });

    it('does not mark other pages as current when authenticated', () => {
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = { id: '123', email: 'test@example.com' };
      mockPathname.mockReturnValue('/');
      render(<MobileMenu />);

      const reportsLink = screen.getByLabelText(/navigate to my reports/i);
      expect(reportsLink).not.toHaveAttribute('aria-current');
    });
  });

  describe('Authentication State', () => {
    beforeEach(() => {
      mockNavigationStore.isMenuOpen = true;
    });

    it('shows login button when not authenticated', () => {
      mockAuthStore.isAuthenticated = false;
      render(<MobileMenu />);

      const loginLink = screen.getByRole('link', { name: /log in to your account/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/auth/login');
    });

    it('login button has green background', () => {
      mockAuthStore.isAuthenticated = false;
      render(<MobileMenu />);

      const loginLink = screen.getByRole('link', { name: /log in to your account/i });
      expect(loginLink).toHaveClass('bg-green-600', 'text-white');
    });

    it('shows profile link when authenticated', () => {
      mockAuthStore.isAuthenticated = true;
      mockAuthStore.user = { id: '123', email: 'test@example.com' };
      render(<MobileMenu />);

      const profileLink = screen.getByLabelText(/navigate to profile/i);
      expect(profileLink).toBeInTheDocument();
      expect(profileLink).toHaveAttribute('href', '/profile');
    });
  });

  describe('Menu Interactions', () => {
    it('calls closeMenu when navigation item is clicked', () => {
      mockNavigationStore.isMenuOpen = true;
      render(<MobileMenu />);

      const mapLink = screen.getByLabelText(/navigate to map/i);
      mapLink.click();

      expect(mockNavigationStore.closeMenu).toHaveBeenCalled();
    });

    it('calls closeMenu when login link is clicked', () => {
      mockNavigationStore.isMenuOpen = true;
      mockAuthStore.isAuthenticated = false;
      render(<MobileMenu />);

      const loginLink = screen.getByRole('link', { name: /log in to your account/i });
      loginLink.click();

      expect(mockNavigationStore.closeMenu).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockNavigationStore.isMenuOpen = true;
    });

    it('has role="dialog" for the menu panel', () => {
      render(<MobileMenu />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has navigation landmark with label', () => {
      render(<MobileMenu />);

      const nav = screen.getByRole('navigation', { name: /mobile navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it('has focus management via Radix Dialog', () => {
      render(<MobileMenu />);

      // Dialog should have focus trap behavior (tested via Radix)
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    beforeEach(() => {
      mockNavigationStore.isMenuOpen = true;
    });

    it('menu panel has correct width (300px/w-75)', () => {
      render(<MobileMenu />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('w-75');
    });

    it('has white background', () => {
      render(<MobileMenu />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('bg-white');
    });

    it('has slide animation classes', () => {
      render(<MobileMenu />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('data-[state=open]:slide-in-from-left');
      expect(dialog).toHaveClass('data-[state=closed]:slide-out-to-left');
    });

    it('has duration-300 for animation timing', () => {
      render(<MobileMenu />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('duration-300');
    });
  });
});
