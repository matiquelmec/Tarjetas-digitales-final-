// Hook to handle user setup after successful authentication
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useUserSetup() {
  const { data: session, status } = useSession();
  const [userSetupComplete, setUserSetupComplete] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);

  useEffect(() => {
    const setupUser = async () => {
      if (status === 'authenticated' && session?.user?.email && !userSetupComplete && !isSettingUp) {
        setIsSettingUp(true);

        try {
          console.log('🔧 Setting up user in database:', session.user.email);

          const response = await fetch('/api/user/ensure', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name || '',
              image: session.user.image || '',
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('✅ User setup complete:', userData.id);
            setUserSetupComplete(true);
          } else {
            console.warn('⚠️ User setup failed, but auth still works');
            setUserSetupComplete(true); // Continue anyway
          }
        } catch (error) {
          console.error('❌ User setup error:', error);
          setUserSetupComplete(true); // Continue anyway
        } finally {
          setIsSettingUp(false);
        }
      }
    };

    setupUser();
  }, [session, status, userSetupComplete, isSettingUp]);

  return {
    isAuthenticated: status === 'authenticated',
    userSetupComplete,
    isSettingUp,
    user: session?.user,
  };
}