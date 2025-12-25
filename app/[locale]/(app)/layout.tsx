import { Toaster } from 'sonner';
import { DesktopNav, MobileHeader } from '@/components/navigation';
import { AuthProvider } from '@/components/auth';

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <AuthProvider>
      {/* Desktop Navigation - hidden on mobile */}
      <DesktopNav />

      {/* Mobile Header with navigation and auth */}
      <MobileHeader />

      {/* Main content */}
      <main>{children}</main>

      {/* Toast notifications */}
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}
