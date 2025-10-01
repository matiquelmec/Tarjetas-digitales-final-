'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function usePostLoginRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Check if there's a user intention stored
      const userIntention = sessionStorage.getItem('userIntention');
      
      if (userIntention) {
        // Clear the stored intention
        sessionStorage.removeItem('userIntention');
        
        // Always redirect to dashboard but store the intention for dashboard to use
        sessionStorage.setItem('dashboardAction', userIntention);
        console.log('Redirecting after login to dashboard with intention:', userIntention);
        router.push('/dashboard');
      }
    }
  }, [session, status, router]);
}