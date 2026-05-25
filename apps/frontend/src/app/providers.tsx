import { esMX } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <ClerkProvider localization={esMX}>
      {children}
      <Toaster />
    </ClerkProvider>
  );
}
