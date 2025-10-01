'use client';

import { SessionProvider } from 'next-auth/react';
import AppInitializer from './AppInitializer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppInitializer>
        {children}
      </AppInitializer>
    </SessionProvider>
  );
}