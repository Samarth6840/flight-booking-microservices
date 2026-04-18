import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getStoredUser } from '@/services/api';

export function useAuthGuard(redirectPath?: string) {
  const [, setLocation] = useLocation();
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      const targetPath = redirectPath || window.location.pathname;
      setLocation(`/auth?redirect=${encodeURIComponent(targetPath)}`);
    }
  }, [user, redirectPath, setLocation]);

  return user;
}