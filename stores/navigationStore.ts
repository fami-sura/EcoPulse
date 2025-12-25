/**
 * Navigation Store - Zustand
 *
 * Manages navigation UI state:
 * - Mobile menu open/close
 * - Active route
 */

import { create } from 'zustand';

interface NavigationState {
  // Mobile menu state
  isMenuOpen: boolean;

  // Actions
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  // Initial state
  isMenuOpen: false,

  // Actions
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}));
