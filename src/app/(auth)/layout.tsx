import type { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth'; // Import AuthProvider

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider> {/* Wrap with AuthProvider */}
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
